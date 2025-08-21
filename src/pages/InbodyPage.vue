<template>
  <q-page padding>
    <div class="container fade-in-up">
      <div class="section text-h4 q-ma-lg text-center">身體數據管理</div>
      <p class="section-description text-center q-mb-lg">
        您可以找到各種健身相關的文章，涵蓋不同的健身主題和技巧。無論您是初學者還是有經驗的健身愛好者，都能找到有價值的資訊。
      </p>

      <!-- Inbody 資料輸入表單 -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="text-h6 q-mb-md">新增身體數據</div>
          <q-form @submit.prevent="submitInbodyData" ref="inbodyForm">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-3">
                <q-input
                  filled
                  v-model="formData.weight"
                  label="體重 (kg)"
                  type="number"
                  step="0.1"
                  lazy-rules
                  :rules="[
                    (val) => val > 0 || '請輸入有效的體重',
                    (val) => val <= 500 || '體重數值過高',
                  ]"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  filled
                  v-model="formData.fat"
                  label="體脂肪 (kg)"
                  type="number"
                  step="0.1"
                  lazy-rules
                  :rules="[
                    (val) => val > 0 || '請輸入有效的體脂肪重量',
                    (val) => val <= 100 || '體脂肪重量過高',
                  ]"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  filled
                  v-model="formData.muscleMass"
                  label="肌肉量 (kg)"
                  type="number"
                  step="0.1"
                  lazy-rules
                  :rules="[
                    (val) => val > 0 || '請輸入有效的肌肉重量',
                    (val) => val <= 200 || '肌肉重量過高',
                  ]"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  filled
                  v-model="formData.recordDate"
                  label="記錄日期"
                  readonly
                  :rules="[(val) => !!val || '請選擇記錄日期']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formData.recordDate" :options="dateOptions" today-btn>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="確定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="text-center q-mt-md">
              <q-btn
                label="新增資料"
                type="submit"
                color="primary"
                size="md"
                :loading="submitting"
                :disable="!isFormValid"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <!-- 折線圖顯示 -->
      <InbodyChartsSection
        :inbody-history="inbodyStore.inbodyRecords"
        :loading="inbodyStore.loading"
      />

      <!-- Inbody 紀錄表格 -->
      <q-card class="q-mt-lg">
        <q-card-section>
          <div class="text-h6 q-mb-md">身體數據紀錄</div>
          <q-table
            :rows="inbodyStore.sortedRecords"
            :columns="tableColumns"
            row-key="_id"
            :loading="inbodyStore.loading"
            no-data-label="尚無身體數據紀錄"
            loading-label="載入中..."
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:body-cell-recordDate="props">
              <q-td :props="props">
                {{ formatDate(props.value) }}
              </q-td>
            </template>

            <template v-slot:body-cell-fatPercentage="props">
              <q-td :props="props">
                {{ calculateFatPercentage(props.row.fat, props.row.weight) }}%
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  size="sm"
                  @click="editRecord(props.row)"
                  class="q-mr-xs"
                >
                  <q-tooltip>編輯</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="confirmDelete(props.row)"
                >
                  <q-tooltip>刪除</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <!-- 編輯對話框 -->
      <q-dialog v-model="editDialog" persistent>
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">編輯身體數據</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="updateRecord" ref="editForm">
              <div class="q-gutter-md">
                <q-input
                  filled
                  v-model="editFormData.weight"
                  label="體重 (kg)"
                  type="number"
                  step="0.1"
                  lazy-rules
                  :rules="[
                    (val) => val > 0 || '請輸入有效的體重',
                    (val) => val <= 500 || '體重數值過高',
                  ]"
                />
                <q-input
                  filled
                  v-model="editFormData.fat"
                  label="體脂肪 (kg)"
                  type="number"
                  step="0.1"
                  lazy-rules
                  :rules="[
                    (val) => val > 0 || '請輸入有效的體脂肪重量',
                    (val) => val <= 100 || '體脂肪重量過高',
                  ]"
                />
                <q-input
                  filled
                  v-model="editFormData.muscleMass"
                  label="肌肉量 (kg)"
                  type="number"
                  step="0.1"
                  lazy-rules
                  :rules="[
                    (val) => val > 0 || '請輸入有效的肌肉重量',
                    (val) => val <= 200 || '肌肉重量過高',
                  ]"
                />
                <q-input
                  filled
                  v-model="editFormData.recordDate"
                  label="記錄日期"
                  readonly
                  :rules="[(val) => !!val || '請選擇記錄日期']"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="editFormData.recordDate" :options="dateOptions" today-btn>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="確定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="取消" v-close-popup />
            <q-btn label="更新" color="primary" @click="updateRecord" :loading="submitting" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- 載入中 -->
      <div v-if="inbodyStore.loading" class="flex flex-center q-py-xl">
        <q-spinner color="primary" size="3em" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useInbodyStore } from 'src/stores/inbody'
import InbodyChartsSection from 'src/components/InbodyChartsSection.vue'

