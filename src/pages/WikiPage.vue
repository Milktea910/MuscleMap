<template>
  <q-page padding>
    <div class="container fade-in-up">
      <div class="section-title text-h4 q-ma-lg text-center">動作百科</div>
      <p class="section-description text-center q-mb-lg">
        在這裡，您可以探索各種健身動作的詳細資訊，包括目標肌肉、使用器材、難易度等。透過我們的動作百科，您可以輕鬆找到適合自己的訓練動作，提升健身效果。
      </p>

      <!-- 篩選區塊 -->
      <q-card class="q-mb-lg">
        <q-card-section>
          <div class="text-h6 q-mb-md">動作篩選</div>

          <!-- 搜尋欄 -->
          <div class="row q-col-gutter-lg q-mb-md">
            <div class="col-12">
              <q-input filled v-model="searchText" label="搜尋動作名稱" clearable debounce="300">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- 其他篩選器 -->
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-4">
              <q-select
                filled
                v-model="filters.targetMuscle"
                :options="muscleOptions"
                label="目標肌肉"
                clearable
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                filled
                v-model="filters.equipment"
                :options="equipmentOptions"
                label="器材"
                clearable
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                filled
                v-model="filters.difficulty"
                :options="difficultyOptions"
                label="難易度"
                clearable
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 動作清單 -->
      <div class="row q-col-gutter-lg">
        <div
          v-for="exercise in exercises"
          :key="exercise._id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card class="exercise-card cursor-pointer" @click="showExerciseDetail(exercise)">
            <q-card-section>
              <div class="text-h6">{{ exercise.name }}</div>
              <div class="text-subtitle2 text-grey-6 target-muscle-text">
                <span v-if="Array.isArray(exercise.targetMuscle)">
                  {{ exercise.targetMuscle.join('、') }}
                </span>
                <span v-else>
                  {{ exercise.targetMuscle }}
                </span>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="row items-center q-gutter-sm">
                <q-chip :icon="getEquipmentIcon(exercise.equipment)" text-color="black" size="md">
                  {{ exercise.equipment }}
                </q-chip>
                <q-chip
                  :color="getDifficultyColor(exercise.difficulty)"
                  text-color="white"
                  size="md"
                >
                  {{ exercise.difficulty }}
                </q-chip>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- 載入中 -->
      <div v-if="loading" class="flex flex-center q-py-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <!-- 無資料 -->
      <div v-if="!loading && exercises.length === 0" class="text-center q-py-xl">
        <div class="text-h6 text-grey-6">找不到符合條件的動作</div>
      </div>
    </div>

    <!-- 動作詳細資訊對話框 -->
    <q-dialog v-model="showDetail" :maximized="false" class="exercise-dialog">
      <q-card v-if="selectedExercise" style="width: 90vw; max-width: 1200px; max-height: 85vh">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>{{ selectedExercise.name }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="scroll" style="max-height: calc(85vh - 56px); overflow-y: auto">
          <div class="row q-col-gutter-lg">
            <!-- 左側：影片和肌肉圖垂直排列 -->
            <div class="col-12 col-md-8">
              <!-- 影片區域 -->
              <div v-if="selectedExercise.video" class="q-mb-lg">
                <div class="text-h6 q-mb-sm">動作影片</div>
                <video
                  :src="selectedExercise.video"
                  class="full-width"
                  style="max-height: 350px"
                  autoplay
                  loop
                  muted
                  playsinline
                  webkit-playsinline
                >
                  您的瀏覽器不支援影片播放
                </video>
              </div>

              <!-- 肌肉圖區域 -->
              <div class="q-mb-md">
                <div class="text-h6 q-mb-sm">訓練部位圖解</div>
                <div class="row q-col-gutter-lg justify-center">
                  <div class="col-6 col-sm-5 col-md-4">
                    <div class="text-center q-mb-xs">
                      <div class="text-subtitle2">正面</div>
                    </div>
                    <div class="muscle-diagram-container">
                      <MaleFront
                        :highlighted-muscles="getHighlightedMuscles(selectedExercise.targetMuscle)"
                        highlight-color="#ff9800"
                        :custom-click-handler="() => {}"
                      />
                    </div>
                  </div>
                  <div class="col-6 col-sm-5 col-md-4">
                    <div class="text-center q-mb-xs">
                      <div class="text-subtitle2">背面</div>
                    </div>
                    <div class="muscle-diagram-container">
                      <MaleBack
                        :highlighted-muscles="getHighlightedMuscles(selectedExercise.targetMuscle)"
                        highlight-color="#ff9800"
                        :custom-click-handler="() => {}"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 右側：詳細資訊 -->
            <div class="col-12 col-md-4">
              <div class="q-mb-md">
                <div class="text-h6">目標肌肉</div>
                <div v-if="Array.isArray(selectedExercise.targetMuscle)">
                  <q-chip
                    v-for="muscle in selectedExercise.targetMuscle"
                    :key="muscle"
                    color="secondary"
                    text-color="white"
                    class="q-mr-xs q-mb-xs"
                  >
                    {{ muscle }}
                  </q-chip>
                </div>
                <q-chip v-else color="secondary" text-color="white">
                  {{ selectedExercise.targetMuscle }}
                </q-chip>
              </div>
              <div class="q-mb-md">
                <div class="text-h6">使用器材</div>
                <q-chip
                  outline
                  :icon="getEquipmentIcon(selectedExercise.equipment)"
                  text-color="black"
                >
                  {{ selectedExercise.equipment }}
                </q-chip>
              </div>
              <div class="q-mb-md">
                <div class="text-h6">難易度</div>
                <q-chip :color="getDifficultyColor(selectedExercise.difficulty)" text-color="white">
                  {{ selectedExercise.difficulty }}
                </q-chip>
              </div>
              <div
                class="q-mb-md"
                v-if="selectedExercise.notes && selectedExercise.notes.length > 0"
              >
                <div class="text-h6 q-mb-sm">注意事項</div>
                <q-list dense>
                  <q-item
                    v-for="(note, index) in selectedExercise.notes"
                    :key="index"
                    class="q-pa-sm"
                  >
                    <q-item-section avatar>
                      <q-avatar color="warning" text-color="white" size="24px">
                        {{ index + 1 }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2">{{ note }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import wikiService from 'src/services/wiki'
import { englishToChinese, validMuscleNames, muscleToPartMapping } from 'src/config/muscleMapping'
import MaleFront from 'src/components/MaleFront.vue'
import MaleBack from 'src/components/MaleBack.vue'

const route = useRoute()

// 響應式資料
const allExercises = ref([])
const loading = ref(false)
const showDetail = ref(false)
const selectedExercise = ref(null)
const searchText = ref('')

// 篩選條件
const filters = reactive({
  targetMuscle: null,
  equipment: null,
  difficulty: null,
})

// 篩選選項
const muscleOptions = validMuscleNames

const equipmentOptions = [
  '啞鈴',
  '器械',
  '壺鈴',
  '繩索',
  '槓片',
  '史密斯',
  '槓鈴',
  '徒手',
  '藥球',
  '伸展',
  '彈力繩',
  '有氧',
]

const difficultyOptions = ['簡單', '普通', '困難']

// 處理肌肉點擊事件
const exercises = computed(() => {
  let filtered = allExercises.value

  // 根據搜尋文字篩選
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase()
    filtered = filtered.filter((exercise) => exercise.name.toLowerCase().includes(searchLower))
  }

  if (filters.targetMuscle) {
    filtered = filtered.filter((exercise) => {
      // 處理陣列格式的目標肌群
      if (Array.isArray(exercise.targetMuscle)) {
        return exercise.targetMuscle.includes(filters.targetMuscle)
      }
      // 向後兼容字串格式
      return exercise.targetMuscle === filters.targetMuscle
    })
  }

  if (filters.equipment) {
    filtered = filtered.filter((exercise) => exercise.equipment === filters.equipment)
  }

  if (filters.difficulty) {
    filtered = filtered.filter((exercise) => exercise.difficulty === filters.difficulty)
  }

  // 按名稱排序
  filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))

  return filtered
})

