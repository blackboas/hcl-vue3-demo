<template>
  <div class="flowChart">
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'



import { onMounted, ref, h, defineComponent } from 'vue'
import { Graph, Node, Path, Edge, Platform, StringExt } from '@antv/x6'
import { Selection } from '@antv/x6-plugin-selection'
import { register } from '@antv/x6-vue-shape'
import { Dropdown, Tooltip } from 'ant-design-vue'

// 节点类型
enum NodeType {
  INPUT = 'INPUT', // 数据输入
  FILTER = 'FILTER', // 数据过滤
  JOIN = 'JOIN', // 数据连接
  UNION = 'UNION', // 数据合并
  AGG = 'AGG', // 数据聚合
  OUTPUT = 'OUTPUT', // 数据输出
}

// 元素校验状态
enum CellStatus {
  DEFAULT = 'default',
  SUCCESS = 'success',
  ERROR = 'error',
}

// 节点位置信息
interface Position {
  x: number
  y: number
}

// 加工类型列表
const PROCESSING_TYPE_LIST = [
  {
    type: 'FILTER',
    name: '数据筛选',
  },
  {
    type: 'JOIN',
    name: '数据连接',
  },
  {
    type: 'UNION',
    name: '数据合并',
  },
  {
    type: 'AGG',
    name: '数据聚合',
  },
  {
    type: 'OUTPUT',
    name: '数据输出',
  },
]

// 不同节点类型的icon
const NODE_TYPE_LOGO: Record<string, string> = {
  INPUT:
    'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*RXnuTpQ22xkAAAAAAAAAAAAADtOHAQ/original', // 数据输入
  FILTER:
    'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*ZJ6qToit8P4AAAAAAAAAAAAADtOHAQ/original', // 数据筛选
  JOIN: 'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*EHqyQoDeBvIAAAAAAAAAAAAADtOHAQ/original', // 数据连接
  UNION:
    'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*k4eyRaXv8gsAAAAAAAAAAAAADtOHAQ/original', // 数据合并
  AGG: 'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*TKG8R6nfYiAAAAAAAAAAAAAADtOHAQ/original', // 数据聚合
  OUTPUT:
    'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*zUgORbGg1HIAAAAAAAAAAAAADtOHAQ/original', // 数据输出
}

/**
 * 根据起点初始下游节点的位置信息
 * @param node 起始节点
 * @param graph
 * @returns
 */
const getDownstreamNodePosition = (
  node: Node,
  graph: Graph,
  dx = 250,
  dy = 100,
) => {
  // 找出画布中以该起始节点为起点的相关边的终点id集合
  const downstreamNodeIdList: string[] = []
  graph.getEdges().forEach((edge) => {
    const originEdge = edge.toJSON()?.data
    if (originEdge.source === node.id) {
      downstreamNodeIdList.push(originEdge.target)
    }
  })
  // 获取起点的位置信息
  const position = node.getPosition()
  let minX = Infinity
  let maxY = -Infinity
  graph.getNodes().forEach((graphNode) => {
    if (downstreamNodeIdList.indexOf(graphNode.id) > -1) {
      const nodePosition = graphNode.getPosition()
      // 找到所有节点中最左侧的节点的x坐标
      if (nodePosition.x < minX) {
        minX = nodePosition.x
      }
      // 找到所有节点中最x下方的节点的y坐标
      if (nodePosition.y > maxY) {
        maxY = nodePosition.y
      }
    }
  })

  return {
    x: minX !== Infinity ? minX : position.x + dx,
    y: maxY !== -Infinity ? maxY + dy : position.y,
  }
}

// 根据节点的类型获取ports
const getPortsByType = (type: NodeType, nodeId: string) => {
  let ports = []
  switch (type) {
    case NodeType.INPUT:
      ports = [
        {
          id: `${nodeId}-out`,
          group: 'out',
        },
      ]
      break
    case NodeType.OUTPUT:
      ports = [
        {
          id: `${nodeId}-in`,
          group: 'in',
        },
      ]
      break
    default:
      ports = [
        {
          id: `${nodeId}-in`,
          group: 'in',
        },
        {
          id: `${nodeId}-out`,
          group: 'out',
        },
      ]
      break
  }
  return ports
}

