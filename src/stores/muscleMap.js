import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { muscleToPartMapping } from 'src/config/muscleMapping'
import wikiService from 'src/services/wiki'

export const useMuscleMapStore = defineStore(
  'muscleMap',
  () => {
    // 狀態
    const gender = ref('男生')
    const showFront = ref(true)
    const selectedEquipment = ref('')
    const highlightedMuscles = ref([])
    const currentHighlightColor = ref('rgba(59, 130, 246, 0.7)')

    // 器材選擇狀態
    const equipments = ref({
      啞鈴: false,
      器械: false,
      壺鈴: false,
      繩索: false,
      槓片: false,
      史密斯: false,
      槓鈴: false,
      徒手: false,
      藥球: false,
      伸展: false,
      彈力繩: false,
      有氧: false,
    })

    // 器材顏色映射
    const equipmentColors = {
      啞鈴: 'rgba(255, 152, 0, 1)',
      器械: 'rgba(244, 67, 54, 1)',
      壺鈴: 'rgba(156, 39, 176, 1)',
      繩索: 'rgba(103, 58, 183, 1)',
      槓片: 'rgba(63, 81, 181, 1)',
      史密斯: 'rgba(33, 150, 243, 1)',
      槓鈴: 'rgba(0, 188, 212, 1)',
      徒手: 'rgba(0, 150, 136, 1)',
      藥球: 'rgba(76, 175, 80, 1)',
      伸展: 'rgba(139, 195, 74, 1)',
      彈力繩: 'rgba(255, 193, 7, 1)',
      有氧: 'rgba(255, 87, 34, 1)',
    }

    // Computed
    const selectedItems = computed(() => {
      return Object.entries(equipments.value)
        .filter(([, value]) => value === true)
        .map(([key]) => key)
    })

    const hasSelectedEquipment = computed(() => {
      return selectedEquipment.value !== ''
    })

    const selectedEquipmentColor = computed(() => {
      return equipmentColors[selectedEquipment.value] || currentHighlightColor.value
    })

    // Actions
    const updateGender = (newGender) => {
      gender.value = newGender
    }

    const updateGenderFromUser = (userStore) => {
      if (userStore.isLoggedIn && userStore.gender) {
        gender.value = userStore.gender === 'male' ? '男生' : '女生'
      }
    }

    const toggleFrontBack = () => {
      showFront.value = !showFront.value
    }

    const setShowFront = (isFront) => {
      showFront.value = isFront
    }

    const selectEquipment = async (equipment) => {
      // 重置所有器材選擇
      Object.keys(equipments.value).forEach((key) => {
        equipments.value[key] = false
      })

      // 選擇新器材
      equipments.value[equipment] = true
      selectedEquipment.value = equipment

      // 設置高亮顏色
      currentHighlightColor.value = equipmentColors[equipment] || 'rgba(255, 152, 0, 1)'

      // 搜尋對應的肌肉群
      await searchMusclesByEquipment(equipment)
    }

    const searchMusclesByEquipment = async (equipment) => {
      try {
        const response = await wikiService.getExercises()
        const exercises = response.data.exercises

        // 篩選出使用該器材的動作
        const filteredExercises = exercises.filter((exercise) => exercise.equipment === equipment)

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

    const setHighlightedMuscles = (muscles) => {
      highlightedMuscles.value = muscles
    }

    const setHighlightColor = (color) => {
      currentHighlightColor.value = color
    }

    const clearSelection = () => {
      Object.keys(equipments.value).forEach((key) => {
        equipments.value[key] = false
      })
      selectedEquipment.value = ''
      highlightedMuscles.value = []
      currentHighlightColor.value = 'rgba(59, 130, 246, 0.7)'
    }

    const resetToDefault = () => {
      gender.value = '男生'
      showFront.value = true
      clearSelection()
    }

    return {
      // State
      gender,
      showFront,
      selectedEquipment,
      highlightedMuscles,
      currentHighlightColor,
      equipments,
      equipmentColors,

      // Computed
      selectedItems,
      hasSelectedEquipment,
      selectedEquipmentColor,

      // Actions
      updateGender,
      updateGenderFromUser,
      toggleFrontBack,
      setShowFront,
      selectEquipment,
      searchMusclesByEquipment,
      setHighlightedMuscles,
      setHighlightColor,
      clearSelection,
      resetToDefault,
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ['gender', 'showFront', 'selectedEquipment', 'equipments'],
    },
  },
)