// 取得所有動作資料
const fetchExercises = async () => {
  try {
    loading.value = true
    const { data } = await wikiService.getExercises()
    allExercises.value = data.exercises
  } catch (error) {
    console.error('獲取動作資料失敗:', error)
    allExercises.value = []
  } finally {
    loading.value = false
  }
}

// 顯示動作詳細資訊
const showExerciseDetail = (exercise) => {
  selectedExercise.value = exercise
  showDetail.value = true
}

// 取得器材圖示
const getEquipmentIcon = (equipment) => {
  const iconMap = {
    啞鈴: 'img:./assets/icons/dumbbell.svg',
    器械: 'img:./assets/icons/barbell.svg',
    壺鈴: 'img:./assets/icons/kettlebells.svg',
    繩索: 'img:./assets/icons/cables.svg',
    槓片: 'img:./assets/icons/Plate.svg',
    史密斯: 'img:./assets/icons/smith machine.svg',
    槓鈴: 'img:./assets/icons/barbell.svg',
    徒手: 'img:./assets/icons/bodyweight.svg',
    藥球: 'img:./assets/icons/medicine ball.svg',
    伸展: 'img:./assets/icons/stretches.svg',
    彈力繩: 'img:./assets/icons/band.svg',
    有氧: 'img:./assets/icons/cardio.svg',
  }
  return iconMap[equipment] || 'fitness_center'
}