/**
 * 创建节点并添加到画布
 * @param type 节点类型
 * @param graph
 * @param position 节点位置
 * @returns
 */
const createNode = (
  type: NodeType,
  graph: Graph,
  position?: Position,
) => {
  if (!graph) {
    return {}
  }
  let newNode = {}
  const sameTypeNodes = graph
    .getNodes()
    .filter((item) => item.getData()?.type === type)
  const typeName = PROCESSING_TYPE_LIST?.find(
    (item) => item.type === type,
  )?.name
  const id = StringExt.uuid()
  const node = {
    id,
    shape: 'data-processing-dag-node',
    x: position?.x,
    y: position?.y,
    ports: getPortsByType(type, id),
    data: {
      name: `${typeName}_${sameTypeNodes.length + 1}`,
      type,
    },
  }
  newNode = graph.addNode(node)
  return newNode
}

/**
 * 创建边并添加到画布
 * @param source
 * @param target
 * @param graph
 */
const createEdge = (source: string, target: string, graph: Graph) => {
  const edge = {
    id: StringExt.uuid(),
    shape: 'data-processing-curve',
    source: {
      cell: source,
      port: `${source}-out`,
    },
    target: {
      cell: target,
      port: `${target}-in`,
    },
    zIndex: -1,
    data: {
      source,
      target,
    },
  }
  if (graph) {
    graph.addEdge(edge)
  }
}

// 定义Vue组件用于X6节点
const DataProcessingDagNode = defineComponent({
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const plusActionSelected = ref(false)
    
    // 创建下游的节点和边
    const createDownstream = (type: NodeType) => {
      const { node } = props
      const { graph } = node.model || {}
      if (graph) {
        // 获取下游节点的初始位置信息
        const position = getDownstreamNodePosition(node as any, graph)
        // 创建下游节点
        const newNode: any = createNode(type, graph, position)
        const source = node.id
        const target = newNode.id
        // 创建该节点出发到下游节点的边
        createEdge(source, target, graph)
      }
    }

    // 点击添加下游+号
    const clickPlusDragMenu = (type: NodeType) => {
      createDownstream(type)
      plusActionSelected.value = false
    }

    // 获取+号下拉菜单
    const getPlusDagMenu = () => {
      // 添加一个包装容器，确保样式正确应用
      return h('div', { class: 'processing-node-menu' }, [
        h('ul', { 
          style: { margin: 0, padding: 0 } 
        }, 
        PROCESSING_TYPE_LIST.map((item) => {
          const content = h('a', {
            onClick: () => {
              clickPlusDragMenu(item.type as NodeType)
            },
            style: { 
              display: 'inline-block',
              width: '100%',
              height: '16px',
              fontFamily: 'PingFangSC',
              fontWeight: 400,
              fontSize: '12px',
              color: 'rgba(0, 0, 0, 65%)'
            }
          }, [
            h('i', {
              class: 'node-mini-logo',
              style: { 
                backgroundImage: `url(${NODE_TYPE_LOGO[item.type]})`,
                display: 'inline-block',
                width: '16px',
                height: '16px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '100%',
                verticalAlign: 'top'
              }
            }),
            h('span', {
              style: {
                marginLeft: '8px',
                verticalAlign: 'top'
              }
            }, item.name)
          ])
          return h('li', {
            class: 'each-sub-menu',
            key: item.type,
            style: {
              listStyle: 'none',
              padding: '6px 12px',
              width: '100%',
              cursor: 'pointer'
            }
          }, content)
        })
      )
      ])
    }

    // 添加下游菜单的打开状态变化
    const onPlusDropdownOpenChange = (value: boolean) => {
      plusActionSelected.value = value
    }

    // 鼠标进入矩形主区域的时候显示连接桩
    const onMainMouseEnter = () => {
      const { node } = props
      // 获取该节点下的所有连接桩
      const ports = node.getPorts() || []
      ports.forEach((port: any) => {
        node.setPortProp(port.id, 'attrs/circle', {
          fill: '#fff',
          stroke: '#85A5FF',
        })
      })
    }

    // 鼠标离开矩形主区域的时候隐藏连接桩
    const onMainMouseLeave = () => {
      const { node } = props
      // 获取该节点下的所有连接桩
      const ports = node.getPorts() || []
      ports.forEach((port: any) => {
        node.setPortProp(port.id, 'attrs/circle', {
          fill: 'transparent',
          stroke: 'transparent',
        })
      })
    }

    return () => {
      const { node } = props
      const data = node?.getData()
      const { name, type, status, statusMsg } = data

      return h('div', { class: 'data-processing-dag-node' }, [
        h('div', {
          class: 'main-area',
          onMouseenter: onMainMouseEnter,
          onMouseleave: onMainMouseLeave
        }, [
          h('div', { class: 'main-info' }, [
            // 节点类型icon
            h('i', {
              class: 'node-logo',
              style: { backgroundImage: `url(${NODE_TYPE_LOGO[type]})` }
            }),
            h(Tooltip, {
              title: name,
              mouseEnterDelay: 0.8
            }, () => h('div', { class: 'ellipsis-row node-name' }, name))
          ]),
          // 节点状态信息
          h('div', { class: 'status-action' }, [
            status === CellStatus.ERROR ? 
              h(Tooltip, {
                title: statusMsg
              }, () => h('i', { class: 'status-icon status-icon-error' })) : null,
            status === CellStatus.SUCCESS ? 
              h('i', { class: 'status-icon status-icon-success' }) : null,
            // 节点操作菜单
            h('div', { class: 'more-action-container' }, [
              h('i', { class: 'more-action' })
            ])
          ])
        ]),
        // 添加下游节点
        type !== NodeType.OUTPUT ? 
          h('div', { class: 'plus-dag' }, [
            h(Dropdown, {
              trigger: ['click'],
              placement: 'bottom',
              open: plusActionSelected.value,
              onOpenChange: onPlusDropdownOpenChange
            }, {
              default: () => h('i', {
                class: ['plus-action', { 'plus-action-selected': plusActionSelected.value }]
              }),
              overlay: () => getPlusDagMenu()
            })
          ]) : null
      ])
    }
  }
})