const $q = useQuasar()
const inbodyStore = useInbodyStore()
const submitting = ref(false)
const editDialog = ref(false)
const editingRecord = ref(null)

// 表單資料
const formData = reactive({
  weight: null,
  fat: null,
  muscleMass: null,
  recordDate: new Date().toISOString().split('T')[0], // 預設為今天
})

// 編輯表單資料
const editFormData = reactive({
  weight: null,
  fat: null,
  muscleMass: null,
  recordDate: null,
})

// 表格欄位定義
const tableColumns = [
  {
    name: 'recordDate',
    label: '記錄日期',
    align: 'left',
    field: (row) => row.recordDate || row.createdAt,
    sortable: true,
  },
  {
    name: 'weight',
    label: '體重 (kg)',
    align: 'center',
    field: 'weight',
    sortable: true,
    format: (val) => `${val.toFixed(1)} kg`,
  },
  {
    name: 'fat',
    label: '體脂肪 (kg)',
    align: 'center',
    field: 'fat',
    sortable: true,
    format: (val) => `${val.toFixed(1)} kg`,
  },
  {
    name: 'fatPercentage',
    label: '體脂率 (%)',
    align: 'center',
    field: (row) => ((row.fat / row.weight) * 100).toFixed(1),
    sortable: true,
  },
  {
    name: 'muscleMass',
    label: '肌肉量 (kg)',
    align: 'center',
    field: 'muscleMass',
    sortable: true,
    format: (val) => `${val.toFixed(1)} kg`,
  },
  {
    name: 'actions',
    label: '操作',
    align: 'center',
    field: '',
    sortable: false,
  },
]

// 日期選項限制（不能選擇未來日期）
const dateOptions = (date) => {
  const today = new Date()
  const selectedDate = new Date(date)
  return selectedDate <= today
}

// 表單驗證
const isFormValid = computed(() => {
  return formData.weight > 0 && formData.fat > 0 && formData.muscleMass > 0 && formData.recordDate
})

// 提交 Inbody 資料
const submitInbodyData = async () => {
  try {
    submitting.value = true
    await inbodyStore.addInbodyRecord({
      weight: Number(formData.weight),
      fat: Number(formData.fat),
      muscleMass: Number(formData.muscleMass),
      recordDate: formData.recordDate, // 包含使用者選擇的日期
    })

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'check',
      message: '身體數據新增成功',
    })

    // 清空表單
    Object.assign(formData, {
      weight: null,
      fat: null,
      muscleMass: null,
      recordDate: new Date().toISOString().split('T')[0], // 重設為今天
    })
  } catch (error) {
    console.error('新增身體數據失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: error?.response?.data?.message || '新增失敗，請稍後再試',
    })
  } finally {
    submitting.value = false
  }
}

// 取得 Inbody 歷史資料
const fetchInbodyHistory = async () => {
  try {
    await inbodyStore.fetchInbodyHistory()
  } catch (error) {
    console.error('取得身體數據失敗:', error)
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 計算體脂率
const calculateFatPercentage = (fat, weight) => {
  if (!fat || !weight) return '0.0'
  return ((fat / weight) * 100).toFixed(1)
}

// 編輯記錄
const editRecord = (record) => {
  editingRecord.value = record
  Object.assign(editFormData, {
    weight: record.weight,
    fat: record.fat,
    muscleMass: record.muscleMass,
    recordDate: record.recordDate || record.createdAt?.split('T')[0],
  })
  editDialog.value = true
}

// 更新記錄
const updateRecord = async () => {
  try {
    submitting.value = true
    await inbodyStore.updateInbodyRecord(editingRecord.value._id, {
      weight: Number(editFormData.weight),
      fat: Number(editFormData.fat),
      muscleMass: Number(editFormData.muscleMass),
      recordDate: editFormData.recordDate,
    })

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'check',
      message: '身體數據更新成功',
    })

    editDialog.value = false
    editingRecord.value = null
  } catch (error) {
    console.error('更新身體數據失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: error?.response?.data?.message || '更新失敗，請稍後再試',
    })
  } finally {
    submitting.value = false
  }
}

// 確認刪除
const confirmDelete = (record) => {
  $q.dialog({
    title: '確認刪除',
    message: `確定要刪除 ${formatDate(record.recordDate || record.createdAt)} 的身體數據嗎？`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteRecord(record._id)
  })
}

// 刪除記錄
const deleteRecord = async (recordId) => {
  try {
    await inbodyStore.deleteInbodyRecord(recordId)
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'check',
      message: '身體數據刪除成功',
    })
  } catch (error) {
    console.error('刪除身體數據失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: error?.response?.data?.message || '刪除失敗，請稍後再試',
    })
  }
}

// 頁面載入時獲取歷史資料
onMounted(() => {
  fetchInbodyHistory()
})
</script>

<style scoped lang="scss">
/* 動畫效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.section {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
}
.section-description {
  color: #718096;
  line-height: 1.6;
  font-size: 1rem;
}
</style>
