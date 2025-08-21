<template>
  <q-page class="q-pa-md">
    <!-- 權限檢查載入中 -->
    <div v-if="!hasPermission" class="text-center q-pa-xl">
      <q-spinner-hourglass color="primary" size="3em" />
      <div class="q-mt-md text-grey-6">檢查權限中...</div>
    </div>

    <!-- 有權限時顯示管理內容 -->
    <div v-else class="container fade-in-up">
      <!-- 頁面標題 -->
      <div class="text-center">
        <h1 class="section text-h4 q-mt-lg">管理頁面</h1>
        <p class="section-description text-center q-mb-lg">
          在這裡您可以查看和管理自己的課表，建立新的課表或編輯現有的課表。<br />
          您也可以瀏覽其他用戶分享的公開課表，並將喜歡的課表加入收藏。
        </p>
      </div>

      <!-- 管理功能選項卡 -->
      <q-tabs
        v-model="currentTab"
        inline-label
        outside-arrows
        mobile-arrows
        class="text-teal q-mb-md"
      >
        <q-tab name="homepage" icon="home" label="首頁內容管理" />
        <q-tab name="routines" icon="event_note" label="課表管理" />
        <q-tab name="wiki" icon="menu_book" label="百科管理" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="currentTab" animated>
        <!-- 首頁內容管理 -->
        <q-tab-panel name="homepage">
          <div class="row justify-between items-center q-mb-md">
            <div class="text-h6">精選文章管理</div>
            <q-btn color="primary" icon="add" label="新增文章" @click="addHomepageCard" />
          </div>

          <div class="row q-col-gutter-lg">
            <div
              v-for="(card, index) in homepageCards"
              :key="card._id || index"
              class="col-12 col-md-6 col-lg-4"
            >
              <q-card class="q-pa-md">
                <q-card-section>
                  <div class="row justify-between items-center q-mb-sm">
                    <div class="text-h6">
                      {{ card._id ? '編輯文章' : '新文章' }} {{ index + 1 }}
                    </div>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      size="sm"
                      @click="deleteHomepageCard(index)"
                    />
                  </div>

                  <q-input v-model="card.title" label="標題" outlined class="q-mb-sm" />

                  <q-input
                    v-model="card.description"
                    label="描述"
                    type="textarea"
                    rows="3"
                    outlined
                    class="q-mb-sm"
                  />

                  <q-input v-model="card.author" label="作者" outlined class="q-mb-sm" />

                  <q-input v-model="card.link" label="文章連結" outlined class="q-mb-sm" />

                  <q-input v-model="card.image" label="圖片網址" outlined class="q-mb-sm" />

                  <q-input v-model="card.buttonText" label="按鈕文字" outlined class="q-mb-sm" />

                  <!-- 進階選項 -->
                  <q-expansion-item label="進階選項" class="q-mb-sm">
                    <div class="q-pt-md">
                      <div class="row q-col-gutter-sm">
                        <div class="col-6">
                          <q-toggle v-model="card.isFeatured" label="設為精選" />
                        </div>
                        <div class="col-6">
                          <q-toggle v-model="card.isActive" label="啟用顯示" />
                        </div>
                      </div>
                      <q-input
                        v-model.number="card.order"
                        label="排序順序"
                        type="number"
                        outlined
                        class="q-mt-sm"
                      />
                    </div>
                  </q-expansion-item>

                  <!-- 圖片預覽 -->
                  <div class="text-center q-mb-sm">
                    <img
                      :src="card.image || 'https://cdn.quasar.dev/img/mountains.jpg'"
                      :alt="card.title"
                      style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px"
                    />
                  </div>
                </q-card-section>

                <q-card-actions align="center">
                  <q-btn
                    color="primary"
                    :label="card._id ? '更新' : '建立'"
                    @click="saveHomepageCard(index)"
                    :loading="savingCard === index"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </q-tab-panel>

        <!-- 課表管理 -->
        <q-tab-panel name="routines">
          <div class="text-h6 q-mb-md">用戶課表管理</div>

          <!-- 課表列表 -->
          <q-table
            :rows="allRoutines"
            :columns="routineColumns"
            row-key="_id"
            :loading="loadingRoutines"
            :filter="routineFilter"
            :pagination="routinePagination"
            @request="onRoutineRequest"
          >
            <template v-slot:top-right>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="routineFilter"
                placeholder="搜尋課表"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  color="primary"
                  icon="visibility"
                  size="sm"
                  @click="viewRoutine(props.row)"
                />
                <q-btn
                  flat
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteUserRoutine(props.row._id)"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-isPublic="props">
              <q-td :props="props">
                <q-chip :color="props.value ? 'green' : 'orange'" text-color="white" size="sm">
                  {{ props.value ? '公開' : '私人' }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- 百科管理 -->
        <q-tab-panel name="wiki">
          <div class="text-h6 q-mb-md">動作百科管理</div>

          <!-- 動作管理 -->
          <div class="row justify-between items-center q-mb-md">
            <div class="text-subtitle1">動作列表</div>
            <q-btn
              color="primary"
              icon="add"
              label="新增動作"
              @click="showCreateExerciseDialog = true"
            />
          </div>

          <q-table
            :rows="allExercises"
            :columns="exerciseColumns"
            row-key="_id"
            :loading="loadingExercises"
            :filter="exerciseFilter"
            :pagination="exercisePagination"
            @request="onExerciseRequest"
          >
            <template v-slot:top-right>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="exerciseFilter"
                placeholder="搜尋動作"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  color="primary"
                  icon="edit"
                  size="md"
                  @click="editExercise(props.row)"
                />
                <q-btn
                  flat
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="deleteExercise(props.row._id)"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-equipment="props">
              <q-td :props="props">
                <q-chip color="blue" text-color="white" size="md">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-difficulty="props">
              <q-td :props="props">
                <q-chip :color="getDifficultyColor(props.value)" text-color="white" size="md">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-targetMuscle="props">
              <q-td :props="props">
                <div v-if="Array.isArray(props.value)">
                  <q-chip
                    v-for="muscle in props.value"
                    :key="muscle"
                    color="purple"
                    text-color="white"
                    size="md"
                    class="q-mr-xs q-mb-xs"
                  >
                    {{ muscle }}
                  </q-chip>
                </div>
                <q-chip v-else color="purple" text-color="white" size="sm">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>

      <!-- 課表詳情對話框 -->
      <q-dialog v-model="showRoutineDialog" position="standard">
        <q-card style="min-width: 600px">
          <q-card-section>
            <div class="text-h6">課表詳情</div>
          </q-card-section>

          <q-card-section v-if="selectedRoutine">
            <div class="q-mb-md"><strong>標題：</strong>{{ selectedRoutine.title }}</div>
            <div class="q-mb-md"><strong>描述：</strong>{{ selectedRoutine.content }}</div>
            <div class="q-mb-md">
              <strong>建立者：</strong>{{ selectedRoutine.user?.username || '未知' }}
            </div>
            <div class="q-mb-md">
              <strong>狀態：</strong>
              <q-chip
                :color="selectedRoutine.isPublic ? 'green' : 'orange'"
                text-color="white"
                size="sm"
              >
                {{ selectedRoutine.isPublic ? '公開' : '私人' }}
              </q-chip>
            </div>
            <div class="q-mb-md"><strong>讚數：</strong>{{ selectedRoutine.likesCount || 0 }}</div>

            <!-- 週計劃內容顯示 -->
            <div class="text-subtitle1 q-mb-sm">課表內容：</div>

            <!-- 如果是週計劃格式 -->
            <div v-if="selectedRoutine.weeklyPlan && selectedRoutine.weeklyPlan.length > 0">
              <q-tabs v-model="selectedAdminDay" class="q-mb-md" align="left">
                <q-tab
                  v-for="dayPlan in selectedRoutine.weeklyPlan"
                  :key="dayPlan.day"
                  :name="dayPlan.day"
                  :label="getDayName(dayPlan.day)"
                />
              </q-tabs>

              <q-tab-panels v-model="selectedAdminDay" animated>
                <q-tab-panel
                  v-for="dayPlan in selectedRoutine.weeklyPlan"
                  :key="dayPlan.day"
                  :name="dayPlan.day"
                >
                  <div class="day-detail">
                    <div class="text-h6 q-mb-sm">
                      {{ getDayName(dayPlan.day) }}
                      <span v-if="dayPlan.name && dayPlan.name !== getDayName(dayPlan.day)">
                        - {{ dayPlan.name }}
                      </span>
                    </div>

                    <div v-if="dayPlan.isRestDay" class="rest-day-admin q-pa-md text-center">
                      <q-icon name="bed" size="2rem" color="grey-5" />
                      <div class="text-body1 q-mt-sm text-grey-6">休息日</div>
                      <div v-if="dayPlan.notes" class="text-body2 text-grey-6 q-mt-sm">
                        {{ dayPlan.notes }}
                      </div>
                    </div>

                    <div v-else-if="dayPlan.workouts && dayPlan.workouts.length > 0">
                      <q-list bordered>
                        <q-item
                          v-for="(workout, index) in dayPlan.workouts"
                          :key="index"
                          class="workout-item-admin"
                        >
                          <q-item-section>
                            <div class="row items-center">
                              <q-icon name="fitness_center" color="primary" class="q-mr-sm" />
                              <div>
                                {{ workout.exercise?.name || '未知動作' }} - {{ workout.sets }}組 x
                                {{ workout.reps }}次 (休息 {{ workout.rest }}秒)
                              </div>
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <div v-if="dayPlan.notes" class="day-notes-admin q-pa-sm q-mt-sm">
                        <div class="text-caption text-weight-medium">
                          <q-icon name="note" class="q-mr-xs" />
                          備註：
                        </div>
                        <div class="text-body2">{{ dayPlan.notes }}</div>
                      </div>
                    </div>

                    <div v-else class="no-workouts-admin q-pa-md text-center">
                      <q-icon name="info" size="1.5rem" color="grey-5" />
                      <div class="text-body2 q-mt-sm text-grey-6">此日尚未安排訓練</div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>

            <!-- 如果是舊格式（直接動作列表） -->
            <div v-else-if="selectedRoutine.workouts && selectedRoutine.workouts.length > 0">
              <div class="text-caption text-grey-6 q-mb-sm">（舊格式課表）</div>
              <q-list bordered>
                <q-item v-for="(workout, index) in selectedRoutine.workouts" :key="index">
                  <q-item-section>
                    <div class="row items-center">
                      <q-icon name="fitness_center" color="primary" class="q-mr-sm" />
                      <div>
                        {{ workout.exercise?.name || '未知動作' }} - {{ workout.sets }}組 x
                        {{ workout.reps }}次 (休息 {{ workout.rest }}秒)
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- 如果沒有任何訓練內容 -->
            <div v-else class="no-content-admin q-pa-md text-center">
              <q-icon name="info" size="2rem" color="grey-5" />
              <div class="text-body1 q-mt-sm text-grey-6">此課表尚未設定訓練內容</div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="關閉" @click="showRoutineDialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- 新增/編輯動作對話框 -->
      <q-dialog v-model="showCreateExerciseDialog" position="standard">
        <q-card style="min-width: 500px">
          <q-card-section>
            <div class="text-h6">{{ editingExercise ? '編輯動作' : '新增動作' }}</div>
          </q-card-section>

          <q-card-section>
            <q-input v-model="exerciseForm.name" label="動作名稱" outlined class="q-mb-md" />

            <q-select
              v-model="exerciseForm.equipment"
              label="器材"
              :options="equipmentOptions"
              outlined
              class="q-mb-md"
            />

            <q-select
              v-model="exerciseForm.difficulty"
              label="難度"
              :options="difficultyOptions"
              outlined
              class="q-mb-md"
            />

            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">目標肌群</div>
              <div
                v-for="(muscle, index) in exerciseForm.targetMuscle"
                :key="index"
                class="row q-gutter-sm q-mb-sm"
              >
                <div class="col">
                  <q-select
                    v-model="exerciseForm.targetMuscle[index]"
                    :label="`目標肌群 ${index + 1}`"
                    :options="muscleOptions"
                    outlined
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    v-if="exerciseForm.targetMuscle.length > 1"
                    flat
                    round
                    color="negative"
                    icon="remove"
                    @click="removeTargetMuscle(index)"
                  />
                </div>
              </div>
              <q-btn
                flat
                color="primary"
                icon="add"
                label="新增目標肌群"
                @click="addTargetMuscle"
                class="q-mb-md"
              />
            </div>

            <q-file
              v-model="exerciseForm.video"
              label="教學影片"
              outlined
              accept="video/*"
              class="q-mb-md"
            />

            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">注意事項 (至少需要三項)</div>
              <div
                v-for="(note, index) in exerciseForm.notes"
                :key="index"
                class="row q-gutter-sm q-mb-sm"
              >
                <div class="col">
                  <q-input
                    v-model="exerciseForm.notes[index]"
                    :label="`注意事項 ${index + 1}`"
                    outlined
                    :rules="[
                      (val) => !!val || `請填寫第${index + 1}項注意事項`,
                      (val) => (val && val.length <= 200) || '注意事項不能超過200字',
                    ]"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    v-if="exerciseForm.notes.length > 3"
                    flat
                    round
                    color="negative"
                    icon="remove"
                    @click="removeNote(index)"
                  />
                </div>
              </div>
              <q-btn flat color="primary" icon="add" label="新增注意事項" @click="addNote" />
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="取消" @click="closeExerciseDialog" />
            <q-btn
              color="primary"
              :label="editingExercise ? '更新' : '建立'"
              @click="saveExercise"
              :loading="savingExercise"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar, QDialog } from 'quasar'
