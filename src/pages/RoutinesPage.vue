<template>
  <q-page class="q-pa-md">
    <div class="container fade-in-up">
      <!-- 頁面標題 -->
      <div class="q-mb-xl">
        <h1 class="section text-h4 q-mt-xl text-center">推薦課表</h1>
        <p class="section-description text-center">
          在這裡，您可以找到各種公開的健身課表，這些課表由社群用戶分享，涵蓋不同的訓練目標和風格。無論您是初學者還是有經驗的健身愛好者，都能找到適合自己的課表。
        </p>
      </div>

      <!-- 推薦課表內容 -->
      <div>
        <q-card v-if="publicRoutines.length === 0" class="text-center q-pa-lg">
          <q-card-section>
            <q-icon name="fitness_center" size="4rem" color="grey-5" />
            <div class="text-h6 q-mt-md text-grey-6">目前還沒有公開的課表</div>
          </q-card-section>
        </q-card>

        <div v-else class="row q-col-gutter-lg">
          <div
            v-for="routine in publicRoutines"
            :key="routine._id"
            class="col-12 col-md-6 col-lg-4"
          >
            <q-card class="routine-card cursor-pointer" @click="showRoutineDetail(routine)">
              <q-card-section class="routine-card-content">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-h6 routine-title">{{ routine.title }}</div>
                  <q-chip color="primary" text-color="white" size="md">
                    {{ routine.user?.username || '匿名用戶' }}
                  </q-chip>
                </div>

                <div class="text-body2 text-grey-7 routine-description">
                  {{ routine.content }}
                </div>

                <!-- 動作列表 -->
                <div class="q-mt-md routine-workouts">
                  <!-- 如果是週計劃格式 -->
                  <div v-if="routine.weeklyPlan && routine.weeklyPlan.length > 0">
                    <div class="text-subtitle2 q-mb-sm">週計劃內容：</div>
                    <div class="weekly-plan">
                      <div
                        v-for="(dayPlan, dayIndex) in routine.weeklyPlan"
                        :key="dayIndex"
                        class="day-plan q-mb-sm"
                      >
                        <div class="day-header text-weight-medium text-primary q-mb-xs">
                          <span v-if="dayPlan.name && dayPlan.name !== getDayName(dayPlan.day)"
                            >{{ dayPlan.name }}
                          </span>
                        </div>

                        <div v-if="dayPlan.isRestDay" class="rest-day text-grey-6 q-ml-md">
                          🛌 休息日
                        </div>

                        <div
                          v-else-if="dayPlan.workouts && dayPlan.workouts.length > 0"
                          class="workout-list q-ml-md"
                        >
                          <div
                            v-for="(workout, workoutIndex) in dayPlan.workouts"
                            :key="workoutIndex"
                            class="workout-item text-body2"
                          >
                            {{ workout.exercise?.name }} - {{ workout.sets }}組 x
                            {{ workout.reps }}次 (休息 {{ workout.rest }}秒)
                          </div>
                        </div>

                        <div v-else class="no-workouts text-grey-6 q-ml-md">尚未安排訓練</div>

                        <div
                          v-if="dayPlan.notes"
                          class="day-notes text-caption text-grey-6 q-ml-md q-mt-xs"
                        >
                          📝 {{ dayPlan.notes }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 如果是舊格式（直接動作列表） -->
                  <div v-else-if="routine.workouts && routine.workouts.length > 0">
                    <div class="text-subtitle2 q-mb-sm">動作內容：</div>
                    <div class="workout-list">
                      <div
                        v-for="(workout, index) in routine.workouts"
                        :key="index"
                        class="workout-item text-body2"
                      >
                        {{ workout.exercise?.name }} - {{ workout.sets }}組 x {{ workout.reps }}次
                        (休息 {{ workout.rest }}秒)
                      </div>
                    </div>
                  </div>

                  <!-- 如果沒有任何訓練內容 -->
                  <div v-else class="text-caption text-grey-6">此課表尚未設定訓練內容</div>
                </div>
              </q-card-section>

              <q-card-actions class="justify-between">
                <q-btn
                  :color="isLiked(routine) ? 'red' : 'grey'"
                  :icon="isLiked(routine) ? 'favorite' : 'favorite_border'"
                  flat
                  @click.stop="toggleLike(routine._id)"
                  :loading="likingRoutine === routine._id"
                >
                  {{ routine.likesCount || 0 }}
                </q-btn>

                <div class="text-caption text-grey-6">
                  {{ formatDate(routine.createdAt) }}
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 課表詳細對話框 -->
    <q-dialog v-model="showDetailDialog" position="top">
      <q-card class="routine-detail-dialog">
        <q-card-section v-if="selectedRoutine">
          <div class="row items-center justify-between">
            <div class="text-h6">{{ selectedRoutine.title }}</div>
            <q-btn icon="close" flat round dense @click="closeDetailDialog" />
          </div>
        </q-card-section>

        <q-card-section
          v-if="selectedRoutine"
          class="q-pt-none"
          style="max-height: 60vh; overflow-y: auto"
        >
          <!-- 課表基本資訊 -->
          <div class="q-mb-md">
            <div class="row items-center q-mb-sm">
              <q-chip color="primary" text-color="white" size="md" class="q-mr-sm">
                {{ selectedRoutine.user?.username || '匿名用戶' }}
              </q-chip>
              <div class="text-caption text-grey-6">
                {{ formatDate(selectedRoutine.createdAt) }}
              </div>
            </div>
            <div class="text-body1 q-mb-md">{{ selectedRoutine.content }}</div>
          </div>

          <!-- 詳細動作內容 -->
          <div class="routine-detail-content">
            <!-- 如果是週計劃格式 -->
            <div v-if="selectedRoutine.weeklyPlan && selectedRoutine.weeklyPlan.length > 0">
              <div class="text-h6 q-mb-md">週計劃詳細內容</div>

              <q-tabs v-model="selectedDetailDay" class="q-mb-md" align="left">
                <q-tab
                  v-for="dayPlan in selectedRoutine.weeklyPlan"
                  :key="dayPlan.day"
                  :name="dayPlan.day"
                  :label="dayPlan.name"
                />
              </q-tabs>

              <q-tab-panels v-model="selectedDetailDay" animated>
                <q-tab-panel
                  v-for="dayPlan in selectedRoutine.weeklyPlan"
                  :key="dayPlan.day"
                  :name="dayPlan.day"
                >
                  <!-- 每日訓練詳情 -->
                  <div class="day-detail">
                    <div class="text-h6 q-mb-sm">
                      <span v-if="dayPlan.name && dayPlan.name !== getDayName(dayPlan.day)"
                        >{{ dayPlan.name }}
                      </span>
                    </div>

                    <div v-if="dayPlan.isRestDay" class="rest-day-detail q-pa-md text-center">
                      <q-icon name="bed" size="3rem" color="grey-5" />
                      <div class="text-h6 q-mt-md text-grey-6">休息日</div>
                      <div v-if="dayPlan.notes" class="text-body2 text-grey-6 q-mt-sm">
                        {{ dayPlan.notes }}
                      </div>
                    </div>

                    <div v-else-if="dayPlan.workouts && dayPlan.workouts.length > 0">
                      <div
                        v-for="(workout, workoutIndex) in dayPlan.workouts"
                        :key="workoutIndex"
                        class="workout-detail-item q-mb-md q-pa-md"
                      >
                        <div class="row items-center q-mb-sm">
                          <q-icon name="fitness_center" color="primary" class="q-mr-sm" />
                          <div
                            v-if="workout.exercise?._id"
                            class="text-h6 exercise-name-link cursor-pointer"
                            @click="
                              navigateToExercise(
                                workout.exercise._id,
                                workout.exercise.name,
                                $event,
                              )
                            "
                          >
                            {{ workout.exercise.name }}
                            <q-icon name="launch" size="sm" class="q-ml-xs" />
                          </div>
                          <div v-else class="text-h6 text-grey-6">未設定動作</div>
                        </div>

                        <div class="workout-stats row q-col-gutter-lg">
                          <div class="col">
                            <div class="text-caption text-grey-6">組數</div>
                            <div class="text-h6">{{ workout.sets }}</div>
                          </div>
                          <div class="col">
                            <div class="text-caption text-grey-6">次數</div>
                            <div class="text-h6">{{ workout.reps }}</div>
                          </div>
                          <div class="col">
                            <div class="text-caption text-grey-6">休息時間</div>
                            <div class="text-h6">{{ workout.rest }}秒</div>
                          </div>
                        </div>
                      </div>

                      <div v-if="dayPlan.notes" class="day-notes-detail q-pa-md q-mt-md">
                        <div class="text-subtitle2 q-mb-sm">
                          <q-icon name="note" class="q-mr-sm" />
                          備註
                        </div>
                        <div class="text-body2">{{ dayPlan.notes }}</div>
                      </div>
                    </div>

                    <div v-else class="no-workouts-detail q-pa-md text-center">
                      <q-icon name="info" size="2rem" color="grey-5" />
                      <div class="text-body1 q-mt-md text-grey-6">此日尚未安排訓練</div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <!-- 如果是舊格式（直接動作列表） -->
            <div v-else-if="selectedRoutine.workouts && selectedRoutine.workouts.length > 0">
              <div class="text-h6 q-mb-md">動作詳細內容</div>

              <div
                v-for="(workout, index) in selectedRoutine.workouts"
                :key="index"
                class="workout-detail-item q-mb-md q-pa-md"
              >
                <div class="row items-center q-mb-sm">
                  <q-icon name="fitness_center" color="primary" class="q-mr-sm" />
                  <div
                    v-if="workout.exercise?._id"
                    class="text-h6 exercise-name-link cursor-pointer"
                    @click="navigateToExercise(workout.exercise._id, workout.exercise.name, $event)"
                  >
                    {{ workout.exercise.name }}
                    <q-icon name="launch" size="sm" class="q-ml-xs" />
                  </div>
                  <div v-else class="text-h6 text-grey-6">未設定動作</div>
                </div>

                <div class="workout-stats row q-col-gutter-lg">
                  <div class="col">
                    <div class="text-caption text-grey-6">組數</div>
                    <div class="text-h6">{{ workout.sets }}</div>
                  </div>
                  <div class="col">
                    <div class="text-caption text-grey-6">次數</div>
                    <div class="text-h6">{{ workout.reps }}</div>
                  </div>
                  <div class="col">
                    <div class="text-caption text-grey-6">休息時間</div>
                    <div class="text-h6">{{ workout.rest }}秒</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 如果沒有任何訓練內容 -->
            <div v-else class="no-content-detail q-pa-md text-center">
              <q-icon name="info" size="3rem" color="grey-5" />
              <div class="text-h6 q-mt-md text-grey-6">此課表尚未設定訓練內容</div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" v-if="selectedRoutine">
          <q-btn
            :color="isLiked(selectedRoutine) ? 'red' : 'grey'"
            :icon="isLiked(selectedRoutine) ? 'favorite' : 'favorite_border'"
            :label="selectedRoutine.likesCount || 0"
            @click="toggleLike(selectedRoutine._id)"
            :loading="likingRoutine === selectedRoutine._id"
          />
          <q-btn flat label="關閉" @click="closeDetailDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user'
import routineService from 'src/services/routine'

const $q = useQuasar()
const router = useRouter()
const user = useUserStore()

// 響應式數據
const publicRoutines = ref([])
const likingRoutine = ref(null)
const showDetailDialog = ref(false)
const selectedRoutine = ref(null)
const selectedDetailDay = ref(0)

// 方法
const loadPublicRoutines = async () => {
  try {
    const { data } = await routineService.getPublicRoutines()
    publicRoutines.value = data.data
  } catch (error) {
    console.error('載入公開課表失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '載入公開課表失敗',
    })
  }
}