register({
  shape: 'data-processing-dag-node',
  width: 212,
  height: 48,
  component: DataProcessingDagNode,
  // port默认不可见
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 1,
            fill: 'transparent',
          },
        },
      },
      out: {
        position: {
          name: 'right',
          args: {
            dx: -32,
          },
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 1,
            fill: 'transparent',
          },
        },
      },
    },
  },
})

// 注册连线
Graph.registerConnector(
  'curveConnector',
  (sourcePoint, targetPoint) => {
    const hgap = Math.abs(targetPoint.x - sourcePoint.x)
    const path = new Path()
    path.appendSegment(
      Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y),
    )
    path.appendSegment(
      Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y),
    )
    // 水平三阶贝塞尔曲线
    path.appendSegment(
      Path.createSegment(
        'C',
        sourcePoint.x < targetPoint.x
          ? sourcePoint.x + hgap / 2
          : sourcePoint.x - hgap / 2,
        sourcePoint.y,
        sourcePoint.x < targetPoint.x
          ? targetPoint.x - hgap / 2
          : targetPoint.x + hgap / 2,
        targetPoint.y,
        targetPoint.x - 6,
        targetPoint.y,
      ),
    )
    path.appendSegment(
      Path.createSegment('L', targetPoint.x + 2, targetPoint.y),
    )

    return path.serialize()
  },
  true,
)

Edge.config({
  markup: [
    {
      tagName: 'path',
      selector: 'wrap',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
        stroke: 'transparent',
        strokeLinecap: 'round',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
        pointerEvents: 'none',
      },
    },
  ],
  connector: { name: 'curveConnector' },
  attrs: {
    wrap: {
      connection: true,
      strokeWidth: 10,
      strokeLinejoin: 'round',
    },
    line: {
      connection: true,
      stroke: '#A2B1C3',
      strokeWidth: 1,
      targetMarker: {
        name: 'classic',
        size: 6,
      },
    },
  },
})