import { useUserStore } from 'src/stores/user'
import { useArticleStore } from 'src/stores/article'
import { useRouter } from 'vue-router'
import routineService from 'src/services/routine'
import wikiService from 'src/services/wiki'
import { validMuscleNames } from 'src/config/muscleMapping'

const $q = useQuasar()
const user = useUserStore()
const articleStore = useArticleStore()
const router = useRouter()

// 響應式數據
const currentTab = ref('homepage')
const hasPermission = ref(false)

// 權限檢查函數
const checkPermissions = () => {
  if (!user.isLoggedIn) {
    hasPermission.value = false
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '請先登入',
    })
    router.push('/login')
    return false
  } else if (!user.isAdmin) {
    hasPermission.value = false
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '您沒有權限訪問此頁面',
    })
    router.push('/')
    return false
  }
  hasPermission.value = true
  return true
}

// 監聽用戶登入狀態變化
watch(
  () => user.isLoggedIn,
  () => {
    checkPermissions()
  },
  { immediate: true },
)

// 首頁卡片管理
const homepageCards = ref([
  {
    title: '健身新手指南',
    description: '從零開始的健身之路，教你正確的健身觀念與基本動作',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    link: 'https://example.com/fitness-guide',
    buttonText: '開始學習',
  },
  {
    title: '營養補充全攻略',
    description: '了解蛋白質、碳水化合物與脂肪的正確攝取比例',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
    link: 'https://example.com/nutrition-guide',
    buttonText: '立即了解',
  },
  {
    title: '重量訓練技巧',
    description: '掌握正確的重訓姿勢，避免運動傷害，提升訓練效果',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    link: 'https://example.com/weight-training',
    buttonText: '查看技巧',
  },
  {
    title: '有氧運動指南',
    description: '選擇適合你的有氧運動，提升心肺功能與燃脂效率',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    link: 'https://example.com/cardio-guide',
    buttonText: '開始運動',
  },
  {
    title: '恢復與休息',
    description: '學會正確的休息與恢復方法，讓你的訓練事半功倍',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    link: 'https://example.com/recovery-guide',
    buttonText: '了解更多',
  },
  {
    title: '運動心理學',
    description: '建立正確的運動心態，維持長期的健身動機',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
    link: 'https://example.com/sports-psychology',
    buttonText: '心理建設',
  },
])
const savingCard = ref(null)

