<template>
  <q-page class="q-pa-md">
    <div class="container fade-in-up">
      <!-- 頁面標題和新增按鈕 -->
      <div class="row items-center justify-between q-mb-sm">
        <div>
          <h1 class="section text-h4 q-mt-lg q-mb-none">我的課表</h1>
          <p class="section-description q-mb-none q-mt-sm">
            在這裡您可以查看和管理自己的課表，建立新的課表或編輯現有的課表。<br />
            您也可以瀏覽其他用戶分享的公開課表，並將喜歡的課表加入收藏。
          </p>
        </div>

        <q-btn
          color="primary"
          icon="add"
          label="建立課表"
          @click="showCreateDialog = true"
          :disable="!user.isLoggedIn"
        />
      </div>

      <!-- Tab 切換 -->
      <q-tabs v-model="activeTab" class="text-primary q-mb-lg q-mt-lg" align="left">
        <q-tab name="my" label="我的課表" />
        <q-tab name="liked" label="我喜歡的課表" />
      </q-tabs>

      <!-- 未登入狀態 -->
      <q-card v-if="!user.isLoggedIn" class="text-center q-pa-lg">
        <q-card-section>
          <q-icon name="login" size="4rem" color="grey-5" />
          <div class="text-h6 q-mt-md text-grey-6">請先登入查看您的課表</div>
          <q-btn color="primary" label="前往登入" class="q-mt-md" to="/login" />
        </q-card-section>
      </q-card>

      <!-- 我的課表內容 -->
      <div v-else>
        <q-tab-panels v-model="activeTab" animated>
          <!-- 我的課表 Tab -->
          <q-tab-panel name="my">
            <q-card v-if="myRoutines.length === 0" class="text-center q-pa-lg">
              <q-card-section>
                <q-icon name="assignment" size="4rem" color="grey-5" />
                <div class="text-h6 q-mt-md text-grey-6">您還沒有建立任何課表</div>
                <q-btn
                  color="primary"
                  label="建立第一個課表"
                  class="q-mt-md"
                  @click="showCreateDialog = true"
                />
              </q-card-section>
            </q-card>

            <div v-else class="row q-col-gutter-lg">
              <div
                v-for="routine in myRoutines"
                :key="routine._id"
                class="col-12 col-md-6 col-lg-4"
              >
                <q-card class="routine-card">
                  <q-card-section class="routine-card-content">
                    <div class="row items-center justify-between q-mb-sm">
                      <div class="text-h6 routine-title">{{ routine.title }}</div>
                      <q-chip
                        :color="routine.isPublic ? 'green' : 'orange'"
                        text-color="white"
                        size="md"
                      >
                        {{ routine.isPublic ? '公開' : '私人' }}
                      </q-chip>
                    </div>

                    <div class="text-body2 text-grey-7 routine-description">
                      {{ routine.content }}
                    </div>

                    <!-- 週計劃或舊版動作列表 -->
                    <div class="q-mt-md routine-workouts">
                      <div v-if="routine.weeklyPlan && routine.weeklyPlan.length > 0">
                        <div class="text-subtitle2 q-mb-sm">週計劃：</div>
                        <div class="weekly-plan-summary">
                          <div
                            v-for="dayPlan in routine.weeklyPlan"
                            :key="dayPlan.day"
                            class="day-plan-item text-body2"
                          >
                            <strong>{{ getDayName(dayPlan.day) }}</strong
                            >: {{ dayPlan.name }}
                            <span v-if="dayPlan.isRestDay" class="text-grey-6"> (休息日)</span>
                            <span v-else-if="dayPlan.workouts.length > 0" class="text-grey-6">
                              ({{ dayPlan.workouts.length }} 個動作)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="routine.workouts && routine.workouts.length > 0">
                        <div class="text-subtitle2 q-mb-sm">動作內容：</div>
                        <div class="workout-list">
                          <div
                            v-for="(workout, index) in routine.workouts"
                            :key="index"
                            class="workout-item text-body2"
                          >
                            {{ workout.exercise?.name }} - {{ workout.sets }}組 x
                            {{ workout.reps }}次 (休息 {{ workout.rest }}秒)
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-grey-6">尚未設定訓練內容</div>
                    </div>

                    <!-- 讚數顯示 -->
                    <div v-if="routine.isPublic" class="q-mt-md">
                      <q-chip color="red" text-color="white" size="md">
                        <q-icon name="favorite" />
                        {{ routine.likesCount || 0 }} 個讚
                      </q-chip>
                    </div>
                  </q-card-section>

                  <q-card-actions class="justify-between">
                    <div>
                      <q-btn
                        flat
                        :color="routine.isPublic ? 'orange' : 'green'"
                        :icon="routine.isPublic ? 'visibility_off' : 'visibility'"
                        @click="toggleVisibility(routine)"
                      >
                        {{ routine.isPublic ? '設為私人' : '設為公開' }}
                      </q-btn>
                    </div>

                    <div class="q-gutter-sm">
                      <q-btn flat color="primary" icon="edit" @click="editRoutine(routine)">
                        編輯
                      </q-btn>
                      <q-btn flat color="red" icon="delete" @click="deleteRoutine(routine._id)">
                        刪除
                      </q-btn>
                    </div>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- 我喜歡的課表 Tab -->
          <q-tab-panel name="liked">
            <q-card v-if="likedRoutines.length === 0" class="text-center q-pa-lg">
              <q-card-section>
                <q-icon name="favorite_border" size="4rem" color="grey-5" />
                <div class="text-h6 q-mt-md text-grey-6">您還沒有喜歡任何課表</div>
                <q-btn color="primary" label="瀏覽公開課表" class="q-mt-md" to="/routines" />
              </q-card-section>
            </q-card>

            <div v-else class="row q-col-gutter-lg">
              <div
                v-for="routine in likedRoutines"
                :key="routine._id"
                class="col-12 col-md-6 col-lg-4"
              >
                <q-card class="routine-card">
                  <q-card-section class="routine-card-content">
                    <div class="row items-center justify-between q-mb-sm">
                      <div class="text-h6 routine-title">{{ routine.title }}</div>
                      <q-chip color="green" text-color="white" size="md"> 公開 </q-chip>
                    </div>

                    <div class="text-body2 text-grey-7 q-mb-sm">
                      作者：{{ routine.user?.username || '未知' }}
                    </div>

                    <div class="text-body2 text-grey-7 routine-description">
                      {{ routine.content }}
                    </div>

                    <!-- 週計劃或舊版動作列表 -->
                    <div class="q-mt-md routine-workouts">
                      <div v-if="routine.weeklyPlan && routine.weeklyPlan.length > 0">
                        <div class="text-subtitle2 q-mb-sm">週計劃：</div>
                        <div class="weekly-plan-summary">
                          <div
                            v-for="dayPlan in routine.weeklyPlan"
                            :key="dayPlan.day"
                            class="day-plan-item text-body2"
                          >
                            <strong>{{ getDayName(dayPlan.day) }}</strong
                            >: {{ dayPlan.name }}
                            <span v-if="dayPlan.isRestDay" class="text-grey-6"> (休息日)</span>
                            <span v-else-if="dayPlan.workouts.length > 0" class="text-grey-6">
                              ({{ dayPlan.workouts.length }} 個動作)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="routine.workouts && routine.workouts.length > 0">
                        <div class="text-subtitle2 q-mb-sm">動作內容：</div>
                        <div class="workout-list">
                          <div
                            v-for="(workout, index) in routine.workouts"
                            :key="index"
                            class="workout-item text-body2"
                          >
                            {{ workout.exercise?.name }} - {{ workout.sets }}組 x
                            {{ workout.reps }}次 (休息 {{ workout.rest }}秒)
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-grey-6">尚未設定訓練內容</div>
                    </div>

                    <!-- 讚數顯示 -->
                    <div class="q-mt-md">
                      <q-chip color="red" text-color="white" size="md">
                        <q-icon name="favorite" />
                        {{ routine.likesCount || 0 }} 個讚
                      </q-chip>
                    </div>
                  </q-card-section>

                  <q-card-actions class="justify-end">
                    <q-btn
                      flat
                      color="red"
                      icon="favorite"
                      @click="toggleRoutineLike(routine)"
                      label="取消喜歡"
                    />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <!-- 建立課表對話框 -->
      <q-dialog v-model="showCreateDialog" position="top">
        <q-card style="min-width: 500px; max-width: 800px">
          <q-card-section>
            <div class="text-h6">建立新課表</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input v-model="newRoutine.title" label="課表名稱" outlined class="q-mb-md" />

            <q-input
              v-model="newRoutine.content"
              label="課表描述"
              outlined
              type="textarea"
              rows="3"
              class="q-mb-md"
            />

            <q-toggle v-model="newRoutine.isPublic" label="設為公開課表" class="q-mb-md" />

            <!-- 週計劃設定 -->
            <div class="text-subtitle1 q-mb-md">週計劃設定</div>

            <q-tabs v-model="selectedDay" class="q-mb-md" align="left">
              <q-tab
                v-for="dayPlan in newRoutine.weeklyPlan"
                :key="dayPlan.day"
                :name="dayPlan.day"
                :label="getDayName(dayPlan.day)"
              />
            </q-tabs>

            <q-tab-panels v-model="selectedDay" animated>
              <q-tab-panel
                v-for="(dayPlan, dayIndex) in newRoutine.weeklyPlan"
                :key="dayPlan.day"
                :name="dayPlan.day"
              >
                <!-- 每日訓練設定 -->
                <div class="q-mb-md">
                  <q-input
                    v-model="dayPlan.name"
                    :label="`${getDayName(dayPlan.day)}訓練名稱`"
                    outlined
                    class="q-mb-md"
                  />

                  <q-toggle v-model="dayPlan.isRestDay" :label="`設為休息日`" class="q-mb-md" />

                  <q-input
                    v-model="dayPlan.notes"
                    label="備註"
                    outlined
                    type="textarea"
                    rows="2"
                    class="q-mb-md"
                  />
                </div>

                <!-- 當日動作設定 -->
                <div v-if="!dayPlan.isRestDay">
                  <div class="text-subtitle2 q-mb-md">動作設定</div>

                  <div
                    v-for="(workout, workoutIndex) in dayPlan.workouts"
                    :key="workoutIndex"
                    class="q-mb-md q-pa-md"
                    style="border: 1px solid #e0e0e0; border-radius: 8px"
                  >
                    <div class="row q-col-gutter-lg items-center">
                      <div class="col-12 col-md-4">
                        <q-select
                          v-model="workout.exercise"
                          label="選擇動作"
                          :options="exerciseOptions"
                          option-label="name"
                          option-value="_id"
                          emit-value
                          map-options
                          use-input
                          @filter="filterExercises"
                          outlined
                          dense
                        />
                      </div>

                      <div class="col-6 col-md-2">
                        <q-input
                          v-model.number="workout.sets"
                          label="組數"
                          type="number"
                          min="1"
                          outlined
                          dense
                        />
                      </div>

                      <div class="col-6 col-md-2">
                        <q-input
                          v-model.number="workout.reps"
                          label="次數"
                          type="number"
                          min="1"
                          outlined
                          dense
                        />
                      </div>

                      <div class="col-6 col-md-2">
                        <q-input
                          v-model.number="workout.rest"
                          label="休息(秒)"
                          type="number"
                          min="0"
                          outlined
                          dense
                        />
                      </div>

                      <div class="col-6 col-md-1">
                        <q-btn
                          icon="remove"
                          color="red"
                          flat
                          dense
                          @click="removeDayWorkout(dayIndex, workoutIndex)"
                        />
                      </div>
                    </div>
                  </div>

                  <q-btn
                    icon="add"
                    label="新增動作"
                    color="primary"
                    flat
                    @click="addDayWorkout(dayIndex)"
                    class="q-mb-md"
                  />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="取消" @click="closeCreateDialog" />
            <q-btn
              color="primary"
              label="建立課表"
              @click="createRoutine"
              :loading="creating"
              :disable="!canCreateRoutine"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- 編輯課表對話框 -->
      <q-dialog v-model="showEditDialog" position="top">
        <q-card style="min-width: 500px; max-width: 800px">
          <q-card-section>
            <div class="text-h6">編輯課表</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input v-model="editRoutineData.title" label="課表名稱" outlined class="q-mb-md" />

            <q-input
              v-model="editRoutineData.content"
              label="課表描述"
              outlined
              type="textarea"
              rows="3"
              class="q-mb-md"
            />

            <q-toggle v-model="editRoutineData.isPublic" label="設為公開課表" class="q-mb-md" />

            <!-- 週計劃設定 -->
            <div class="text-subtitle1 q-mb-md">週計劃設定</div>

            <q-tabs v-model="selectedEditDay" class="q-mb-md" align="left">
              <q-tab
                v-for="dayPlan in editRoutineData.weeklyPlan"
                :key="dayPlan.day"
                :name="dayPlan.day"
                :label="getDayName(dayPlan.day)"
              />
            </q-tabs>

            <q-tab-panels v-model="selectedEditDay" animated>
              <q-tab-panel
                v-for="(dayPlan, dayIndex) in editRoutineData.weeklyPlan"
                :key="dayPlan.day"
                :name="dayPlan.day"
              >
                <!-- 每日訓練設定 -->
                <div class="q-mb-md">
                  <q-input
                    v-model="dayPlan.name"
                    :label="`${getDayName(dayPlan.day)}訓練名稱`"
                    outlined
                    class="q-mb-md"
                  />

                  <q-toggle v-model="dayPlan.isRestDay" :label="`設為休息日`" class="q-mb-md" />

                  <q-input
                    v-model="dayPlan.notes"
                    label="備註"
                    outlined
                    type="textarea"
                    rows="2"
                    class="q-mb-md"
                  />
                </div>

                <!-- 當日動作設定 -->
                <div v-if="!dayPlan.isRestDay">
                  <div class="text-subtitle2 q-mb-md">動作設定</div>

                  <div
                    v-for="(workout, workoutIndex) in dayPlan.workouts"
                    :key="workoutIndex"
                    class="q-mb-md q-pa-md"
                    style="border: 1px solid #e0e0e0; border-radius: 8px"
                  >
                    <div class="row q-col-gutter-lg items-center">
                      <div class="col-12 col-md-4">
                        <q-select
                          v-model="workout.exercise"
                          label="選擇動作"
                          :options="exerciseOptions"
                          option-label="name"
                          option-value="_id"
                          emit-value
                          map-options
                          use-input
                          @filter="filterExercises"
                          outlined
                          dense
                        />
                      </div>

                      <div class="col-6 col-md-2">
                        <q-input
                          v-model.number="workout.sets"
                          label="組數"
                          type="number"
                          min="1"
                          outlined
                          dense
                        />
                      </div>

                      <div class="col-6 col-md-2">
                        <q-input
                          v-model.number="workout.reps"
                          label="次數"
                          type="number"
                          min="1"
                          outlined
                          dense
                        />
                      </div>

                      <div class="col-6 col-md-2">
                        <q-input
                          v-model.number="workout.rest"
                          label="休息(秒)"
                          type="number"
                          min="0"
                          outlined
                          dense
                        />
                      </div>

                      <div class="col-6 col-md-1">
                        <q-btn
                          icon="remove"
                          color="red"
                          flat
                          dense
                          @click="removeEditDayWorkout(dayIndex, workoutIndex)"
                        />
                      </div>
                    </div>
                  </div>

                  <q-btn
                    icon="add"
                    label="新增動作"
                    color="primary"
                    flat
                    @click="addEditDayWorkout(dayIndex)"
                    class="q-mb-md"
                  />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="取消" @click="closeEditDialog" />
            <q-btn
              color="primary"
              label="儲存變更"
              @click="updateRoutine"
              :loading="updating"
              :disable="!canUpdateRoutine"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user'
