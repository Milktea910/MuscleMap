<template>
  <q-page class="flex flex-center">
    <div class="container q-mt-lg fade-in-up">
      <div class="text-center">
        <h1 class="section text-h4 q-mt-lg">肌肉地圖</h1>
        <p class="section-description text-center q-mb-lg">
          您可以在右邊選擇您想要的器材，然後點擊肌肉群來查看相關的動作和資訊。<br />
        </p>
      </div>
      <!-- 手機模式下的切換按鈕 -->
      <div class="lt-lg fixed-top-right q-pa-md">
        <q-btn
          round
          color="primary"
          :icon="showFront ? 'flip_to_back' : 'flip_to_front'"
          @click="showFront = !showFront"
          class="shadow-5"
        >
          <q-tooltip>{{ showFront ? '切換到背面' : '切換到正面' }}</q-tooltip>
        </q-btn>
      </div>

      <div class="row items-center">
        <!-- 桌面模式：顯示前後兩個視圖 -->
        <template v-if="gender === '男生'">
          <!-- 桌面版：同時顯示前後視圖 -->
          <div class="col-12 col-md-6 col-lg-4 flex flex-center gt-md">
            <MaleFront
              key="male-front-desktop"
              class="model"
              :selectedEquipments="selectedItems"
              :highlightedMuscles="highlightedMuscles"
              :highlightColor="currentHighlightColor"
            ></MaleFront>
          </div>
          <div class="col-12 col-md-6 col-lg-4 flex flex-center gt-md">
            <MaleBack
              key="male-back-desktop"
              class="model"
              :selectedEquipments="selectedItems"
              :highlightedMuscles="highlightedMuscles"
              :highlightColor="currentHighlightColor"
            ></MaleBack>
          </div>

          <!-- 手機版：根據狀態切換顯示 -->
          <div class="col-12 flex flex-center lt-lg">
            <MaleFront
              v-if="showFront"
              key="male-front-mobile"
              class="model"
              :selectedEquipments="selectedItems"
              :highlightedMuscles="highlightedMuscles"
              :highlightColor="currentHighlightColor"
            ></MaleFront>
            <MaleBack
              v-if="!showFront"
              key="male-back-mobile"
              class="model"
              :selectedEquipments="selectedItems"
              :highlightedMuscles="highlightedMuscles"
              :highlightColor="currentHighlightColor"
            ></MaleBack>
          </div>
        </template>
        <template v-else>
          <!-- 桌面版：同時顯示前後視圖 -->
          <div class="col-12 col-md-6 col-lg-4 flex flex-center gt-md">
            <FemaleFront
              key="female-front-desktop"
              class="model"
              :selectedEquipments="selectedItems"
              :highlightedMuscles="highlightedMuscles"
              :highlightColor="currentHighlightColor"
            ></FemaleFront>
          </div>
          <div class="col-12 col-md-6 col-lg-4 flex flex-center gt-md">
            <FemaleBack
              key="female-back-desktop"
              class="model"
              :selectedEquipments="selectedItems"
              :highlightedMuscles="highlightedMuscles"
              :highlightColor="currentHighlightColor"
            ></FemaleBack>
          </div>

          <!-- 手機版：根據狀態切換顯示 -->
          <div class="col-12 flex flex-center lt-lg">
            <FemaleFront
              v-if="showFront"
              key="female-front-mobile"
              class="model"
              :selectedEquipments="selectedItems"
              :highlightedMuscles="highlightedMuscles"
              :highlightColor="currentHighlightColor"
            ></FemaleFront>
            <FemaleBack
              v-if="!showFront"
              key="female-back-mobile"
              class="model"
              :selectedEquipments="selectedItems"
              :highlightedMuscles="highlightedMuscles"
              :highlightColor="currentHighlightColor"
            ></FemaleBack>
          </div>
        </template>
        <div class="col-12 col-lg-4 self-start q-mt-md shadow-3 card">
          <q-card
            flat
            bordered
            class="h-100"
            style="background-color: white; border-color: rgba(59, 102, 224, 0.2)"
          >
            <q-card-section>
              <q-toggle
                size="xl"
                v-model="gender"
                checked-icon="female"
                color="pink"
                false-value="男生"
                true-value="女生"
                :label="gender"
                unchecked-icon="male"
              />
            </q-card-section>
            <q-separator inset />
            <q-card-section class="q-pa-lg">
              <div class="section text-h4">運動器材</div>

              <div class="equipment-grid q-mt-md">
                <!-- 第一排 -->
                <div class="equipment-row">
                  <q-chip
                    size="xl"
                    :selected="equipments.啞鈴"
                    @click="selectEquipment('啞鈴')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/dumbbell.svg"
                  >
                    啞鈴
                  </q-chip>
                  <q-chip
                    size="xl"
                    :selected="equipments.器械"
                    @click="selectEquipment('器械')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/barbell.svg"
                  >
                    器械
                  </q-chip>
                  <q-chip
                    size="xl"
                    :selected="equipments.壺鈴"
                    @click="selectEquipment('壺鈴')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/kettlebells.svg"
                  >
                    壺鈴
                  </q-chip>
                  <q-chip
                    size="xl"
                    :selected="equipments.繩索"
                    @click="selectEquipment('繩索')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/cables.svg"
                  >
                    繩索
                  </q-chip>
                  <q-chip
                    size="xl"
                    :selected="equipments.槓片"
                    @click="selectEquipment('槓片')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/Plate.svg"
                  >
                    槓片
                  </q-chip>
                  <q-chip
                    size="xl"
                    :selected="equipments.史密斯"
                    @click="selectEquipment('史密斯')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/smith machine.svg"
                  >
                    史密斯
                  </q-chip>
                </div>

                <!-- 第二排 -->
                <div class="equipment-row">
                  <q-chip
                    size="xl"
                    :selected="equipments.槓鈴"
                    @click="selectEquipment('槓鈴')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/barbell.svg"
                  >
                    槓鈴
                  </q-chip>
                  <q-chip
                    size="xl"
                    :selected="equipments.徒手"
                    @click="selectEquipment('徒手')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/bodyweight.svg"
                  >
                    徒手
                  </q-chip>
                  <q-chip
                    size="xl"
                    :selected="equipments.藥球"
                    @click="selectEquipment('藥球')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/medicine ball.svg"
                  >
                    藥球
                  </q-chip>
                  <q-chip
                    size="xl"
                    :selected="equipments.彈力繩"
                    @click="selectEquipment('彈力繩')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/band.svg"
                  >
                    彈力繩
                  </q-chip>
                  <q-chip
                    size="xl"
                    :selected="equipments.伸展"
                    @click="selectEquipment('伸展')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/stretches.svg"
                  >
                    伸展
                  </q-chip>
                  <q-chip
                    size="xl"
                    @click="goToSearchResults('有氧')"
                    color="orange"
                    outline
                    text-color="orange"
                    icon="img:./assets/icons/cardio.svg"
                    clickable
                  >
                    有氧
                  </q-chip>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import MaleFront from 'src/components/MaleFront.vue'
