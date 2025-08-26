<template>
  <q-page padding>
    <div class="fade-in-up">
      <div class="section text-h4 text-center q-ma-lg">代謝計算機</div>
      <p class="section-description text-center">
        基礎代謝率（BMR）和每日總消耗（TDEE）是健身和營養管理的重要指標。透過這個計算機，您可以輕鬆計算自己的基礎代謝率和每日總消耗，幫助您更好地規劃飲食和運動。
      </p>

      <div class="container full-height flex flex-center">
        <div
          class="row q-col-gutter-none q-col-gutter-lg-md items-center full-width"
          style="min-height: 80vh"
        >
          <div class="col-12 col-lg-6 q-pa-none">
            <q-card class="my-card">
              <q-card-section class="q-pb-none">
                <div class="text-h6">基礎代謝率 (BMR) 計算機</div>
                <div class="text-subtitle2">
                  基礎代謝率（Basal Metabolic Rate,
                  BMR）是指身體在靜止狀態下，維持基本生命活動（如呼吸、心跳、體溫調節）所需消耗的最低熱量。了解自己的
                  BMR，有助於規劃每日熱量攝取與消耗，達到健康管理、減重或增肌等目標。
                </div>
              </q-card-section>
              <q-card-section>
                <q-form @submit.prevent="onSubmit" ref="bmrForm">
                  <div class="q-mb-md">
                    <q-option-group
                      v-model="gender"
                      :options="[
                        { label: '男生', value: 'male' },
                        { label: '女生', value: 'female' },
                      ]"
                      type="radio"
                      color="primary"
                      inline
                    />
                  </div>
                  <q-input
                    filled
                    v-model="age"
                    label="年齡 (歲)"
                    type="number"
                    lazy-rules
                    :rules="[(val) => val > 0 || '請輸入有效的年齡']"
                    ref="ageInput"
                  />
                  <q-input
                    filled
                    v-model="height"
                    label="身高 (cm)"
                    type="number"
                    lazy-rules
                    :rules="[(val) => val > 0 || '請輸入有效的身高']"
                    ref="heightInput"
                  />
                  <q-input
                    filled
                    v-model="weight"
                    label="體重 (kg)"
                    type="number"
                    lazy-rules
                    :rules="[(val) => val > 0 || '請輸入有效的體重']"
                    ref="weightInput"
                  />

                  <div class="text-center q-mt-md">
                    <q-btn
                      label="計算"
                      type="submit"
                      color="primary"
                      size="md"
                      :disable="!isFormValid"
                    />
                  </div>
                </q-form>
                <div v-if="bmr" class="text-center q-mt-md">
                  <div class="text-h5">您的基礎代謝率 (BMR) 為:{{ bmr }} 大卡</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-lg-6 q-mt-lg">
            <q-tabs v-model="tdeeTab" class="text-primary" align="left" dense>
              <q-tab name="normal" label="一般" />
              <q-tab name="diet" label="我想減肥" />
            </q-tabs>
            <q-tab-panels v-model="tdeeTab" animated>
              <q-tab-panel name="normal">
                <div class="title q-mb-md">
                  <div class="text-h6">每日總消耗(TDEE)</div>
                  <div class="text-subtitle2">
                    每日總消耗熱量（TDEE, Total Daily Energy
                    Expenditure）是指一個人一天內因基礎代謝、活動量、運動及消化食物等所消耗的總熱量。計算
                    TDEE
                    可以幫助你更精確地規劃飲食與運動，無論是想減重、增肌還是維持體重，都能作為熱量攝取的重要依據。
                  </div>
                </div>
                <div class="row q-col-gutter-lg items-end q-mt-md justify-center">
                  <div v-for="(card, n) in cards" :key="n" class="col-12 col-sm-6 col-md-4">
                    <q-card class="my-card flex column justify-between" style="height: 180px">
                      <div>
                        <q-card-section class="q-pb-none">
                          <div class="text-h6">{{ card.title }}</div>
                          <div class="text-subtitle2">{{ card.subtitle }}</div>
                        </q-card-section>
                        <q-card-section>{{ card.content }}</q-card-section>
                      </div>
                    </q-card>
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="diet">
                <div class="title q-mb-md">
                  <div class="text-h6">減肥建議熱量</div>
                  <div class="text-subtitle2">
                    建議每日攝取熱量比TDEE低約300~500大卡，有助於健康減重。下方為各活動等級的減肥建議熱量。<br />
                    ※ 避免過度節食造成肌肉流失，減重期間熱量不得低於基礎代謝率，建議攝取為 TDEE
                    -300~500 大卡。
                  </div>
                </div>
                <div class="row q-col-gutter-lg items-end q-mt-md justify-center">
                  <div v-for="(card, n) in dietCards" :key="n" class="col-12 col-sm-6 col-md-4">
                    <q-card class="my-card flex column justify-between" style="height: 180px">
                      <div>
                        <q-card-section class="q-pb-none">
                          <div class="text-h6">{{ card.title }}</div>
                          <div class="text-subtitle2">{{ card.subtitle }}</div>
                        </q-card-section>
                        <q-card-section>{{ card.content }}</q-card-section>
                      </div>
                    </q-card>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