// 課表管理
const allRoutines = ref([])
const loadingRoutines = ref(false)
const routineFilter = ref('')
const routinePagination = ref({
  page: 1,
  rowsPerPage: 10,
})
const showRoutineDialog = ref(false)
const selectedRoutine = ref(null)
const selectedAdminDay = ref('monday') // 管理員課表詳情的選擇日期

const routineColumns = [
  { name: 'title', required: true, label: '標題', align: 'left', field: 'title', sortable: true },
  {
    name: 'user',
    label: '建立者',
    align: 'left',
    field: (row) => row.user?.username || '未知',
    sortable: true,
  },
  { name: 'isPublic', label: '狀態', align: 'center', field: 'isPublic', sortable: true },
  { name: 'likesCount', label: '讚數', align: 'center', field: 'likesCount', sortable: true },
  {
    name: 'createdAt',
    label: '建立時間',
    align: 'center',
    field: 'createdAt',
    sortable: true,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  { name: 'actions', label: '操作', align: 'center' },
]

// 動作管理
const allExercises = ref([])
const loadingExercises = ref(false)
const exerciseFilter = ref('')
const exercisePagination = ref({
  page: 1,
  rowsPerPage: 10,
})
const showCreateExerciseDialog = ref(false)
const editingExercise = ref(false)
const savingExercise = ref(false)

const exerciseForm = ref({
  name: '',
  equipment: '',
  difficulty: '',
  targetMuscle: [''], // 改為陣列，預設一個空值
  video: null,
  notes: ['', '', ''], // 預設三個空字串
})

const exerciseColumns = [
  { name: 'name', required: true, label: '動作名稱', align: 'left', field: 'name', sortable: true },
  { name: 'equipment', label: '器材', align: 'center', field: 'equipment', sortable: true },
  { name: 'difficulty', label: '難度', align: 'center', field: 'difficulty', sortable: true },
  {
    name: 'targetMuscle',
    label: '目標肌群',
    align: 'center',
    field: 'targetMuscle',
    sortable: true,
  },
  { name: 'actions', label: '操作', align: 'center' },
]

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

const muscleOptions = validMuscleNames

// 載入首頁卡片
const loadHomepageCards = async () => {
  try {
    // 載入所有文章（包括未啟用的），管理員需要看到所有文章
    await articleStore.loadAllArticles({
      limit: 100, // 載入更多文章
      featured: undefined, // 不限制是否精選
      active: undefined, // 不限制是否啟用
    })
    homepageCards.value = articleStore.articles
  } catch (err) {
    // 如果 API 失敗，從 localStorage 載入
    console.log('從 API 載入失敗，嘗試載入本地資料', err)
    const stored = localStorage.getItem('homepage-articles')
    if (stored) {
      homepageCards.value = JSON.parse(stored)
    } else {
      // 使用預設資料
      homepageCards.value = articleStore.getFallbackArticles()
    }
  }
}

// 儲存首頁卡片
const saveHomepageCard = async (index) => {
  savingCard.value = index
  try {
    const card = homepageCards.value[index]

    // 如果卡片有 _id，表示是更新；否則是新增
    if (card._id) {
      await articleStore.updateArticle(card._id, card)
      $q.notify({
        color: 'positive',
        textColor: 'white',
        icon: 'check',
        message: `文章「${card.title}」更新成功`,
      })
    } else {
      const createdArticle = await articleStore.createArticle(card)
      // 更新本地資料的 _id
      homepageCards.value[index]._id = createdArticle._id
      $q.notify({
        color: 'positive',
        textColor: 'white',
        icon: 'check',
        message: `文章「${card.title}」建立成功`,
      })
    }

    // 同時儲存到 localStorage 作為備份
    localStorage.setItem('homepage-articles', JSON.stringify(homepageCards.value))

    // 重新載入文章列表
    await loadHomepageCards()
  } catch (error) {
    console.error('儲存失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: `儲存失敗: ${error.message || '未知錯誤'}`,
    })
  } finally {
    savingCard.value = null
  }
}