Graph.registerEdge('data-processing-curve', Edge, true)

let graph: Graph

// 节点状态列表
const nodeStatusList = [
  {
    id: 'node-0',
    status: 'success',
  },
  {
    id: 'node-1',
    status: 'success',
  },
  {
    id: 'node-2',
    status: 'success',
  },
  {
    id: 'node-3',
    status: 'success',
  },
  {
    id: 'node-4',
    status: 'error',
    statusMsg: '错误信息示例',
  },
]

// 边状态列表
const edgeStatusList = [
  {
    id: 'edge-0',
    status: 'success',
  },
  {
    id: 'edge-1',
    status: 'success',
  },
  {
    id: 'edge-2',
    status: 'success',
  },
  {
    id: 'edge-3',
    status: 'success',
  },
]

// 显示节点状态
const showNodeStatus = () => {
  nodeStatusList.forEach((item) => {
    const { id, status, statusMsg } = item
    const node = graph.getCellById(id)
    const data = node.getData() as any
    node.setData({
      ...data,
      status,
      statusMsg,
    })
  })
}

// 开启边的运行动画
const excuteAnimate = () => {
  graph.getEdges().forEach((edge) => {
    edge.attr({
      line: {
        stroke: '#3471F9',
      },
    })
    edge.attr('line/strokeDasharray', 5)
    edge.attr('line/style/animation', 'running-line 30s infinite linear')
  })
}

// 关闭边的动画
const stopAnimate = () => {
  graph.getEdges().forEach((edge) => {
    edge.attr('line/strokeDasharray', 0)
    edge.attr('line/style/animation', '')
  })
  edgeStatusList.forEach((item) => {
    const { id, status } = item
    const edge = graph.getCellById(id)
    if (status === 'success') {
      edge.attr('line/stroke', '#52c41a')
    }
    if (status === 'error') {
      edge.attr('line/stroke', '#ff4d4f')
    }
  })
  // 默认选中一个节点
  graph.select('node-2')
}

onMounted(() => {
  graph = new Graph({
    container: document.getElementById('container')!,
    panning: {
      enabled: true,
      eventTypes: ['leftMouseDown', 'mouseWheel'],
    },
    mousewheel: {
      enabled: true,
      modifiers: 'ctrl',
      factor: 1.1,
      maxScale: 1.5,
      minScale: 0.5,
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#31d0c6',
            strokeWidth: 4,
          },
        },
      },
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      sourceAnchor: {
        name: 'left',
        args: {
          dx: Platform.IS_SAFARI ? 4 : 8,
        },
      },
      targetAnchor: {
        name: 'right',
        args: {
          dx: Platform.IS_SAFARI ? 4 : -8,
        },
      },
      createEdge() {
        return graph.createEdge({
          shape: 'data-processing-curve',
          attrs: {
            line: {
              strokeDasharray: '5 5',
            },
          },
          zIndex: -1,
        })
      },
      // 连接桩校验
      validateConnection({ sourceMagnet, targetMagnet }) {
        // 只能从输出链接桩创建连接
        if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
          return false
        }
        // 只能连接到输入链接桩
        if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
          return false
        }
        return true
      },
    },
  })

  graph.use(
    new Selection({
      multiple: true,
      rubberEdge: true,
      rubberNode: true,
      modifiers: 'shift',
      rubberband: true,
    }),
  )

  fetch('./data/data-processing-dag.json')
    .then((response) => response.json())
    .then((data) => {
      graph.fromJSON(data)
      const zoomOptions = {
        padding: {
          left: 10,
          right: 10,
        },
      }
      graph.zoomToFit(zoomOptions)
      setTimeout(() => {
        excuteAnimate()
      }, 2000)
      setTimeout(() => {
        showNodeStatus()
        stopAnimate()
      }, 3000)
    })
})

