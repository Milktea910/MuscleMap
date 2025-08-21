<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { computed } from 'vue'
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip,
} from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip)

const props = defineProps({
  labels: {
    type: Array,
    default: () => [],
  },
  datasets: {
    type: Array,
    default: () => [],
  },
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets,
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: props.datasets[0]?.unit ? `數值 (${props.datasets[0].unit})` : '數值',
      },
      grid: {
        color: 'rgba(0,0,0,0.1)',
      },
    },
    x: {
      title: {
        display: true,
        text: '日期',
      },
      grid: {
        color: 'rgba(0,0,0,0.1)',
      },
    },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
}))
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 確保圖表容器不會超出預設高度 */
:deep(canvas) {
  max-height: 100% !important;
  max-width: 100% !important;
}
</style>