import MaleBack from 'src/components/MaleBack.vue'
import FemaleFront from 'src/components/FemaleFront.vue'
import FemaleBack from 'src/components/FemaleBack.vue'

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import wikiService from 'src/services/wiki'
import { muscleToPartMapping } from 'src/config/muscleMapping'

const $q = useQuasar()
const router = useRouter()
const userStore = useUserStore()
const gender = ref('男生')

// 手機模式下切換前後視圖的狀態
const showFront = ref(true)

// 從登入使用者的性別設定 gender 值
const updateGenderFromUser = () => {
  if (userStore.isLoggedIn && userStore.gender) {
    gender.value = userStore.gender === 'male' ? '男生' : '女生'
  }
}

// 監聽使用者登入狀態與性別，自動更新 gender
watch(
  () => [userStore.isLoggedIn, userStore.gender],
  () => {
    updateGenderFromUser()
  },
  { immediate: true },
)

// 頁面載入時檢查使用者性別
onMounted(() => {
  updateGenderFromUser()
})

// 清理資源
onBeforeUnmount(() => {
  highlightedMuscles.value = []
  selectedEquipment.value = ''
  Object.keys(equipments.value).forEach((key) => {
    equipments.value[key] = false
  })
})

// 當前選中的器材（單選模式）
const selectedEquipment = ref('')
// 高亮的肌肉群
const highlightedMuscles = ref([])
// 當前高亮顏色
const currentHighlightColor = ref('rgba(59, 130, 246, 0.7)')

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