const isLiked = (routine) => {
  if (!user.isLoggedIn || !routine.likes || !Array.isArray(routine.likes)) return false

  // likes 陣列包含 ObjectId，需要轉為字符串比較
  return routine.likes.some((likeId) => String(likeId) === String(user._id))
}

const toggleLike = async (routineId) => {
  if (!user.isLoggedIn) {
    $q.notify({
      color: 'orange-5',
      textColor: 'white',
      icon: 'warning',
      message: '請先登入才能按讚',
    })
    return
  }

  try {
    likingRoutine.value = routineId
    const { data } = await routineService.toggleLike(routineId)

    // 更新本地資料
    const routine = publicRoutines.value.find((r) => r._id === routineId)
    if (routine) {
      routine.likesCount = data.data.likesCount
      if (data.data.liked) {
        if (!routine.likes) routine.likes = []
        routine.likes.push(user._id)
      } else {
        if (routine.likes) {
          const index = routine.likes.indexOf(user._id)
          if (index > -1) routine.likes.splice(index, 1)
        }
      }
    }

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'favorite',
      message: data.message,
    })
  } catch (error) {
    console.error('按讚失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '按讚失敗',
    })
  } finally {
    likingRoutine.value = null
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

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

const navigateToExercise = (exerciseId, exerciseName, event) => {
  // 阻止事件冒泡，避免觸發對話框的點擊事件
  if (event) {
    event.stopPropagation()
  }

  if (!exerciseId) {
    $q.notify({
      color: 'orange-5',
      textColor: 'white',
      icon: 'warning',
      message: '動作資訊不完整',
    })
    return
  }

  // 關閉對話框
  closeDetailDialog()

  // 導航到動作示範頁面，並且在 URL 中帶上動作資訊
  router.push({
    path: '/muscle-exercises',
    query: {
      exerciseId: exerciseId,
      exerciseName: exerciseName,
    },
  })
}

const closeDetailDialog = () => {
  showDetailDialog.value = false
  selectedRoutine.value = null
  selectedDetailDay.value = 0
}

const getDayName = (dayIndex) => {
  const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  return days[dayIndex] || `第${dayIndex + 1}天`
}

// 生命週期
onMounted(async () => {
  await loadPublicRoutines()
})
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
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.routine-card {
  height: 430px; /* 增加一些高度 */
  display: flex;
  flex-direction: column;
}

.routine-card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px; /* 稍微增加內邊距 */
}