// 刪除文章
const deleteHomepageCard = async (index) => {
  const card = homepageCards.value[index]

  // 確認對話框
  $q.dialog({
    title: '確認刪除',
    message: `確定要刪除文章「${card.title}」嗎？`,
    persistent: true,
    ok: {
      push: true,
      label: '確認刪除',
      color: 'negative',
    },
    cancel: {
      push: true,
      label: '取消',
      color: 'grey',
    },
  })
    .onOk(async () => {
      // 用戶確認刪除
      try {
        if (card._id) {
          await articleStore.deleteArticle(card._id)
        }

        // 從本地陣列中移除
        homepageCards.value.splice(index, 1)

        // 更新 localStorage
        localStorage.setItem('homepage-articles', JSON.stringify(homepageCards.value))

        // 重新載入文章列表，確保與伺服器同步
        await loadHomepageCards()

        $q.notify({
          color: 'positive',
          textColor: 'white',
          icon: 'check',
          message: `文章「${card.title}」刪除成功`,
        })
      } catch (error) {
        console.error('刪除失敗:', error)
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: `刪除失敗: ${error.message || '未知錯誤'}`,
        })
      }
    })
    .onCancel(() => {
      // 用戶取消，不做任何事
      console.log('用戶取消了刪除操作')
    })
}