const tdeeTab = ref('normal')

const age = ref()
const weight = ref()
const height = ref()
const gender = ref('male')
const bmr = ref()

const bmrForm = ref(null)
const ageInput = ref(null)
const weightInput = ref(null)
const heightInput = ref(null)

const isFormValid = computed(() => {
  return age.value > 0 && weight.value > 0 && height.value > 0
})

function calculateBMR() {
  if (gender.value === 'male') {
    bmr.value = 9.99 * weight.value + 6.25 * height.value - 4.92 * age.value + 5
  } else {
    bmr.value = 9.99 * weight.value + 6.25 * height.value - 4.92 * age.value - 161
  }
  bmr.value = bmr.value.toFixed(0)
}

function onSubmit() {
  if (isFormValid.value) {
    calculateBMR()
  }
}

const activityLevels = [
  {
    key: 'sedentary',
    title: '身體活動趨於靜態',
    subtitle: '(幾乎不運動)',
    factor: 1.2,
  },
  {
    key: 'light',
    title: '身體活動程度較低',
    subtitle: '(每週運動 1-3 天)',
    factor: 1.375,
  },
  {
    key: 'moderate',
    title: '身體活動程度正常',
    subtitle: '(每週運動 3-5 天)',
    factor: 1.55,
  },
  {
    key: 'active',
    title: '身體活動程度較高',
    subtitle: '(每週運動 6-7 天)',
    factor: 1.725,
  },
  {
    key: 'veryActive',
    title: '身體活動程度激烈',
    subtitle: '(長時間運動或體力工作)',
    factor: 1.9,
  },
]

const cards = computed(() => {
  // 若尚未計算BMR則不顯示TDEE
  if (!bmr.value) {
    return [
      ...activityLevels.map((lvl) => ({
        title: lvl.title,
        subtitle: lvl.subtitle,
        content: `BMR × ${lvl.factor} = --`,
      })),
    ]
  }
  return [
    ...activityLevels.map((lvl) => ({
      title: lvl.title,
      subtitle: lvl.subtitle,
      content: `BMR × ${lvl.factor} = ${(bmr.value * lvl.factor).toFixed(0)} 大卡`,
    })),
  ]
})

const dietCards = computed(() => {
  if (!bmr.value) {
    return activityLevels.map((lvl) => ({
      title: lvl.title,
      subtitle: lvl.subtitle,
      content: `BMR × ${lvl.factor} - 300~500 = --`,
    }))
  }
  return activityLevels.map((lvl) => {
    const tdee = bmr.value * lvl.factor
    const min = tdee - 500
    const max = tdee - 300
    return {
      title: lvl.title,
      subtitle: lvl.subtitle,
      content: `建議熱量:${min.toFixed(0)} ~ ${max.toFixed(0)} 大卡`,
    }
  })
})
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
  line-height: 1.6;
  font-size: 1rem;
}
@media (min-width: 1024px) {
  .q-col-gutter-lg-md {
    margin: -12px;

    > div {
      padding-left: 24px;
    }
  }
}
</style>