.routine-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px; /* 增加標題最大寬度 */
  flex: 1; /* 讓標題占用更多空間 */
}

.routine-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制為兩行 */
  line-clamp: 2; /* 標準屬性 */
  -webkit-box-orient: vertical;
  margin-top: 8px;
  margin-bottom: 8px;
}

.routine-workouts {
  flex-grow: 1;
  overflow: hidden;
  margin-top: 12px; /* 增加上邊距 */
}

.workout-list {
  max-height: 160px; /* 稍微增加動作列表高度 */
  overflow-y: auto;
  overflow-x: hidden;
}

.workout-item {
  padding: 6px 0; /* 增加垂直邊距 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0;
  line-height: 1.4; /* 改善行高 */
}

.workout-item:last-child {
  border-bottom: none;
}

/* 週計劃樣式 */
.weekly-plan {
  max-height: 220px; /* 增加週計劃高度 */
  overflow-y: auto;
}

.day-plan {
  border-left: 3px solid #e0e0e0;
  padding-left: 10px; /* 稍微增加左邊距 */
  margin-bottom: 10px; /* 增加底邊距 */
}

.day-plan:last-child {
  margin-bottom: 0;
}

.day-header {
  font-size: 0.875rem;
  color: #1976d2;
}

.rest-day {
  font-style: italic;
}