// 新增文章
const addHomepageCard = () => {
  const newCard = {
    title: '新文章標題',
    description: '請輸入文章描述',
    author: 'MuscleMap 編輯部',
    image: '',
    link: '',
    buttonText: '閱讀更多',
    isFeatured: true,
    isActive: true,
    order: homepageCards.value.length,
  }
  homepageCards.value.push(newCard)
}

const loadAllRoutines = async () => {
  loadingRoutines.value = true

  try {
    // 使用管理員 API 獲取所有課表

    const { data } = await routineService.getAllRoutines()

    allRoutines.value = data.data || []
  } catch (error) {
    console.error('載入課表失敗:', error)
    console.error('錯誤詳情:', error.response?.data)
    // 如果管理員 API 不存在，降級使用公開課表
    try {
      const { data } = await routineService.getPublicRoutines()
      allRoutines.value = data.data || []
    } catch (fallbackError) {
      console.error('載入公開課表也失敗:', fallbackError)
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: '載入課表失敗',
      })
    }
  } finally {
    loadingRoutines.value = false
  }
}

const onRoutineRequest = () => {
  // 這裡可以添加分頁邏輯
  loadAllRoutines()
}

const viewRoutine = (routine) => {
  selectedRoutine.value = routine
  // 如果是週計劃格式，預設選擇第一天
  if (routine.weeklyPlan && routine.weeklyPlan.length > 0) {
    selectedAdminDay.value = routine.weeklyPlan[0].day
  }
  showRoutineDialog.value = true
}