import routineService from 'src/services/routine'
import wikiService from 'src/services/wiki'

const $q = useQuasar()
const user = useUserStore()

// 響應式數據
const activeTab = ref('my')
const selectedDay = ref('monday') // 新增：當前選中的日期
const myRoutines = ref([])
const likedRoutines = ref([])
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const creating = ref(false)
const updating = ref(false)
const allExercises = ref([])
const exerciseOptions = ref([])
const editingRoutineId = ref(null)

const newRoutine = ref({
  title: '',
  content: '',
  isPublic: false,
  weeklyPlan: [
    { day: 'monday', name: '週一訓練', workouts: [], notes: '', isRestDay: false },
    { day: 'tuesday', name: '週二訓練', workouts: [], notes: '', isRestDay: false },
    { day: 'wednesday', name: '週三訓練', workouts: [], notes: '', isRestDay: false },
    { day: 'thursday', name: '週四訓練', workouts: [], notes: '', isRestDay: false },
    { day: 'friday', name: '週五訓練', workouts: [], notes: '', isRestDay: false },
    { day: 'saturday', name: '週六訓練', workouts: [], notes: '', isRestDay: false },
    { day: 'sunday', name: '週日休息', workouts: [], notes: '', isRestDay: true },
  ],
  // 保留舊版 workouts 用於向後相容
  workouts: [],
})

