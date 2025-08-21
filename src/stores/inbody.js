import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import inbodyService from 'src/services/inbody'

export const useInbodyStore = defineStore(
  'inbody',
  () => {
    // 狀態
    const inbodyRecords = ref([])
    const loading = ref(false)
    const error = ref(null)

    // 計算屬性
    const sortedRecords = computed(() => {
      return [...inbodyRecords.value].sort((a, b) => {
        const dateA = new Date(a.recordDate || a.createdAt)
        const dateB = new Date(b.recordDate || b.createdAt)
        return dateA - dateB
      })
    })

    const latestRecord = computed(() => {
      if (inbodyRecords.value.length === 0) return null
      return sortedRecords.value[sortedRecords.value.length - 1]
    })

    const hasData = computed(() => inbodyRecords.value.length > 0)

    // 圖表資料
    const chartLabels = computed(() => {
      return sortedRecords.value.map((item) => {
        const dateStr = item.recordDate || item.createdAt
        const date = new Date(dateStr)
        return `${date.getMonth() + 1}/${date.getDate()}`
      })
    })

    const weightData = computed(() => {
      return sortedRecords.value.map((item) => item.weight)
    })

    const fatData = computed(() => {
      return sortedRecords.value.map((item) => {
        // 體脂肪百分比 = (體脂肪重量 / 體重) * 100
        return ((item.fat / item.weight) * 100).toFixed(1)
      })
    })

    const muscleData = computed(() => {
      return sortedRecords.value.map((item) => item.muscleMass)
    })

    // 動作
    const fetchInbodyHistory = async () => {
      try {
        loading.value = true
        error.value = null

        const { data } = await inbodyService.getAll()
        inbodyRecords.value = data.inbodies || []

        return inbodyRecords.value
      } catch (err) {
        error.value = err
        console.error('載入 Inbody 紀錄失敗:', err)
        throw err
      } finally {
        loading.value = false
      }
    }

    const addInbodyRecord = async (recordData) => {
      try {
        loading.value = true
        error.value = null

        const { data } = await inbodyService.create(recordData)

        // 重新獲取最新資料
        await fetchInbodyHistory()

        return data
      } catch (err) {
        error.value = err
        console.error('新增 Inbody 記錄失敗:', err)
        throw err
      } finally {
        loading.value = false
      }
    }

    const updateInbodyRecord = async (id, recordData) => {
      try {
        loading.value = true
        error.value = null

        const { data } = await inbodyService.updateById(id, recordData)

        // 重新獲取最新資料
        await fetchInbodyHistory()

        return data
      } catch (err) {
        error.value = err
        console.error('更新 Inbody 記錄失敗:', err)
        throw err
      } finally {
        loading.value = false
      }
    }

    const deleteInbodyRecord = async (id) => {
      try {
        loading.value = true
        error.value = null

        await inbodyService.deleteById(id)

        // 從本地狀態中移除該記錄
        inbodyRecords.value = inbodyRecords.value.filter((record) => record._id !== id)

        return true
      } catch (err) {
        error.value = err
        console.error('刪除 Inbody 記錄失敗:', err)
        throw err
      } finally {
        loading.value = false
      }
    }

    const clearInbodyData = () => {
      inbodyRecords.value = []
      error.value = null
    }

    return {
      // 狀態
      inbodyRecords,
      loading,
      error,

      // 計算屬性
      sortedRecords,
      latestRecord,
      hasData,
      chartLabels,
      weightData,
      fatData,
      muscleData,

      // 動作
      fetchInbodyHistory,
      addInbodyRecord,
      updateInbodyRecord,
      deleteInbodyRecord,
      clearInbodyData,
    }
  },
  {
    persist: {
      key: 'inbody-store',
      storage: localStorage,
      paths: ['inbodyRecords'], // 只持久化記錄資料，不持久化 loading 和 error
    },
  },
)
