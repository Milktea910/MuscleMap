import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import wikiService from 'src/services/wiki'
import { getChineseName, getHighlightParts, muscleToPartMapping } from 'src/config/muscleMapping'

export const useExerciseStore = defineStore(
  'exercise',
  () => {
    // 狀態
    const exercises = ref([])
    const loading = ref(false)
    const selectedEquipments = ref([])
    const targetMuscle = ref('')
    const highlightedMuscles = ref([])
    const gender = ref('男生')
    const showFront = ref(true)

    // 快取機制
    const exerciseCache = ref(null)
    const cacheTimestamp = ref(null)
    const CACHE_DURATION = 5 * 60 * 1000 // 5分鐘快取

    // 定義背部肌群（需要顯示背面視圖的肌群）
    const backMuscles = [
      '斜方肌',
      '背闊肌',
      '菱形肌',
      '豎脊肌',
      '大腿後側肌群',
      '肩後束',
      '肱三頭肌',
      '臀大肌',
    ]

    // Computed
    const filteredExercises = computed(() => {
      if (selectedEquipments.value.length === 0) {
        return exercises.value
      }
      return exercises.value.filter((exercise) => {
        return selectedEquipments.value.includes(exercise.equipment)
      })
    })

    const isExerciseCacheValid = computed(() => {
      if (!cacheTimestamp.value) return false
      return Date.now() - cacheTimestamp.value < CACHE_DURATION
    })

    // Actions
    const fetchExercises = async (forceRefresh = false) => {
      if (!forceRefresh && exerciseCache.value && isExerciseCacheValid.value) {
        return exerciseCache.value
      }

      try {
        loading.value = true
        const response = await wikiService.getExercises()
        exerciseCache.value = response.data.exercises
        cacheTimestamp.value = Date.now()
        return exerciseCache.value
      } catch (error) {
        console.error('載入動作失敗:', error)
        throw error
      } finally {
        loading.value = false
      }
    }

    const loadExercisesByParams = async (params) => {
      try {
        loading.value = true
        const { muscle, equipment, exerciseId, exerciseName } = params

        const allExercises = await fetchExercises()
        let filteredExercises = []

        // 如果有動作ID參數，優先按動作ID篩選
        if (exerciseId) {
          const targetExercise = allExercises.find((exercise) => exercise._id === exerciseId)

          if (targetExercise) {
            filteredExercises = [targetExercise]

            // 設置目標肌肉標題
            if (
              Array.isArray(targetExercise.targetMuscle) &&
              targetExercise.targetMuscle.length > 0
            ) {
              targetMuscle.value = targetExercise.targetMuscle[0]
            } else if (typeof targetExercise.targetMuscle === 'string') {
              targetMuscle.value = targetExercise.targetMuscle
            } else {
              targetMuscle.value = exerciseName || '指定動作'
            }

            // 根據目標肌肉設置前後視圖和高亮
            const primaryMuscle = Array.isArray(targetExercise.targetMuscle)
              ? targetExercise.targetMuscle[0]
              : targetExercise.targetMuscle

            setMuscleView(primaryMuscle)
            setHighlightedMuscles(targetExercise.targetMuscle)
          }
        }
        // 如果有肌肉參數，按肌肉篩選
        else if (muscle) {
          const chineseMuscle = getChineseName(muscle)
          targetMuscle.value = chineseMuscle

          setMuscleView(chineseMuscle)
          highlightedMuscles.value = [muscle, ...getHighlightParts(chineseMuscle)]

          // 篩選包含目標肌肉的動作
          filteredExercises = allExercises.filter((exercise) => {
            if (Array.isArray(exercise.targetMuscle)) {
              return exercise.targetMuscle.some(
                (muscleItem) =>
                  muscleItem === chineseMuscle ||
                  muscleItem === muscle ||
                  muscleItem.toLowerCase() === chineseMuscle.toLowerCase() ||
                  muscleItem.toLowerCase() === muscle.toLowerCase(),
              )
            } else if (typeof exercise.targetMuscle === 'string') {
              return (
                exercise.targetMuscle === chineseMuscle ||
                exercise.targetMuscle === muscle ||
                exercise.targetMuscle.toLowerCase() === chineseMuscle.toLowerCase() ||
                exercise.targetMuscle.toLowerCase() === muscle.toLowerCase()
              )
            }
            return false
          })
        } else if (equipment) {
          // 如果只有器材參數，顯示所有動作
          filteredExercises = [...allExercises]
          targetMuscle.value = `${equipment} 相關動作`
          showFront.value = true
          highlightedMuscles.value = []
        } else {
          // 如果沒有任何篩選參數，顯示所有動作
          filteredExercises = [...allExercises]
          targetMuscle.value = '所有動作'
          showFront.value = true
          highlightedMuscles.value = []
        }

        // 處理器材篩選參數
        const equipments = equipment ? equipment.split(',') : []
        selectedEquipments.value = equipments

        // 如果有器材篩選，進一步根據器材篩選動作
        if (selectedEquipments.value.length > 0) {
          filteredExercises = filteredExercises.filter((exercise) => {
            return selectedEquipments.value.includes(exercise.equipment)
          })
        }

        // 按名稱排序
        filteredExercises = filteredExercises.sort((a, b) => a.name.localeCompare(b.name))
        exercises.value = filteredExercises

        return {
          exercises: filteredExercises,
          targetMuscle: targetMuscle.value,
          showFront: showFront.value,
          highlightedMuscles: highlightedMuscles.value,
          selectedEquipments: selectedEquipments.value,
        }
      } catch (error) {
        console.error('載入動作失敗:', error)
        throw error
      } finally {
        loading.value = false
      }
    }

    const setMuscleView = (muscle) => {
      if (muscle && backMuscles.includes(muscle)) {
        showFront.value = false
      } else {
        showFront.value = true
      }
    }

    const setHighlightedMuscles = (targetMuscleData) => {
      if (Array.isArray(targetMuscleData)) {
        highlightedMuscles.value = targetMuscleData.flatMap((muscle) => [
          muscle,
          ...getHighlightParts(muscle),
        ])
      } else if (targetMuscleData) {
        highlightedMuscles.value = [targetMuscleData, ...getHighlightParts(targetMuscleData)]
      } else {
        highlightedMuscles.value = []
      }
    }

    const searchMusclesByEquipment = async (equipment) => {
      try {
        const allExercises = await fetchExercises()

        // 篩選出使用該器材的動作
        const filteredExercises = allExercises.filter(
          (exercise) => exercise.equipment === equipment,
        )

        // 收集所有目標肌肉群
        const targetMuscles = new Set()
        filteredExercises.forEach((exercise) => {
          exercise.targetMuscle.forEach((muscle) => {
            targetMuscles.add(muscle)
          })
        })

        // 映射到肌肉圖的部位ID
        const highlightParts = []
        Array.from(targetMuscles).forEach((muscle) => {
          if (muscleToPartMapping[muscle]) {
            highlightParts.push(...muscleToPartMapping[muscle])
          }
        })

        highlightedMuscles.value = highlightParts
        return highlightParts
      } catch (error) {
        console.error('搜尋肌肉群失敗:', error)
        throw error
      }
    }

    const updateGender = (newGender) => {
      gender.value = newGender
    }

    const updateSelectedEquipments = (equipments) => {
      selectedEquipments.value = equipments
    }

    const toggleFrontBack = () => {
      showFront.value = !showFront.value
    }

    const clearFilters = () => {
      selectedEquipments.value = []
      targetMuscle.value = ''
      highlightedMuscles.value = []
      exercises.value = []
    }

    const clearCache = () => {
      exerciseCache.value = null
      cacheTimestamp.value = null
    }

    return {
      // State
      exercises,
      loading,
      selectedEquipments,
      targetMuscle,
      highlightedMuscles,
      gender,
      showFront,
      backMuscles,

      // Computed
      filteredExercises,
      isExerciseCacheValid,

      // Actions
      fetchExercises,
      loadExercisesByParams,
      setMuscleView,
      setHighlightedMuscles,
      searchMusclesByEquipment,
      updateGender,
      updateSelectedEquipments,
      toggleFrontBack,
      clearFilters,
      clearCache,
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ['gender', 'selectedEquipments'],
    },
  },
)