const editRoutineData = ref({
  title: '',
  content: '',
  isPublic: false,
  weeklyPlan: [
    { day: 0, name: '星期一', workouts: [], notes: '', isRestDay: false },
    { day: 1, name: '星期二', workouts: [], notes: '', isRestDay: false },
    { day: 2, name: '星期三', workouts: [], notes: '', isRestDay: false },
    { day: 3, name: '星期四', workouts: [], notes: '', isRestDay: false },
    { day: 4, name: '星期五', workouts: [], notes: '', isRestDay: false },
    { day: 5, name: '星期六', workouts: [], notes: '', isRestDay: false },
    { day: 6, name: '星期日', workouts: [], notes: '', isRestDay: true },
  ],
})
const selectedEditDay = ref(0)

// 方法
// 將英文星期轉換為中文
const getDayName = (day) => {
  const dayNames = {
    monday: '週一',
    tuesday: '週二',
    wednesday: '週三',
    thursday: '週四',
    friday: '週五',
    saturday: '週六',
    sunday: '週日',
  }

  // 如果是數字索引，轉換為對應的中文星期
  if (typeof day === 'number') {
    const numericDayNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    return numericDayNames[day] || `第${day + 1}天`
  }

  return dayNames[day] || day
}

const loadMyRoutines = async () => {
  try {
    if (!user.isLoggedIn) {
      return
    }

    const { data } = await routineService.getMyRoutines()

    myRoutines.value = data.data
  } catch (error) {
    console.error('載入我的課表失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: error.response?.data?.message || '載入我的課表失敗',
    })
  }
}

