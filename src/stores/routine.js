import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import routineService from 'src/services/routine'

export const useRoutineStore = defineStore(
  'routine',
  () => {
    // 狀態
    const userRoutines = ref([])
    const popularRoutines = ref([])
    const publicRoutines = ref([])
    const loading = ref(false)
    const error = ref(null)
    const likingRoutine = ref(null)

    // 詳細對話框狀態
    const showDetailDialog = ref(false)
    const selectedRoutine = ref(null)
    const selectedDetailDay = ref(0)

    // 快取機制
    const publicRoutinesCache = ref(null)
    const cacheTimestamp = ref(null)
    const CACHE_DURATION = 3 * 60 * 1000 // 3分鐘快取

    // 計算屬性
    const hasRoutines = computed(() => userRoutines.value.length > 0)
    const routineCount = computed(() => userRoutines.value.length)
    const totalLikes = computed(() => {
      return userRoutines.value.reduce((total, routine) => total + (routine.likesCount || 0), 0)
    })
    const isPublicRoutinesLoading = computed(() => loading.value)
    const isLikingAnyRoutine = computed(() => likingRoutine.value !== null)

    // 取得用戶的私人課表
    const fetchUserRoutines = async () => {
      try {
        loading.value = true
        error.value = null
        const { data } = await routineService.getUserRoutines()
        userRoutines.value = data.data || []
        return userRoutines.value
      } catch (err) {
        error.value = err
        console.error('載入個人課表失敗:', err)
        throw err
      } finally {
        loading.value = false
      }
    }

    // 取得熱門課表（公開課表）
    const fetchPopularRoutines = async () => {
      try {
        loading.value = true
        error.value = null
        const { data } = await routineService.getPublicRoutines()
        popularRoutines.value = data.data
        return data.data
      } catch (err) {
        error.value = err
        throw err
      } finally {
        loading.value = false
      }
    }

    // 取得公開課表（帶快取功能）
    const fetchPublicRoutines = async (forceRefresh = false) => {
      const now = Date.now()

      if (
        !forceRefresh &&
        publicRoutinesCache.value &&
        cacheTimestamp.value &&
        now - cacheTimestamp.value < CACHE_DURATION
      ) {
        publicRoutines.value = publicRoutinesCache.value
        return publicRoutinesCache.value
      }

      try {
        loading.value = true
        error.value = null
        const { data } = await routineService.getPublicRoutines()
        publicRoutines.value = data.data
        publicRoutinesCache.value = data.data
        cacheTimestamp.value = now
        return data.data
      } catch (err) {
        error.value = err
        throw err
      } finally {
        loading.value = false
      }
    }

    // 新增課表
    const createRoutine = async (routineData) => {
      try {
        loading.value = true
        error.value = null
        const { data } = await routineService.create(routineData)
        // 重新獲取最新資料
        await fetchUserRoutines()
        return data
      } catch (err) {
        error.value = err
        console.error('新增課表失敗:', err)
        throw err
      } finally {
        loading.value = false
      }
    }

    // 更新課表
    const updateRoutine = async (id, routineData) => {
      try {
        loading.value = true
        error.value = null
        const { data } = await routineService.updateRoutine(id, routineData)
        const index = userRoutines.value.findIndex((r) => r._id === id)
        if (index !== -1) {
          userRoutines.value[index] = data.data
        }
        return data.data
      } catch (err) {
        error.value = err
        throw err
      } finally {
        loading.value = false
      }
    }

    // 刪除課表
    const deleteRoutine = async (routineId) => {
      try {
        loading.value = true
        error.value = null
        await routineService.deleteRoutine(routineId)
        // 重新獲取最新資料
        await fetchUserRoutines()
        return true
      } catch (err) {
        error.value = err
        console.error('刪除課表失敗:', err)
        throw err
      } finally {
        loading.value = false
      }
    }

    // 檢查是否已按讚
    const isLiked = (routine, userId) => {
      if (!userId || !routine.likes) return false
      return routine.likes.includes(userId)
    }

    // 切換按讚狀態
    const toggleLike = async (routineId, userId) => {
      if (!userId) {
        throw new Error('請先登入才能按讚')
      }

      try {
        likingRoutine.value = routineId
        const { data } = await routineService.toggleLike(routineId)

        // 更新公開課表中的按讚資料
        const routine = publicRoutines.value.find((r) => r._id === routineId)
        if (routine) {
          routine.likesCount = data.data.likesCount
          if (data.data.liked) {
            if (!routine.likes) routine.likes = []
            routine.likes.push(userId)
          } else {
            if (routine.likes) {
              const index = routine.likes.indexOf(userId)
              if (index > -1) routine.likes.splice(index, 1)
            }
          }
        }

        // 更新快取
        if (publicRoutinesCache.value) {
          const cachedRoutine = publicRoutinesCache.value.find((r) => r._id === routineId)
          if (cachedRoutine) {
            cachedRoutine.likesCount = data.data.likesCount
            if (data.data.liked) {
              if (!cachedRoutine.likes) cachedRoutine.likes = []
              cachedRoutine.likes.push(userId)
            } else {
              if (cachedRoutine.likes) {
                const index = cachedRoutine.likes.indexOf(userId)
                if (index > -1) cachedRoutine.likes.splice(index, 1)
              }
            }
          }
        }

        return data
      } catch (err) {
        error.value = err
        throw err
      } finally {
        likingRoutine.value = null
      }
    }

    // 顯示課表詳細內容
    const showRoutineDetail = (routine) => {
      selectedRoutine.value = routine
      // 設定為第一個可用的 tab（週計劃的第一天）
      if (routine.weeklyPlan && routine.weeklyPlan.length > 0) {
        selectedDetailDay.value = routine.weeklyPlan[0].day
      } else {
        selectedDetailDay.value = 0
      }
      showDetailDialog.value = true
    }

    // 關閉詳細對話框
    const closeDetailDialog = () => {
      showDetailDialog.value = false
      selectedRoutine.value = null
      selectedDetailDay.value = 0
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

    // 取得星期名稱
    const getDayName = (dayIndex) => {
      const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
      return days[dayIndex] || `第${dayIndex + 1}天`
    }

    // 重置狀態
    const clearRoutineData = () => {
      userRoutines.value = []
      popularRoutines.value = []
      publicRoutines.value = []
      loading.value = false
      error.value = null
      likingRoutine.value = null
      showDetailDialog.value = false
      selectedRoutine.value = null
      selectedDetailDay.value = 0
    }

    // 清除快取
    const clearCache = () => {
      publicRoutinesCache.value = null
      cacheTimestamp.value = null
    }

    return {
      // State
      userRoutines,
      popularRoutines,
      publicRoutines,
      loading,
      error,
      likingRoutine,
      showDetailDialog,
      selectedRoutine,
      selectedDetailDay,

      // Computed
      hasRoutines,
      routineCount,
      totalLikes,
      isPublicRoutinesLoading,
      isLikingAnyRoutine,

      // Actions
      fetchUserRoutines,
      fetchPopularRoutines,
      fetchPublicRoutines,
      createRoutine,
      updateRoutine,
      deleteRoutine,
      isLiked,
      toggleLike,
      showRoutineDetail,
      closeDetailDialog,
      formatDate,
      getDayName,
      clearRoutineData,
      clearCache,
    }
  },
  {
    persist: {
      key: 'routine-store',
      storage: localStorage,
      paths: ['userRoutines', 'popularRoutines'], // 只持久化課表資料
    },
  },
)
