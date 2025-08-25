<template>
  <q-page class="q-pa-md">
    <div class="container fade-in-up">
      <div class="row q-col-gutter-lg">
        <!-- 左側動作卡片列表 -->
        <div class="col-12 col-lg-8">
          <div v-if="loading" class="text-center q-pa-lg">
            <q-spinner-dots size="50px" color="primary" />
            <div class="q-mt-md">載入中...</div>
          </div>

          <div v-else-if="exercises.length === 0" class="text-center q-pa-lg">
            <q-icon name="search_off" size="4rem" color="grey-5" />
            <div class="text-h6 q-mt-md text-grey-6">找不到相關動作</div>
            <div class="text-body2 text-grey-5">請嘗試其他肌肉部位</div>
          </div>

          <div v-else class="exercise-list">
            <div v-for="(exercise, index) in exercises" :key="index" class="q-mb-lg">
              <q-card
                :id="'exercise-' + exercise._id"
                class="exercise-card cursor-pointer"
                :class="{ 'highlighted-exercise': route.query.exerciseId === exercise._id }"
                flat
                bordered
                @click="showExerciseDetail(exercise)"
              >
                <div class="row no-wrap equal-height-row">
                  <!-- 左側影片區域 -->
                  <div class="col-12 col-md-5 flex">
                    <div class="video-container">
                      <video
                        v-if="exercise.video"
                        :src="getVideoUrl(exercise.video)"
                        class="exercise-video"
                        preload="metadata"
                        loop
                        muted
                        autoPlay
                        playsinline
                        webkit-playsinline
                        @loadeddata="handleVideoLoaded"
                      >
                        您的瀏覽器不支援影片播放
                      </video>
                      <div v-else class="video-placeholder">
                        <q-icon name="play_circle_outline" size="4rem" color="grey-5" />
                        <div class="text-caption text-grey-6">暫無影片</div>
                      </div>
                    </div>
                  </div>

                  <!-- 右側資訊區域 -->
                  <div class="col-12 col-md-7 flex">
                    <q-card-section class="full-width">
                      <div class="text-h6 exercise-name">{{ exercise.name }}</div>

                      <div class="exercise-meta q-mt-sm">
                        <q-chip color="blue" text-color="white" icon="fitness_center" size="md">
                          {{ exercise.equipment }}
                        </q-chip>

                        <q-chip
                          v-for="muscle in exercise.targetMuscle"
                          :key="muscle"
                          color="orange"
                          text-color="white"
                          icon="accessibility_new"
                          size="md"
                          class="q-ml-xs"
                        >
                          {{ muscle }}
                        </q-chip>
                      </div>

                      <div class="exercise-description q-mt-md">
                        <div class="text-subtitle2 text-weight-medium">動作描述：</div>
                        <div class="text-body2">
                          <div v-if="exercise.description" class="q-mb-sm">
                            {{ exercise.description }}
                          </div>
                          <div v-if="Array.isArray(exercise.notes) && exercise.notes.length > 0">
                            <ol class="notes-list">
                              <li
                                v-for="(note, index) in exercise.notes"
                                :key="index"
                                class="q-mb-xs"
                              >
                                {{ note }}
                              </li>
                            </ol>
                          </div>
                          <div
                            v-else-if="exercise.notes && !Array.isArray(exercise.notes)"
                            class="q-mt-sm"
                          >
                            {{ exercise.notes }}
                          </div>
                          <div v-if="!exercise.description && !exercise.notes">暫無描述</div>
                        </div>
                      </div>
                    </q-card-section>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>

        <!-- 右側肌肉圖 -->
        <div class="col-12 col-lg-4">
          <div class="sticky-top">
            <q-card flat bordered class="muscle-map-card">
              <q-card-section>
                <!-- 性別切換按鈕 -->
                <div class="text-center q-mb-md">
                  <q-toggle
                    size="lg"
                    v-model="gender"
                    checked-icon="female"
                    color="pink"
                    false-value="男生"
                    true-value="女生"
                    :label="gender"
                    unchecked-icon="male"
                  />
                </div>
                <q-separator class="q-mb-md" />

                <div class="text-h6 text-center q-mb-md">
                  {{ targetMuscle }}{{ targetMuscle.includes('相關動作') ? '' : ' 相關動作' }}
                  <div v-if="selectedEquipments.length > 0" class="text-caption text-grey-6">
                    器材：{{ selectedEquipments.join('、') }}
                  </div>
                </div>
                <div class="flex flex-center">
                  <!-- 根據性別顯示對應的肌肉圖 -->
                  <template v-if="gender === '男生'">
                    <MaleFront
                      v-if="showFront"
                      class="muscle-model"
                      :selectedEquipments="selectedEquipments"
                      :highlightedMuscles="highlightedMuscles"
                      :highlightColor="'rgba(244, 67, 54, 0.8)'"
                      :customClickHandler="handleMuscleClick"
                    />
                    <MaleBack
                      v-else
                      class="muscle-model"
                      :selectedEquipments="selectedEquipments"
                      :highlightedMuscles="highlightedMuscles"
                      :highlightColor="'rgba(244, 67, 54, 0.8)'"
                      :customClickHandler="handleMuscleClick"
                    />
                  </template>
                  <template v-else>
                    <FemaleFront
                      v-if="showFront"
                      class="muscle-model"
                      :selectedEquipments="selectedEquipments"
                      :highlightedMuscles="highlightedMuscles"
                      :highlightColor="'rgba(244, 67, 54, 0.8)'"
                      :customClickHandler="handleMuscleClick"
                    />
                    <FemaleBack
                      v-else
                      class="muscle-model"
                      :selectedEquipments="selectedEquipments"
                      :highlightedMuscles="highlightedMuscles"
                      :highlightColor="'rgba(244, 67, 54, 0.8)'"
                      :customClickHandler="handleMuscleClick"
                    />
                  </template>
                </div>
                <!-- 切換前後視圖按鈕 -->
                <div class="text-center q-mt-md">
                  <q-btn
                    flat
                    round
                    color="primary"
                    :icon="showFront ? 'flip_to_back' : 'flip_to_front'"
                    @click="showFront = !showFront"
                  >
                    <q-tooltip>{{ showFront ? '切換到背面' : '切換到正面' }}</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
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
                  :src="getVideoUrl(selectedExercise.video)"
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
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user'
import MaleFront from 'src/components/MaleFront.vue'
import MaleBack from 'src/components/MaleBack.vue'
import FemaleFront from 'src/components/FemaleFront.vue'
import FemaleBack from 'src/components/FemaleBack.vue'
import wikiService from 'src/services/wiki'
import { getChineseName, getHighlightParts } from 'src/config/muscleMapping'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const userStore = useUserStore()