const loadLikedRoutines = async () => {
  try {
    if (!user.isLoggedIn) {
      return
    }

    const { data } = await routineService.getLikedRoutines()

    likedRoutines.value = data.data
  } catch (error) {
    console.error('載入喜歡的課表失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: error.response?.data?.message || '載入喜歡的課表失敗',
    })
  }
}

// 監聽 activeTab 變化，載入對應資料
watch(activeTab, (newTab) => {
  if (newTab === 'my') {
    loadMyRoutines()
  } else if (newTab === 'liked') {
    loadLikedRoutines()
  }
})

// 切換課表按讚狀態
const toggleRoutineLike = async (routine) => {
  try {
    await routineService.toggleLike(routine._id)

    // 從喜歡列表中移除
    const index = likedRoutines.value.findIndex((r) => r._id === routine._id)
    if (index > -1) {
      likedRoutines.value.splice(index, 1)
    }

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'favorite_border',
      message: '已取消喜歡',
    })
  } catch (error) {
    console.error('切換按讚狀態失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '操作失敗',
    })
  }
}

const toggleVisibility = async (routine) => {
  try {
    const newVisibility = !routine.isPublic
    await routineService.updateVisibility(routine._id, newVisibility)

    routine.isPublic = newVisibility

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'visibility',
      message: `課表已設為${newVisibility ? '公開' : '私人'}`,
    })
  } catch (error) {
    console.error('更新公開狀態失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '更新公開狀態失敗',
    })
  }
}