const deleteUserRoutine = async (routineId) => {
  $q.dialog({
    title: '確認刪除',
    message: '您確定要刪除這個課表嗎？此操作無法復原。',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await routineService.adminDelete(routineId)

      await loadAllRoutines()
      $q.notify({
        color: 'positive',
        textColor: 'white',
        icon: 'check',
        message: '課表刪除成功',
      })
    } catch (error) {
      console.error('刪除課表失敗:', error)
      console.error('錯誤詳情:', error.response?.data)
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: error.response?.data?.message || '刪除課表失敗',
      })
    }
  })
}

const loadAllExercises = async () => {
  loadingExercises.value = true
  try {
    const { data } = await wikiService.getExercises()
    allExercises.value = data.exercises || []
  } catch (error) {
    console.error('載入動作失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '載入動作失敗',
    })
  } finally {
    loadingExercises.value = false
  }
}

const onExerciseRequest = () => {
  // 這裡可以添加分頁邏輯
  loadAllExercises()
}

const editExercise = (exercise) => {
  editingExercise.value = true
  exerciseForm.value = {
    _id: exercise._id,
    name: exercise.name,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    targetMuscle: Array.isArray(exercise.targetMuscle)
      ? [...exercise.targetMuscle]
      : [exercise.targetMuscle || ''],
    video: null,
    notes: exercise.notes && exercise.notes.length >= 3 ? [...exercise.notes] : ['', '', ''], // 載入現有的注意事項或預設三個
  }
  showCreateExerciseDialog.value = true
}