const loading = ref(true)
const exercises = ref([])
const targetMuscle = ref('')
const selectedEquipments = ref([])
const showFront = ref(true)
const highlightedMuscles = ref([])
const gender = ref('男生')
const showDetail = ref(false)
const selectedExercise = ref(null)

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

// 從用戶設定或路由參數初始化性別
const initializeGender = () => {
  if (userStore.isLoggedIn && userStore.gender) {
    gender.value = userStore.gender === 'male' ? '男生' : '女生'
  } else if (route.query.gender) {
    gender.value = route.query.gender
  }
}

// 獲取影片 URL
const getVideoUrl = (videoPath) => {
  if (!videoPath) return ''

  // 如果已經是完整的 URL，直接返回
  if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
    return videoPath
  }

  // 如果是相對路徑，拼接基礎 URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/${videoPath.replace(/^\//, '')}`
}

// 顯示動作詳細資訊
const showExerciseDetail = (exercise) => {
  selectedExercise.value = exercise
  showDetail.value = true
}

// 取得高亮肌肉
const getHighlightedMuscles = (targetMuscle) => {
  if (!targetMuscle) return []
  if (Array.isArray(targetMuscle)) {
    return targetMuscle.flatMap((muscle) => getHighlightParts(muscle) || [])
  }
  return getHighlightParts(targetMuscle) || []
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
    瑜伽: 'img:./assets/icons/yoga.svg',
    恢復: 'img:./assets/icons/recovery.svg',
    有氧: 'img:./assets/icons/cardio.svg',
    全部: 'img:./assets/icons/all.svg',
  }
  return iconMap[equipment] || 'fitness_center'
}