const deleteRoutine = async (routineId) => {
  $q.dialog({
    title: '確認刪除',
    message: '您確定要刪除這個課表嗎？此操作無法復原。',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await routineService.delete(routineId)

      // 從本地資料中移除
      const index = myRoutines.value.findIndex((r) => r._id === routineId)
      if (index > -1) {
        myRoutines.value.splice(index, 1)
      }

      $q.notify({
        color: 'positive',
        textColor: 'white',
        icon: 'check',
        message: '課表刪除成功',
      })
    } catch (error) {
      console.error('刪除課表失敗:', error)
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: '刪除課表失敗',
      })
    }
  })
}

const editRoutine = (routine) => {
  editingRoutineId.value = routine._id
  selectedEditDay.value = 0

  // 處理週計劃數據
  let weeklyPlan = []

  if (routine.weeklyPlan && routine.weeklyPlan.length > 0) {
    // 如果是新格式（週計劃）
    weeklyPlan = routine.weeklyPlan.map((dayPlan) => ({
      day: dayPlan.day,
      name: dayPlan.name,
      isRestDay: dayPlan.isRestDay,
      notes: dayPlan.notes || '',
      workouts: dayPlan.workouts.map((workout) => ({
        exercise: workout.exercise._id || workout.exercise,
        sets: workout.sets,
        reps: workout.reps,
        rest: workout.rest,
      })),
    }))
  } else if (routine.workouts && routine.workouts.length > 0) {
    // 如果是舊格式（直接動作列表），轉換為週計劃格式
    weeklyPlan = [
      { day: 0, name: '星期一', workouts: [], notes: '', isRestDay: false },
      { day: 1, name: '星期二', workouts: [], notes: '', isRestDay: false },
      { day: 2, name: '星期三', workouts: [], notes: '', isRestDay: false },
      { day: 3, name: '星期四', workouts: [], notes: '', isRestDay: false },
      { day: 4, name: '星期五', workouts: [], notes: '', isRestDay: false },
      { day: 5, name: '星期六', workouts: [], notes: '', isRestDay: false },
      { day: 6, name: '星期日', workouts: [], notes: '', isRestDay: true },
    ]

    // 將舊格式的動作放到星期一
    weeklyPlan[0].workouts = routine.workouts.map((workout) => ({
      exercise: workout.exercise._id || workout.exercise,
      sets: workout.sets,
      reps: workout.reps,
      rest: workout.rest,
    }))
    weeklyPlan[0].name = '主要訓練'
  } else {
    // 如果沒有任何動作，創建空的週計劃
    weeklyPlan = [
      { day: 0, name: '星期一', workouts: [], notes: '', isRestDay: false },
      { day: 1, name: '星期二', workouts: [], notes: '', isRestDay: false },
      { day: 2, name: '星期三', workouts: [], notes: '', isRestDay: false },
      { day: 3, name: '星期四', workouts: [], notes: '', isRestDay: false },
      { day: 4, name: '星期五', workouts: [], notes: '', isRestDay: false },
      { day: 5, name: '星期六', workouts: [], notes: '', isRestDay: false },
      { day: 6, name: '星期日', workouts: [], notes: '', isRestDay: true },
    ]
  }

  editRoutineData.value = {
    title: routine.title,
    content: routine.content,
    isPublic: routine.isPublic,
    weeklyPlan: weeklyPlan,
  }

  showEditDialog.value = true
}

