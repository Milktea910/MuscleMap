<template>
  <q-page class="q-pa-md">
    <div class="container q-mt-lg">
      <div class="row q-col-gutter-lg equal-height-row">
        <!-- 個人資料卡片 -->
        <div class="col-12 col-md-4">
          <q-card class="profile-card q-pa-lg" flat bordered>
            <q-card-section class="text-center">
              <!-- 頭像區域 -->
              <div class="avatar-container q-mb-lg">
                <q-avatar size="120px" class="profile-avatar">
                  <q-icon
                    name="account_circle"
                    size="120px"
                    :color="userStore.fullProfile.gender === 'male' ? 'blue-6' : 'pink-6'"
                  />
                </q-avatar>
                <div class="avatar-overlay">
                  <q-icon name="camera_alt" size="24px" color="white" />
                </div>
              </div>
              <!-- 用戶名稱 -->
              <div class="text-h5 text-weight-bold q-mb-sm user-name">
                {{ userStore.fullProfile.username || '載入中...' }}
              </div>

              <!-- 角色徽章 -->
              <q-chip
                :color="userStore.fullProfile.role === 'admin' ? 'negative' : 'positive'"
                text-color="white"
                size="md"
                class="role-chip q-mb-lg"
                icon="badge"
              >
                {{ userStore.fullProfile.role === 'admin' ? '管理員' : '一般用戶' }}
              </q-chip>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <!-- 個人資訊列表 -->
              <q-list class="profile-info-list">
                <q-item class="profile-info-item">
                  <q-item-section avatar>
                    <q-avatar size="40px" color="primary" text-color="white">
                      <q-icon name="person" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="info-label">使用者名稱</q-item-label>
                    <q-item-label caption class="info-value">
                      {{ userStore.fullProfile.username || '載入中...' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="profile-info-item">
                  <q-item-section avatar>
                    <q-avatar size="40px" color="info" text-color="white">
                      <q-icon name="account_circle" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="info-label">帳號</q-item-label>
                    <q-item-label caption class="info-value">
                      {{ userStore.fullProfile.account || '載入中...' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="profile-info-item">
                  <q-item-section avatar>
                    <q-avatar size="40px" color="secondary" text-color="white">
                      <q-icon :name="userStore.fullProfile.gender === 'male' ? 'male' : 'female'" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="info-label">性別</q-item-label>
                    <q-item-label caption class="info-value">
                      {{ userStore.fullProfile.gender === 'male' ? '男性' : '女性' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item class="profile-info-item">
                  <q-item-section avatar>
                    <q-avatar size="40px" color="accent" text-color="white">
                      <q-icon name="calendar_today" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="info-label">加入時間</q-item-label>
                    <q-item-label caption class="info-value">
                      {{ formatDate(userStore.fullProfile.createdAt) || '載入中...' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-separator />

            <q-card-section class="text-center">
              <div class="action-buttons">
                <q-btn
                  label="返回首頁"
                  color="primary"
                  @click="$router.push('/')"
                  size="md"
                  class="full-width q-mb-sm"
                  icon="home"
                  unelevated
                />
                <q-btn
                  label="編輯資料"
                  color="secondary"
                  @click="editProfile"
                  size="md"
                  class="full-width"
                  icon="edit"
                  outline
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
        <!-- 個人課表 -->
        <div class="col-12 col-md-8">
          <q-card class="q-pa-lg profile-card">
            <q-card-section>
              <div class="text-h5 q-mb-md row items-center justify-between">
                <div class="row items-center">
                  <q-icon name="event_note" color="primary" class="q-mr-sm" />
                  我的課表
                </div>
                <q-btn
                  flat
                  color="primary"
                  icon="arrow_forward"
                  label="前往管理"
                  @click="$router.push('/myroutines')"
                  size="md"
                />
              </div>

              <q-table
                :rows="routineStore.userRoutines"
                :columns="routineColumns"
                row-key="_id"
                :loading="routineStore.loading"
                :pagination="{ rowsPerPage: 10 }"
                flat
                bordered
                class="full-height"
              >
                <template v-slot:body-cell-title="props">
                  <q-td :props="props">
                    {{ props.value || '-' }}
                  </q-td>
                </template>

                <template v-slot:body-cell-isPublic="props">
                  <q-td :props="props">
                    <q-chip
                      :color="props.value ? 'positive' : 'warning'"
                      text-color="white"
                      size="sm"
                    >
                      {{ props.value ? '公開' : '私人' }}
                    </q-chip>
                  </q-td>
                </template>

                <template v-slot:body-cell-likesCount="props">
                  <q-td :props="props">
                    {{ props.value || 0 }}
                  </q-td>
                </template>

                <template v-slot:body-cell-createdAt="props">
                  <q-td :props="props">
                    {{ formatDate(props.value) || '-' }}
                  </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="visibility"
                      size="sm"
                      @click="viewRoutine(props.row)"
                    />
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      size="sm"
                      @click="deleteRoutine(props.row._id)"
                    />
                  </q-td>
                </template>

                <template v-slot:no-data>
                  <div class="full-width full-height row flex-center text-grey q-gutter-sm">
                    <div class="text-center">
                      <q-icon name="event_note" size="48px" class="q-mb-md" />
                      <div class="text-h6 q-mb-sm">尚無個人課表</div>
                      <div class="text-body2">開始建立您的第一個課表吧！</div>
                    </div>
                  </div>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
        <!-- Inbody 紀錄 -->
        <div class="col-12">
          <q-card class="q-pa-lg profile-card">
            <q-card-section>
              <div class="text-h5 q-mb-md row items-center justify-between">
                <div class="row items-center">
                  <q-icon name="assessment" color="primary" class="q-mr-sm" />
                  Inbody 紀錄
                </div>
                <q-btn
                  flat
                  color="primary"
                  icon="arrow_forward"
                  label="前往管理"
                  @click="$router.push('/inbody')"
                  size="md"
                />
              </div>

              <!-- 圖表區域 -->
              <div class="charts-container q-mb-lg">
                <InbodyChartsSection
                  :inbody-history="inbodyStore.inbodyRecords"
                  :loading="inbodyStore.loading"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- 課表詳情對話框 -->
    <q-dialog v-model="showRoutineDialog" position="standard">
      <q-card style="min-width: 700px; max-width: 900px; max-height: 80vh">
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-h6">課表詳情</div>
            <q-btn icon="close" flat round dense @click="showRoutineDialog = false" />
          </div>
        </q-card-section>

        <q-card-section
          v-if="selectedRoutine"
          class="q-pt-none"
          style="max-height: 60vh; overflow-y: auto"
        >
          <!-- 課表基本資訊 -->
          <div class="q-mb-md">
            <div class="text-h6 q-mb-sm">{{ selectedRoutine.title }}</div>
            <div class="row items-center q-mb-sm">
              <q-chip color="primary" text-color="white" size="md" class="q-mr-sm">
                {{ selectedRoutine.user?.username || '未知用戶' }}
              </q-chip>
              <q-chip
                :color="selectedRoutine.isPublic ? 'positive' : 'warning'"
                text-color="white"
                size="md"
                class="q-mr-sm"
              >
                {{ selectedRoutine.isPublic ? '公開' : '私人' }}
              </q-chip>
              <div class="text-caption text-grey-6">
                {{ formatDate(selectedRoutine.createdAt) }}
              </div>
            </div>
            <div class="text-body1 q-mb-md">{{ selectedRoutine.content }}</div>
          </div>

          <!-- 課表內容 -->
          <div class="routine-detail-content">
            <!-- 如果是週計劃格式 -->
            <div v-if="selectedRoutine.weeklyPlan && selectedRoutine.weeklyPlan.length > 0">
              <div class="text-h6 q-mb-md">週計劃詳細內容</div>

              <q-tabs v-model="selectedDetailDay" class="q-mb-md" align="left">
                <q-tab
                  v-for="dayPlan in selectedRoutine.weeklyPlan"
                  :key="dayPlan.day"
                  :name="dayPlan.day"
                  :label="dayPlan.name || getDayName(dayPlan.day)"
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
                          <div class="text-h6">{{ workout.exercise?.name || '未知動作' }}</div>
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
                  <div class="text-h6">{{ workout.exercise?.name || '未知動作' }}</div>
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

        <q-card-actions align="right">
          <q-btn flat label="關閉" @click="showRoutineDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 編輯個人資料對話框 -->
    <q-dialog v-model="showEditDialog" position="standard">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">編輯個人資料</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveProfile" class="q-col-gutter-lg">
            <!-- 帳號 (不可編輯) -->
            <q-input
              v-model="editForm.account"
              label="帳號"
              outlined
              readonly
              disable
              hint="帳號無法修改"
            />

            <!-- 使用者名稱 -->
            <q-input
              v-model="editForm.username"
              label="使用者名稱"
              outlined
              :rules="[(val) => !!val || '使用者名稱不能為空']"
            />

            <!-- 性別 -->
            <q-select
              v-model="editForm.gender"
              :options="[
                { label: '男性', value: 'male' },
                { label: '女性', value: 'female' },
              ]"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="性別"
              outlined
              :rules="[(val) => !!val || '請選擇性別']"
            />

            <q-separator class="q-my-md" />

            <div class="text-subtitle2 text-grey-7 q-mb-sm">更改密碼 (選填)</div>

            <!-- 目前密碼 -->
            <q-input v-model="editForm.currentPassword" label="目前密碼" type="password" outlined />

            <!-- 新密碼 -->
            <q-input
              v-model="editForm.newPassword"
              label="新密碼"
              type="password"
              outlined
              :rules="[(val) => !val || val.length >= 6 || '密碼至少需要6個字元']"
            />

            <!-- 確認新密碼 -->
            <q-input
              v-model="editForm.confirmPassword"
              label="確認新密碼"
              type="password"
              outlined
              :rules="[
                (val) => !editForm.newPassword || !!val || '請確認新密碼',
                (val) => !editForm.newPassword || val === editForm.newPassword || '密碼不一致',
              ]"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" @click="showEditDialog = false" />
          <q-btn label="儲存" color="primary" @click="saveProfile" :loading="userStore.loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user'
import { useInbodyStore } from 'src/stores/inbody'
import { useRoutineStore } from 'src/stores/routine'
import InbodyChartsSection from 'src/components/InbodyChartsSection.vue'

const router = useRouter()
const $q = useQuasar()
const userStore = useUserStore()
const inbodyStore = useInbodyStore()
const routineStore = useRoutineStore()

// 響應式數據
const showRoutineDialog = ref(false)
const selectedRoutine = ref(null)
const selectedDetailDay = ref(0)
const showEditDialog = ref(false)
const editForm = ref({
  account: '',
  username: '',
  gender: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 課表表格欄位
const routineColumns = [
  { name: 'title', label: '課表標題', align: 'left', field: 'title', sortable: true },
  { name: 'isPublic', label: '狀態', align: 'center', field: 'isPublic', sortable: true },
  { name: 'likesCount', label: '讚數', align: 'center', field: 'likesCount', sortable: true },
  { name: 'createdAt', label: '建立時間', align: 'center', field: 'createdAt', sortable: true },
  { name: 'actions', label: '操作', align: 'center' },
]

// 檢查登入狀態
if (!userStore.isLoggedIn) {
  $q.notify({
    color: 'red-5',
    textColor: 'white',
    icon: 'warning',
    message: '請先登入',
  })
  router.push('/login')
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 獲取星期名稱
const getDayName = (dayIndex) => {
  const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  return days[dayIndex] || `第${dayIndex + 1}天`
}

// 載入個人資料
const loadProfile = async () => {
  try {
    await userStore.loadProfile()
  } catch (error) {
    console.error('獲取個人資料失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '獲取個人資料失敗',
    })
  }
}

// 載入 Inbody 紀錄
const loadInbodyRecords = async () => {
  try {
    await inbodyStore.fetchInbodyHistory()
  } catch (error) {
    console.error('載入 Inbody 紀錄失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '載入 Inbody 紀錄失敗',
    })
  }
}

// 載入個人課表
const loadUserRoutines = async () => {
  try {
    await routineStore.fetchUserRoutines()
  } catch (error) {
    console.error('載入個人課表失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '載入個人課表失敗',
    })
  }
}

// 查看課表詳情
const viewRoutine = (routine) => {
  selectedRoutine.value = routine
  // 設定為第一個可用的 tab（週計劃的第一天）
  if (routine.weeklyPlan && routine.weeklyPlan.length > 0) {
    selectedDetailDay.value = routine.weeklyPlan[0].day
  } else {
    selectedDetailDay.value = 0
  }
  showRoutineDialog.value = true
}

// 編輯個人資料
const editProfile = () => {
  // 初始化編輯表單
  editForm.value = {
    account: userStore.fullProfile.account || '',
    username: userStore.fullProfile.username || '',
    gender: userStore.fullProfile.gender || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  showEditDialog.value = true
}

// 儲存個人資料
const saveProfile = async () => {
  try {
    // 驗證表單
    if (
      editForm.value.newPassword &&
      editForm.value.newPassword !== editForm.value.confirmPassword
    ) {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: '新密碼與確認密碼不符',
      })
      return
    }

    // 準備更新資料
    const updateData = {
      username: editForm.value.username,
      gender: editForm.value.gender,
    }

    // 如果有新密碼，則加入密碼相關欄位
    if (editForm.value.newPassword) {
      updateData.currentPassword = editForm.value.currentPassword
      updateData.newPassword = editForm.value.newPassword
    }

    await userStore.updateProfile(updateData)

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'check',
      message: '個人資料更新成功',
    })

    showEditDialog.value = false
    await loadProfile() // 重新載入個人資料
  } catch (error) {
    console.error('更新個人資料失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: error.response?.data?.message || '更新個人資料失敗',
    })
  }
}

// 刪除課表
const deleteRoutine = async (routineId) => {
  $q.dialog({
    title: '確認刪除',
    message: '您確定要刪除這個課表嗎？此操作無法復原。',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await routineStore.deleteRoutine(routineId)
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

// 生命週期
onMounted(async () => {
  await loadProfile()
  await loadInbodyRecords()
  await loadUserRoutines()
})
</script>

<style scoped>
/* 圖表容器 */
.charts-container {
  margin-bottom: 1.5rem;
}

.charts-container .q-card {
  height: 250px;
}

.charts-container .q-card-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.charts-container canvas {
  flex: 1;
  max-height: 180px;
}

/* 等高布局 */
.equal-height-row {
  align-items: stretch;
}

.equal-height-row > [class*='col-'] {
  display: flex;
  flex-direction: column;
}

/* 確保卡片等高並填滿容器 */
.profile-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 讓課表的 card-section 填滿剩餘空間 */
.profile-card .q-card__section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 讓表格填滿剩餘空間 */
.full-height {
  flex: 1;
  height: 100%;
  min-height: 400px; /* 設定最小高度 */
}

.full-height .q-table__container {
  height: 100%;
  min-height: 350px;
}

.full-height .q-table__middle {
  flex: 1;
}

/* 空白狀態樣式 */
.full-height .q-table__bottom {
  margin-top: auto;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .profile-card {
    margin-bottom: 2rem;
  }

  .charts-container .q-card {
    height: 200px;
    margin-bottom: 1rem;
  }

  .charts-container canvas {
    max-height: 140px;
  }

  .action-buttons .q-btn {
    margin-bottom: 8px;
  }
}

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

.profile-card {
  animation: fadeInUp 0.6s ease-out;
}

/* 課表詳情對話框樣式 */
.routine-detail-content {
  min-height: 200px;
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
  min-height: 150px;
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
</style>
