<!-- views/dashboard/index.vue -->
<template>
  <div class="dashboard">
    <a-row :gutter="24">
      <a-col :span="24">
        <a-card>
          <template #title>
            <h2>{{ $t('dashboard.title') }}</h2>
          </template>
          <p>{{ $t('dashboard.welcome') }}</p>
        </a-card>
      </a-col>
      
      <a-col :span="12">
        <a-card title="图表示例">
          <div ref="chartRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
      
      <a-col :span="12">
        <a-card title="流程图示例">
          <div ref="graphRef" style="height: 300px;"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { Graph } from '@antv/x6'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 图表引用
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 流程图引用
const graphRef = ref<HTMLDivElement | null>(null)
let graphInstance: Graph | null = null

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    
    // 图表配置
    const option = {
      title: {
        text: '销售统计'
      },
      tooltip: {},
      xAxis: {
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20, 8]
        }
      ]
    }
    
    chartInstance.setOption(option)
  }
}

// 初始化流程图
const initGraph = () => {
  if (graphRef.value) {
    graphInstance = new Graph({
      container: graphRef.value,
      width: graphRef.value.offsetWidth,
      height: graphRef.value.offsetHeight,
      grid: true,
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true
      },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8
          }
        }
      }
    })
    
    // 添加节点
    const rect = graphInstance.addNode({
      shape: 'rect',
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: '开始'
    })
    
    const circle = graphInstance.addNode({
      shape: 'circle',
      x: 180,
      y: 180,
      width: 40,
      height: 40,
      label: '结束'
    })
    
    // 添加边
    graphInstance.addEdge({
      source: rect,
      target: circle,
      label: '流程'
    })
  }
}

// 组件挂载时初始化
onMounted(() => {
  initChart()
  initGraph()
})

// 组件卸载前清理
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  
  if (graphInstance) {
    graphInstance.dispose()
  }
})

// 窗口大小改变时重置图表大小
window.addEventListener('resize', () => {
  if (chartInstance) {
    chartInstance.resize()
  }
  
  if (graphInstance && graphRef.value) {
    graphInstance.resize(graphRef.value.offsetWidth, graphRef.value.offsetHeight)
  }
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
}
</style>