// 取得難度顏色
const getDifficultyColor = (difficulty) => {
  const colorMap = {
    簡單: 'green',
    普通: 'orange',
    困難: 'red',
  }
  return colorMap[difficulty] || 'grey'
}

// 獲取需要高亮的肌肉部位
const getHighlightedMuscles = (targetMuscles) => {
  if (!targetMuscles) return []

  const muscles = Array.isArray(targetMuscles) ? targetMuscles : [targetMuscles]
  const highlightedParts = []

  muscles.forEach((muscle) => {
    const parts = muscleToPartMapping[muscle]
    if (parts) {
      highlightedParts.push(...parts)
    }
  })

  return highlightedParts
}

// 頁面載入時獲取資料
onMounted(() => {
  fetchExercises()
  initializeFilters()
})

// 根據路由參數初始化篩選條件
const initializeFilters = () => {
  // 處理肌肉部位參數
  if (route.query.muscle) {
    const muscleKey = route.query.muscle
    const targetMuscle = englishToChinese[muscleKey]
    if (targetMuscle && muscleOptions.includes(targetMuscle)) {
      filters.targetMuscle = targetMuscle
    }
  }

  // 處理器材參數
  if (route.query.equipment) {
    const equipmentList = route.query.equipment.split(',')
    // 如果只選擇了一個器材，自動設定篩選
    if (equipmentList.length === 1 && equipmentOptions.includes(equipmentList[0])) {
      filters.equipment = equipmentList[0]
    }
    // 如果選擇了多個器材，不自動設定（讓使用者手動選擇）
  }
}
</script>

<style scoped>
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

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
}
.section-description {
  color: #718096;
  line-height: 1.6;
  font-size: 1rem;
}
.exercise-card {
  transition: transform 0.2s;
}

.exercise-card:hover {
  transform: translateY(-4px);
}

.target-muscle-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.exercise-dialog .q-dialog__inner {
  padding: 16px;
}

.muscle-diagram-container {
  height: 250px;
  max-height: 250px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 4px;
  background: #fafafa;
  overflow: hidden;
  box-sizing: border-box;
}

.muscle-diagram-container svg {
  max-height: calc(100% - 8px);
  max-width: calc(100% - 8px);
  height: auto;
  width: auto;
  object-fit: contain;
  pointer-events: none;
}

.muscle-diagram-container svg .part {
  cursor: default !important;
}

.muscle-diagram-container svg .part:hover {
  opacity: 1 !important;
  transform: none !important;
}
</style>