const selectedItems = computed(() => {
  return Object.entries(equipments.value)
    .filter(([, value]) => value === true)
    .map(([key]) => key)
})

// 根據器材搜尋對應的肌肉群
const searchMusclesByEquipment = async (equipment) => {
  try {
    // 防止組件被銷毀時還在執行異步操作
    if (!equipment) return

    const response = await wikiService.getExercises()

    // 再次檢查組件是否還存在
    if (!equipment || !response?.data?.exercises) return

    const exercises = response.data.exercises

    // 篩選出使用該器材的動作
    const filteredExercises = exercises.filter((exercise) => exercise.equipment === equipment)

    // 收集所有目標肌肉群
    const targetMuscles = new Set()
    filteredExercises.forEach((exercise) => {
      if (exercise.targetMuscle && Array.isArray(exercise.targetMuscle)) {
        exercise.targetMuscle.forEach((muscle) => {
          targetMuscles.add(muscle)
        })
      }
    })

    // 映射到肌肉圖的部位ID
    const highlightParts = []
    Array.from(targetMuscles).forEach((muscle) => {
      if (muscleToPartMapping[muscle]) {
        highlightParts.push(...muscleToPartMapping[muscle])
      }
    })

    highlightedMuscles.value = highlightParts
  } catch (error) {
    console.error('搜尋肌肉群失敗:', error)
    $q.notify({
      color: 'negative',
      message: '搜尋肌肉群失敗',
      icon: 'error',
    })
  }
}

// 選擇器材
const selectEquipment = async (equipment) => {
  // 防止快速點擊
  if (!equipment) return

  try {
    // 如果當前器材已經被選中，則取消選擇
    if (equipments.value[equipment]) {
      equipments.value[equipment] = false
      selectedEquipment.value = ''
      highlightedMuscles.value = []
      currentHighlightColor.value = 'rgba(59, 130, 246, 0.7)' // 恢復默認藍色
      return
    }

    // 重置所有器材選擇
    Object.keys(equipments.value).forEach((key) => {
      equipments.value[key] = false
    })

    // 選擇當前器材
    equipments.value[equipment] = true
    selectedEquipment.value = equipment

    // 設置高亮顏色
    currentHighlightColor.value = 'rgba(255, 152, 0, 1)'

    // 搜尋對應的肌肉群
    await searchMusclesByEquipment(equipment)
  } catch (error) {
    console.error('選擇器材失敗:', error)
    // 重置狀態
    Object.keys(equipments.value).forEach((key) => {
      equipments.value[key] = false
    })
    selectedEquipment.value = ''
    highlightedMuscles.value = []
    currentHighlightColor.value = 'rgba(59, 130, 246, 0.7)'
  }
}

// 跳轉到搜尋結果頁面
const goToSearchResults = (equipment) => {
  router.push({
    path: '/muscle-exercises',
    query: {
      equipment: equipment,
    },
  })
}
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

.section {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
}
.section-description {
  color: #718096;
  font-size: 1rem;
}
.fixed-top-right {
  position: fixed;
  top: 80px; // 避免與 header 重疊
  right: 16px;
  z-index: 1000;
}

.card {
  height: 750px;
}
.model {
  width: 450px;
  height: 800px;
}

.equipment-grid {
  display: flex;
  flex-direction: row;
}

.equipment-row {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
