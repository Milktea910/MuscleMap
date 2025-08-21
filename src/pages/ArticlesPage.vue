<template>
  <q-page class="q-pa-md">
    <div class="container fade-in-up">
      <div class="section text-h4 text-center q-ma-lg">精選文章</div>
      <p class="section-description text-center q-mb-lg">
        您可以找到各種健身相關的文章，涵蓋不同的健身主題和技巧。無論您是初學者還是有經驗的健身愛好者，都能找到有價值的資訊。
      </p>

      <!-- 載入中狀態 -->
      <div v-if="loading" class="text-center q-my-xl">
        <q-spinner-hourglass color="primary" size="3em" />
        <div class="q-mt-md text-grey-6">載入文章中...</div>
      </div>

      <!-- 文章列表 -->
      <div v-else class="row q-col-gutter-lg q-mt-sm">
        <div
          v-for="(article, index) in articles"
          :key="article._id || index"
          class="col-12 col-md-6 col-lg-4"
        >
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
import { onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useArticleStore } from '../stores/article.js'

const $q = useQuasar()
const articleStore = useArticleStore()

// 使用 computed 來獲取文章資料
const articles = computed(() => articleStore.featuredArticles)
const loading = computed(() => articleStore.loading)
const error = computed(() => articleStore.error)

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
onMounted(async () => {
  try {
    await articleStore.loadFeaturedArticles()

    // 如果有錯誤，顯示通知
    if (error.value) {
      $q.notify({
        color: 'orange-5',
        textColor: 'white',
        icon: 'warning',
        message: '載入文章時發生問題，顯示本地備份資料',
        timeout: 3000,
      })
    }
  } catch (err) {
    console.error('載入文章失敗:', err)
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      message: '載入文章失敗',
      timeout: 3000,
    })
  }
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