const closeExerciseDialog = () => {
  showCreateExerciseDialog.value = false
  editingExercise.value = false
  exerciseForm.value = {
    name: '',
    equipment: '',
    difficulty: '',
    targetMuscle: [''], // 重置為陣列格式
    video: null,
    notes: ['', '', ''], // 重置注意事項
  }
}

const saveExercise = async () => {
  savingExercise.value = true
  try {
    const formData = new FormData()
    formData.append('name', exerciseForm.value.name)
    formData.append('equipment', exerciseForm.value.equipment)
    formData.append('difficulty', exerciseForm.value.difficulty)

    // 處理多個目標肌群
    exerciseForm.value.targetMuscle.forEach((muscle, index) => {
      if (muscle.trim()) {
        // 只添加非空的目標肌群
        formData.append(`targetMuscle[${index}]`, muscle)
      }
    })

    // 添加注意事項
    exerciseForm.value.notes.forEach((note, index) => {
      if (note.trim()) {
        // 只添加非空的注意事項
        formData.append(`notes[${index}]`, note)
      }
    })

    if (exerciseForm.value.video) {
      formData.append('video', exerciseForm.value.video)
    }

    if (editingExercise.value) {
      await wikiService.updateExercise(exerciseForm.value._id, formData)
    } else {
      await wikiService.createExercise(formData)
    }

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'check',
      message: editingExercise.value ? '動作更新成功' : '動作建立成功',
    })

    closeExerciseDialog()
    await loadAllExercises()
  } catch (error) {
    console.error('儲存動作失敗:', error)
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: error.response?.data?.message || '儲存動作失敗',
    })
  } finally {
    savingExercise.value = false
  }
}

const deleteExercise = async (exerciseId) => {
  $q.dialog({
    title: '確認刪除',
    message: '您確定要刪除這個動作嗎？此操作無法復原。',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await wikiService.deleteExercise(exerciseId)

      await loadAllExercises()
      $q.notify({
        color: 'positive',
        textColor: 'white',
        icon: 'check',
        message: '動作刪除成功',
      })
    } catch (error) {
      console.error('刪除動作失敗:', error)
      console.error('錯誤詳情:', error.response?.data)
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: error.response?.data?.message || '刪除動作失敗',
      })
    }
  })
}

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case '簡單':
      return 'green'
    case '普通':
      return 'orange'
    case '困難':
      return 'red'
    default:
      return 'grey'
  }
}

// 目標肌群管理函數
const addTargetMuscle = () => {
  exerciseForm.value.targetMuscle.push('')
}

const removeTargetMuscle = (index) => {
  if (exerciseForm.value.targetMuscle.length > 1) {
    exerciseForm.value.targetMuscle.splice(index, 1)
  }
}

// 注意事項管理函數
const addNote = () => {
  exerciseForm.value.notes.push('')
}

const removeNote = (index) => {
  if (exerciseForm.value.notes.length > 3) {
    exerciseForm.value.notes.splice(index, 1)
  }
}

// 週計劃輔助方法
const getDayName = (day) => {
  const dayNames = {
    monday: '星期一',
    tuesday: '星期二',
    wednesday: '星期三',
    thursday: '星期四',
    friday: '星期五',
    saturday: '星期六',
    sunday: '星期日',
  }
  return dayNames[day] || day
}

// 生命週期
onMounted(async () => {
  // 只有在權限檢查通過後才載入數據
  if (checkPermissions()) {
    loadHomepageCards()
    await loadAllRoutines()
    await loadAllExercises()
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
.rest-day-admin {
  background-color: rgba(158, 158, 158, 0.1);
  border-radius: 8px;
}

.workout-item-admin {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.workout-item-admin:last-child {
  border-bottom: none;
}

.day-notes-admin {
  background-color: rgba(25, 118, 210, 0.1);
  border-radius: 4px;
  border-left: 3px solid #1976d2;
}

.no-workouts-admin,
.no-content-admin {
  background-color: rgba(158, 158, 158, 0.05);
  border-radius: 8px;
  border: 1px dashed rgba(158, 158, 158, 0.3);
}

.day-detail {
  min-height: 200px;
}
</style>