.no-workouts {
  font-style: italic;
}

.day-notes {
  font-style: italic;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

/* 詳細對話框樣式 */
.routine-detail-content {
  min-height: 300px;
}

.workout-detail-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.workout-stats {
  text-align: center;
}

.day-detail {
  min-height: 200px;
}

.rest-day-detail,
.no-workouts-detail,
.no-content-detail {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.day-notes-detail {
  background: #e3f2fd;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

.exercise-name-link {
  color: #1976d2;
  border-bottom: 1px dashed #1976d2;
  transition: all 0.2s ease;
}

.exercise-name-link:hover {
  color: #0d47a1;
  border-bottom: 1px solid #0d47a1;
  background-color: rgba(25, 118, 210, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
}

.routine-card .q-card-actions {
  margin-top: auto;
  flex-shrink: 0; /* 防止按鈕區域被壓縮 */
  padding: 12px 16px; /* 增加按鈕區域的內邊距 */
  min-height: 52px; /* 確保按鈕區域有最小高度 */
}

/* 響應式對話框樣式 */
.routine-detail-dialog {
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  margin: 0 16px; /* 手機上的左右邊距 */
}

/* 桌面版 */
@media (min-width: 768px) {
  .routine-detail-dialog {
    min-width: 600px;
    margin: 0; /* 桌面版不需要額外邊距 */
  }
}

/* 手機版 */
@media (max-width: 767px) {
  .routine-detail-dialog {
    min-width: unset;
    width: calc(100vw - 32px); /* 全寬減去左右邊距 */
    max-height: 90vh; /* 手機上可以稍微高一些 */
  }

  /* 手機版卡片優化 */
  .routine-card {
    height: 380px; /* 手機版稍微降低高度 */
  }

  .routine-card-content {
    padding: 12px; /* 手機版減少內邊距 */
  }

  .routine-title {
    max-width: 150px; /* 手機版減少標題寬度 */
    font-size: 1.1rem; /* 稍微減小字體 */
  }

  .workout-list {
    max-height: 120px; /* 手機版減少列表高度 */
  }

  .weekly-plan {
    max-height: 180px; /* 手機版減少週計劃高度 */
  }
}
</style>
