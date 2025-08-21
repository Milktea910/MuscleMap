<template>
  <q-page class="q-pa-md">
    <div class="container fade-in-up">
      <div class="section text-h4 text-center q-ma-lg">精選文章</div>
      <p class="section-description text-center q-mb-lg">
        您可以找到各種健身相關的文章，涵蓋不同的健身主題和技巧。無論您是初學者還是有經驗的健身愛好者，都能找到有價值的資訊。
      </p>
      <div class="row q-col-gutter-lg q-mt-sm">
        <div v-for="(article, index) in articles" :key="index" class="col-12 col-md-6 col-lg-4">
          <q-card class="my-card article-card" @click="openArticle(article)">
            <div class="card-image-container">
              <img
                :src="article.image || 'https://cdn.quasar.dev/img/mountains.jpg'"
                :alt="article.title"
                class="card-image"
              />
              <div class="card-overlay">
                <q-icon name="open_in_new" size="2rem" color="white" />
              </div>
            </div>

            <q-card-section>
              <div class="text-h6 article-title">{{ article.title || '標題待設定' }}</div>
              <div class="text-subtitle2 text-grey-7">
                {{ article.author || 'MuscleMap 編輯部' }}
              </div>
              <div class="text-body2 q-mt-sm article-description">
                {{ article.description || '內容描述待設定' }}
              </div>
            </q-card-section>

            <q-card-actions class="q-px-md q-pb-md">
              <q-space />
              <q-btn
                flat
                color="primary"
                :label="article.buttonText || '閱讀更多'"
                icon="arrow_forward"
                @click.stop="openArticle(article)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// 精選文章（儲存在 localStorage 中）
const articles = ref([
  {
    title: '健身入門指南',
    description: '從零開始的健身之路，建立正確的健身觀念與基本動作',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    link: 'https://example.com/fitness-guide',
    buttonText: '開始學習',
  },
  {
    title: '營養補充攻略',
    description: '了解蛋白質、碳水化合物與脂肪的最佳比例',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
    link: 'https://example.com/nutrition-guide',
    buttonText: '立即了解',
  },
  {
    title: '重量訓練指南',
    description: '掌握正確的訓練姿勢與動作技巧，避免運動傷害',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    link: 'https://example.com/weight-training',
    buttonText: '深入了解',
  },
  {
    title: '有氧運動指南',
    description: '探索適合你的有氧運動，提升心肺功能與耐力',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    link: 'https://example.com/cardio-guide',
    buttonText: '開始運動',
  },
  {
    title: '恢復與休息',
    description: '學習正確的恢復技巧，讓你的訓練事半功倍',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
    link: 'https://example.com/recovery-guide',
    buttonText: '了解更多',
  },
  {
    title: '運動心理學',
    description: '建立正確的運動心態，維持長期的健身動力',
    author: 'MuscleMap 編輯部',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
    link: 'https://example.com/sports-psychology',
    buttonText: '心理建設',
  },
])

// 載入精選文章資料
const loadArticles = () => {
  const saved = localStorage.getItem('homepage-articles')
  if (saved) {
    try {
      articles.value = JSON.parse(saved)
    } catch (error) {
      console.error('載入文章資料失敗:', error)
    }
  }
}

// 開啟文章
const openArticle = (article) => {
  if (article.link) {
    // 在新視窗開啟外部連結
    window.open(article.link, '_blank')
  } else {
    $q.notify({
      color: 'orange-5',
      textColor: 'white',
      icon: 'info',
      message: '此文章尚未設定連結',
    })
  }
}

// 頁面載入時載入文章
onMounted(() => {
  loadArticles()
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
.my-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.my-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.article-card {
  cursor: pointer;
}

.card-image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.my-card:hover .card-overlay {
  opacity: 1;
}

.my-card:hover .card-image {
  transform: scale(1.05);
}

.article-title {
  line-height: 1.3;
  margin-bottom: 4px;
}

.article-description {
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