// 插入CSS样式
const insertCss = (css: string) => {
  const style = document.createElement('style')
  style.innerHTML = css
  document.head.appendChild(style)
}

insertCss(`
  .data-processing-dag-node {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .main-area {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px;
    width: 180px;
    height: 48px;
    color: rgba(0, 0, 0, 65%);
    font-size: 12px;
    font-family: PingFangSC;
    line-height: 24px;
    background-color: #fff;
    box-shadow: 0 -1px 4px 0 rgba(209, 209, 209, 50%), 1px 1px 4px 0 rgba(217, 217, 217, 50%);
    border-radius: 2px;
    border: 1px solid transparent;
  }
  .main-area:hover {
    border: 1px solid rgba(0, 0, 0, 10%);
    box-shadow: 0 -2px 4px 0 rgba(209, 209, 209, 50%), 2px 2px 4px 0 rgba(217, 217, 217, 50%);
  }

  .node-logo {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
  }

  .node-name {
    overflow: hidden;
    display: inline-block;
    width: 70px;
    margin-left: 6px;
    color: rgba(0, 0, 0, 65%);
    font-size: 12px;
    font-family: PingFangSC;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: top;
  }

  .status-action {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .status-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .status-icon-error {
    background: url('https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ')
      no-repeat center center / 100% 100%;
  }

  .status-icon-success {
    background: url('https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ')
      no-repeat center center / 100% 100%;
  }

  .more-action-container {
    margin-left: 12px;
    width: 15px;
    height: 15px;
    text-align: center;
    cursor: pointer;
  }

  .more-action {
    display: inline-block;
    width: 3px;
    height: 15px;
    background: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*tFw7SIy-ttQAAAAAAAAAAAAADtOHAQ/original')
      no-repeat center center / 100% 100%;
  }

  .plus-dag {
    visibility: hidden;
    position: relative;
    margin-left: 12px;
    height: 48px;
  }

  .plus-action {
    position: absolute;
    top: calc(50% - 8px);
    left: 0;
    width: 16px;
    height: 16px;
    background: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*ScX2R4ODfokAAAAAAAAAAAAADtOHAQ/original')
      no-repeat center center / 100% 100%;
    cursor: pointer;
  }
  .plus-action:hover {
    background-image: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*tRaoS5XhsuQAAAAAAAAAAAAADtOHAQ/original');
  }

  .plus-action:active,
  .plus-action-selected {
    background-image: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*k9cnSaSmlw4AAAAAAAAAAAAADtOHAQ/original');
  }

  .x6-node-selected .main-area {
    border-color: #3471f9;
  }

  .x6-node-selected .plus-dag {
    visibility: visible;
  }

  .processing-node-menu {
    padding: 2px 0;
    width: 105px;
    background-color: #fff;
    box-shadow: 0 9px 28px 8px rgba(0, 0, 0, 5%), 0 6px 16px 0 rgba(0, 0, 0, 8%),
      0 3px 6px -4px rgba(0, 0, 0, 12%);
    border-radius: 2px;
  }
  .processing-node-menu ul {
    margin: 0;
    padding: 0;
  }
  .processing-node-menu li {
    list-style:none;
  }

  .each-sub-menu {
    padding: 6px 12px;
    width: 100%;
  }

  .each-sub-menu:hover {
    background-color: rgba(0, 0, 0, 4%);
  }

  .each-sub-menu a {
    display: inline-block;
    width: 100%;
    height: 16px;
    font-family: PingFangSC;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 65%);
  }

  .each-sub-menu span {
    margin-left: 8px;
    vertical-align: top;
  }

  .each-disabled-sub-menu a {
    cursor: not-allowed;
      color: rgba(0, 0, 0, 35%);
  }

  .node-mini-logo {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    vertical-align: top;
  }

  @keyframes running-line {
    to {
      stroke-dashoffset: -1000;
    }
  }
`)




const { t } = useI18n()
</script>

<style scoped lang="scss">
.flowChart {
  height: 100%;
  padding: 24px;
  background-color: antiquewhite;
}
#container {
  height: 100%;
  background-color: white;
}
</style>