const createRoutine = async () => {
  if (!newRoutine.value.title || !newRoutine.value.content) {
    $q.notify({
      color: 'orange-5',
      textColor: 'white',
      icon: 'warning',
      message: '請填寫完整的課表資訊',
    })
    return
  }

  // 檢查週計劃中是否至少有一天有動作
  const hasAnyWorkout = newRoutine.value.weeklyPlan.some(
    (day) => !day.isRestDay && day.workouts.length > 0,
  )

  if (!hasAnyWorkout) {
    $q.notify({
      color: 'orange-5',
      textColor: 'white',
      icon: 'warning',
      message: '請至少在一天中添加一個動作',
    })
    return
  }

  // 檢查非休息日的動作是否都已填寫完整
  for (const day of newRoutine.value.weeklyPlan) {
    if (!day.isRestDay) {
      for (let i = 0; i < day.workouts.length; i++) {
        const workout = day.workouts[i]
        if (!workout.exercise || !workout.sets || !workout.reps || workout.rest === undefined) {
          $q.notify({
            color: 'orange-5',
            textColor: 'white',
            icon: 'warning',
            message: `請完整填寫${day.name}動作 ${i + 1} 的資訊`,
          })
          return
        }
      }
    }
  }

  try {
    creating.value = true

    const routineData = {
      title: newRoutine.value.title,
      content: newRoutine.value.content,
      isPublic: newRoutine.value.isPublic,
      weeklyPlan: newRoutine.value.weeklyPlan.map((day) => ({
        day: day.day,
        name: day.name,
        isRestDay: day.isRestDay,
        notes: day.notes,
        workouts: day.workouts.map((workout) => ({
          exercise: workout.exercise,
          sets: Number(workout.sets),
          reps: Number(workout.reps),
          rest: Number(workout.rest),
        })),
      })),
    }

    await routineService.create(routineData)

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'check',
      message: '課表建立成功',
    })

    closeCreateDialog()
    await loadMyRoutines()
  } catch (error) {
    console.error('建立課表失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: error.response?.data?.message || '建立課表失敗',
    })
  } finally {
    creating.value = false
  }
}

