<template>
  <div v-if="inbodyHistory.length > 0" class="row q-col-gutter-lg">
    <!-- 體重圖表 -->
    <div class="col-12 col-lg-4">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">體重變化</div>
          <div style="height: 300px; position: relative">
            <InbodyLineChart
              :labels="chartLabels"
              :datasets="[
                {
                  label: '體重 (kg)',
                  data: weightData,
                  borderColor: '#3b66e0',
                  backgroundColor: 'rgba(59, 102, 224, 0.1)',
                  fill: false,
                  tension: 0.3,
                  unit: 'kg',
                },
              ]"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 體脂率圖表 -->
    <div class="col-12 col-lg-4">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">體脂率變化</div>
          <div style="height: 300px; position: relative">
            <InbodyLineChart
              :labels="chartLabels"
              :datasets="[
                {
                  label: '體脂率 (%)',
                  data: fatData,
                  borderColor: 'rgba(255, 152, 0, 1)',
                  backgroundColor: 'rgba(107, 138, 239, 0.1)',
                  fill: false,
                  tension: 0.3,
                  unit: '%',
                },
              ]"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 肌肉量圖表 -->
    <div class="col-12 col-lg-4">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">肌肉量變化</div>
          <div style="height: 300px; position: relative">
            <InbodyLineChart
              :labels="chartLabels"
              :datasets="[
                {
                  label: '肌肉量 (kg)',
                  data: muscleData,
                  borderColor: 'rgba(76, 175, 80, 1)',
                  backgroundColor: 'rgba(143, 164, 243, 0.1)',
                  fill: false,
                  tension: 0.3,
                  unit: 'kg',
                },
              ]"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <!-- 無資料提示 -->
  <q-card v-else-if="!loading">
    <q-card-section class="text-center">
      <div class="text-h6 text-grey-6">尚無身體數據</div>
      <div class="text-subtitle2 text-grey-5 q-mt-sm">請先新增您的身體數據</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import InbodyLineChart from './InbodyLineChart.vue'

const props = defineProps({
  inbodyHistory: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// 圖表資料計算
const chartLabels = computed(() => {
  return props.inbodyHistory.map((item) => {
    // 優先使用 recordDate，如果沒有則使用 createdAt
    const dateStr = item.recordDate || item.createdAt
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })
})

const weightData = computed(() => {
  return props.inbodyHistory.map((item) => item.weight)
})

const fatData = computed(() => {
  return props.inbodyHistory.map((item) => {
    // 體脂肪百分比 = (體脂肪重量 / 體重) * 100
    return ((item.fat / item.weight) * 100).toFixed(1)
  })
})

const muscleData = computed(() => {
  return props.inbodyHistory.map((item) => item.muscleMass)
})
</script>