// 取得難易度顏色
const getDifficultyColor = (difficulty) => {
  const colorMap = {
    初級: 'green',
    中級: 'orange',
    高級: 'red',
  }
  return colorMap[difficulty] || 'grey'
}

// 監聽使用者登入狀態與性別，自動更新 gender
watch(
  () => [userStore.isLoggedIn, userStore.gender],
  () => {
    initializeGender()
  },
  { immediate: true },
)

// 載入對應肌肉的動作
const loadExercises = async () => {
  try {
    loading.value = true
    const muscleParam = route.query.muscle
    const equipmentParam = route.query.equipment
    const exerciseIdParam = route.query.exerciseId
    const exerciseNameParam = route.query.exerciseName

    const response = await wikiService.getExercises()
    const allExercises = response.data.exercises

    let filteredExercises = []

    // 如果有動作ID參數，優先按動作ID篩選
    if (exerciseIdParam) {
      const targetExercise = allExercises.find((exercise) => exercise._id === exerciseIdParam)

      if (targetExercise) {
        filteredExercises = [targetExercise]

        // 設置目標肌肉標題
        if (Array.isArray(targetExercise.targetMuscle) && targetExercise.targetMuscle.length > 0) {
          targetMuscle.value = targetExercise.targetMuscle[0]
        } else if (typeof targetExercise.targetMuscle === 'string') {
          targetMuscle.value = targetExercise.targetMuscle
        } else {
          targetMuscle.value = exerciseNameParam || '指定動作'
        }

        // 根據目標肌肉設置前後視圖和高亮
        const primaryMuscle = Array.isArray(targetExercise.targetMuscle)
          ? targetExercise.targetMuscle[0]
          : targetExercise.targetMuscle

        if (primaryMuscle && backMuscles.includes(primaryMuscle)) {
          showFront.value = false
        } else {
          showFront.value = true
        }

        // 設置高亮肌肉
        if (Array.isArray(targetExercise.targetMuscle)) {
          highlightedMuscles.value = targetExercise.targetMuscle.flatMap((muscle) => [
            muscle,
            ...getHighlightParts(muscle),
          ])
        } else if (targetExercise.targetMuscle) {
          highlightedMuscles.value = [
            targetExercise.targetMuscle,
            ...getHighlightParts(targetExercise.targetMuscle),
          ]
        }

        // 延遲一下以確保DOM已渲染，然後滾動到動作位置
        setTimeout(() => {
          const exerciseElement = document.querySelector(`#exercise-${exerciseIdParam}`)
          if (exerciseElement) {
            exerciseElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        }, 100)
      } else {
        $q.notify({
          color: 'negative',
          message: '找不到指定的動作',
          icon: 'error',
        })
        return
      }
    }
    // 如果有肌肉參數，按肌肉篩選
    else if (muscleParam) {
      // 將英文肌肉名稱轉換為中文
      const chineseMuscle = getChineseName(muscleParam)
      targetMuscle.value = chineseMuscle

      // 根據肌群自動設置前後視圖
      if (backMuscles.includes(chineseMuscle)) {
        showFront.value = false // 背部肌群顯示背面
      } else {
        showFront.value = true // 其他肌群顯示正面
      }

      // 設置高亮肌肉（使用原始英文參數和對應的中文肌肉部位）
      highlightedMuscles.value = [muscleParam, ...getHighlightParts(chineseMuscle)]

      // 篩選包含目標肌肉的動作（嘗試多種匹配方式）
      filteredExercises = allExercises.filter((exercise) => {
        // 如果 targetMuscle 是陣列
        if (Array.isArray(exercise.targetMuscle)) {
          return exercise.targetMuscle.some(
            (muscle) =>
              muscle === chineseMuscle ||
              muscle === muscleParam ||
              muscle.toLowerCase() === chineseMuscle.toLowerCase() ||
              muscle.toLowerCase() === muscleParam.toLowerCase(),
          )
        }
        // 如果 targetMuscle 是字串
        else if (typeof exercise.targetMuscle === 'string') {
          return (
            exercise.targetMuscle === chineseMuscle ||
            exercise.targetMuscle === muscleParam ||
            exercise.targetMuscle.toLowerCase() === chineseMuscle.toLowerCase() ||
            exercise.targetMuscle.toLowerCase() === muscleParam.toLowerCase()
          )
        }
        return false
      })

      // 如果沒有找到動作，嘗試更寬鬆的搜尋
      if (filteredExercises.length === 0) {
        filteredExercises = allExercises.filter((exercise) => {
          const exerciseName = exercise.name?.toLowerCase() || ''
          return exerciseName.includes('二頭') || exerciseName.includes('bicep')
        })
      }
    } else if (equipmentParam) {
      // 如果只有器材參數，顯示所有動作
      filteredExercises = [...allExercises]
      targetMuscle.value = `${equipmentParam} 相關動作`
      showFront.value = true // 默認顯示正面
      highlightedMuscles.value = [] // 不高亮任何肌肉
    } else {
      // 如果沒有任何篩選參數，顯示所有動作
      filteredExercises = [...allExercises]
      targetMuscle.value = '所有動作'
      showFront.value = true
      highlightedMuscles.value = []
    }

    // 處理器材篩選參數
    const equipments = equipmentParam ? equipmentParam.split(',') : []
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

    if (filteredExercises.length === 0) {
      // 沒有找到相關動作
    }
  } catch (error) {
    console.error('載入動作失敗:', error)
    $q.notify({
      color: 'negative',
      message: '載入動作失敗',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}

// 處理右邊肌肉圖的點擊事件（不套用器材篩選）
const handleMuscleClick = (target) => {
  const query = { muscle: target }

  // 保持當前的性別參數
  query.gender = gender.value

  router.push({
    path: '/muscle-exercises',
    query: query,
  })
}

// 處理影片載入完成後播放
const handleVideoLoaded = (event) => {
  // 延遲一點時間再播放，避免同時播放多個影片
  setTimeout(() => {
    event.target.play().catch(() => {
      console.log('自動播放失敗')
    })
  }, Math.random() * 1000) // 隨機延遲 0-1 秒
}

onMounted(() => {
  initializeGender()
  loadExercises()
})

// 監聽路由變化，當肌肉、器材或動作ID參數改變時重新載入動作
watch(
  () => [route.query.muscle, route.query.equipment, route.query.exerciseId],
  () => {
    loadExercises()
  },
)
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

.sticky-top {
  position: sticky;
  top: 80px;
  z-index: 10;
}

.muscle-map-card {
  background: white;
  border-radius: 12px;
}

.muscle-model {
  width: 300px;
  height: 400px;
}

.exercise-card {
  border-radius: 12px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.highlighted-exercise {
  border: 2px solid #1976d2;
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
  animation: pulse-highlight 2s ease-in-out;
}

@keyframes pulse-highlight {
  0% {
    box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
  }
  50% {
    box-shadow: 0 8px 30px rgba(25, 118, 210, 0.6);
  }
  100% {
    box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
  }
}

.equal-height-row {
  align-items: stretch;
}

.equal-height-row > div {
  display: flex;
  flex-direction: column;
}

.exercise-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.video-container {
  height: 100%;
  min-height: 300px;
  position: relative;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.exercise-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.video-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.exercise-name {
  color: #1976d2;
  font-weight: 600;
}

.exercise-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.exercise-description {
  .text-body2 {
    line-height: 1.5;
    color: #555;
  }

  .notes-list {
    margin: 0.5rem 0 0 0;
    padding-left: 1.2rem;

    li {
      margin-bottom: 0.25rem;
      line-height: 1.4;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .muscle-model {
    width: 250px;
    height: 350px;
  }

  .video-container {
    min-height: 200px;
  }

  .equal-height-row {
    flex-direction: column;
  }

  .equal-height-row > div {
    flex-direction: row;
  }
}

// 對話框相關樣式
.exercise-dialog {
  .muscle-diagram-container {
    width: 120px;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