const updateRoutine = async () => {
  if (!editRoutineData.value.title || !editRoutineData.value.content) {
    $q.notify({
      color: 'orange-5',
      textColor: 'white',
      icon: 'warning',
      message: '請填寫完整的課表資訊',
    })
    return
  }

  // 檢查週計劃中是否至少有一天有動作
  const hasAnyWorkout = editRoutineData.value.weeklyPlan.some(
    (day) => !day.isRestDay && day.workouts.length > 0,
  )

  if (!hasAnyWorkout) {
    $q.notify({
      color: 'orange-5',
      textColor: 'white',
      icon: 'warning',
      message: '請至少在一天中添加一個動作',
    })
    return
  }

  // 檢查非休息日的動作是否都已填寫完整
  for (const day of editRoutineData.value.weeklyPlan) {
    if (!day.isRestDay) {
      for (let i = 0; i < day.workouts.length; i++) {
        const workout = day.workouts[i]
        if (!workout.exercise || !workout.sets || !workout.reps || workout.rest === undefined) {
          $q.notify({
            color: 'orange-5',
            textColor: 'white',
            icon: 'warning',
            message: `請完整填寫${day.name}動作 ${i + 1} 的資訊`,
          })
          return
        }
      }
    }
  }

  try {
    updating.value = true

    const routineData = {
      title: editRoutineData.value.title,
      content: editRoutineData.value.content,
      isPublic: editRoutineData.value.isPublic,
      weeklyPlan: editRoutineData.value.weeklyPlan.map((day) => ({
        day: day.day,
        name: day.name,
        isRestDay: day.isRestDay,
        notes: day.notes,
        workouts: day.workouts.map((workout) => ({
          exercise: workout.exercise,
          sets: Number(workout.sets),
          reps: Number(workout.reps),
          rest: Number(workout.rest),
        })),
      })),
    }

    await routineService.update(editingRoutineId.value, routineData)

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'check',
      message: '課表更新成功',
    })

    closeEditDialog()
    await loadMyRoutines()
  } catch (error) {
    console.error('更新課表失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: error.response?.data?.message || '更新課表失敗',
    })
  } finally {
    updating.value = false
  }
}

// 新增：週計劃動作管理方法
const addDayWorkout = (dayIndex) => {
  newRoutine.value.weeklyPlan[dayIndex].workouts.push({
    exercise: '',
    sets: 3,
    reps: 10,
    rest: 60,
  })
}

const removeDayWorkout = (dayIndex, workoutIndex) => {
  newRoutine.value.weeklyPlan[dayIndex].workouts.splice(workoutIndex, 1)
}

// 編輯模式：新增週計劃動作管理方法
const addEditDayWorkout = (dayIndex) => {
  editRoutineData.value.weeklyPlan[dayIndex].workouts.push({
    exercise: '',
    sets: 3,
    reps: 10,
    rest: 60,
  })
}

const removeEditDayWorkout = (dayIndex, workoutIndex) => {
  editRoutineData.value.weeklyPlan[dayIndex].workouts.splice(workoutIndex, 1)
}

// 載入動作列表
const loadExercises = async () => {
  try {
    const { data } = await wikiService.getExercises()
    // 後端回傳的是 { success: true, message: '', exercises: [...] }
    allExercises.value = data.exercises || []
    exerciseOptions.value = data.exercises || []
  } catch (error) {
    console.error('載入動作列表失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '載入動作列表失敗',
    })
  }
}

// 篩選動作
const filterExercises = (val, update) => {
  update(() => {
    if (val === '') {
      exerciseOptions.value = allExercises.value
    } else {
      const needle = val.toLowerCase()
      exerciseOptions.value = allExercises.value.filter(
        (exercise) => exercise.name.toLowerCase().indexOf(needle) > -1,
      )
    }
  })
}

// 檢查是否可以建立課表
const canCreateRoutine = computed(() => {
  if (!newRoutine.value.title || !newRoutine.value.content) {
    return false
  }

  // 檢查是否至少有一天有動作
  const hasAnyWorkout = newRoutine.value.weeklyPlan.some(
    (day) => !day.isRestDay && day.workouts.length > 0,
  )

  if (!hasAnyWorkout) {
    return false
  }

  // 檢查所有非休息日的動作是否都填寫完整
  for (const day of newRoutine.value.weeklyPlan) {
    if (!day.isRestDay) {
      for (const workout of day.workouts) {
        if (!workout.exercise || !workout.sets || !workout.reps || workout.rest === undefined) {
          return false
        }
      }
    }
  }

  return true
})

// 檢查是否可以更新課表
const canUpdateRoutine = computed(() => {
  if (!editRoutineData.value.title || !editRoutineData.value.content) {
    return false
  }

  // 檢查是否至少有一天有動作
  const hasAnyWorkout = editRoutineData.value.weeklyPlan.some(
    (day) => !day.isRestDay && day.workouts.length > 0,
  )

  if (!hasAnyWorkout) {
    return false
  }

  // 檢查所有非休息日的動作是否都填寫完整
  for (const day of editRoutineData.value.weeklyPlan) {
    if (!day.isRestDay) {
      for (const workout of day.workouts) {
        if (!workout.exercise || !workout.sets || !workout.reps || workout.rest === undefined) {
          return false
        }
      }
    }
  }

  return true
})

const closeCreateDialog = () => {
  showCreateDialog.value = false
  selectedDay.value = 0
  newRoutine.value = {
    title: '',
    content: '',
    isPublic: false,
    weeklyPlan: [
      { day: 0, name: '星期一', workouts: [], notes: '', isRestDay: false },
      { day: 1, name: '星期二', workouts: [], notes: '', isRestDay: false },
      { day: 2, name: '星期三', workouts: [], notes: '', isRestDay: false },
      { day: 3, name: '星期四', workouts: [], notes: '', isRestDay: false },
      { day: 4, name: '星期五', workouts: [], notes: '', isRestDay: false },
      { day: 5, name: '星期六', workouts: [], notes: '', isRestDay: false },
      { day: 6, name: '星期日', workouts: [], notes: '', isRestDay: true },
    ],
  }
}

const closeEditDialog = () => {
  showEditDialog.value = false
  editingRoutineId.value = null
  selectedEditDay.value = 0
  editRoutineData.value = {
    title: '',
    content: '',
    isPublic: false,
    weeklyPlan: [
      { day: 0, name: '星期一', workouts: [], notes: '', isRestDay: false },
      { day: 1, name: '星期二', workouts: [], notes: '', isRestDay: false },
      { day: 2, name: '星期三', workouts: [], notes: '', isRestDay: false },
      { day: 3, name: '星期四', workouts: [], notes: '', isRestDay: false },
      { day: 4, name: '星期五', workouts: [], notes: '', isRestDay: false },
      { day: 5, name: '星期六', workouts: [], notes: '', isRestDay: false },
      { day: 6, name: '星期日', workouts: [], notes: '', isRestDay: true },
    ],
  }
}

// 生命週期
onMounted(async () => {
  // 載入動作列表
  await loadExercises()

  // 載入我的課表（預設 tab）
  if (user.isLoggedIn) {
    await loadMyRoutines()
  }
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
  height: 435px; /* 增加高度以提供更多空間 */
  display: flex;
  flex-direction: column;
}

.routine-card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 20px; /* 增加內邊距 */
}

.routine-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px; /* 調整標題最大寬度 */
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
}

.weekly-plan-summary {
  max-height: 150px; /* 限制週計劃列表高度 */
  overflow-y: auto;
  overflow-x: hidden;
}

.day-plan-item {
  padding: 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0;
}

.day-plan-item:last-child {
  border-bottom: none;
}

.workout-list {
  max-height: 150px; /* 限制動作列表高度 */
  overflow-y: auto;
  overflow-x: hidden;
}

.workout-item {
  padding: 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid #f0f0f0;
}

.workout-item:last-child {
  border-bottom: none;
}

.routine-card .q-card-actions {
  margin-top: auto;
  flex-shrink: 0; /* 防止按鈕區域被壓縮 */
}

/* 響應式設計 */
@media (max-width: 768px) {
  .routine-card {
    height: 435px; /* 手機版略微減少高度 */
  }

  .routine-card-content {
    padding: 12px 16px; /* 手機版減少內邊距 */
  }

  .routine-title {
    max-width: 150px; /* 手機版減少標題寬度 */
  }
}
</style>
