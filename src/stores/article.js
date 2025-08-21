import { defineStore } from 'pinia'
import { ref } from 'vue'
import { articleApi } from '../services/articleService.js'

export const useArticleStore = defineStore('article', () => {
  // 狀態
  const articles = ref([])
  const featuredArticles = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 分頁相關
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  })

  // 清除錯誤
  const clearError = () => {
    error.value = null
  }

  // 獲取精選文章
  const loadFeaturedArticles = async () => {
    try {
      loading.value = true
      clearError()

      const response = await articleApi.getFeaturedArticles()

      if (response.data.success) {
        featuredArticles.value = response.data.data
      } else {
        throw new Error(response.data.message || '獲取精選文章失敗')
      }
    } catch (err) {
      console.error('載入精選文章失敗:', err)
      error.value = err.response?.data?.message || err.message || '載入精選文章失敗'

      // 如果 API 失敗，回退到 localStorage 資料
      const fallbackData = getFallbackArticles()
      if (fallbackData.length > 0) {
        featuredArticles.value = fallbackData
        console.log('使用本地備份文章資料')
      }
    } finally {
      loading.value = false
    }
  }

  // 獲取所有文章
  const loadAllArticles = async (params = {}) => {
    try {
      loading.value = true
      clearError()

      const response = await articleApi.getAllArticles(params)

      if (response.data.success) {
        articles.value = response.data.data.articles
        pagination.value = {
          currentPage: response.data.data.currentPage,
          totalPages: response.data.data.totalPages,
          total: response.data.data.total,
          limit: params.limit || 10,
        }
      } else {
        throw new Error(response.data.message || '獲取文章列表失敗')
      }
    } catch (err) {
      console.error('載入文章列表失敗:', err)
      error.value = err.response?.data?.message || err.message || '載入文章列表失敗'
    } finally {
      loading.value = false
    }
  }

  // 創建文章
  const createArticle = async (articleData) => {
    try {
      loading.value = true
      clearError()

      const response = await articleApi.createArticle(articleData)

      if (response.data.success) {
        // 重新載入文章列表
        await loadFeaturedArticles()
        return response.data.data
      } else {
        throw new Error(response.data.message || '創建文章失敗')
      }
    } catch (err) {
      console.error('創建文章失敗:', err)
      error.value = err.response?.data?.message || err.message || '創建文章失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新文章
  const updateArticle = async (id, articleData) => {
    try {
      loading.value = true
      clearError()

      const response = await articleApi.updateArticle(id, articleData)

      if (response.data.success) {
        // 重新載入文章列表
        await loadFeaturedArticles()
        return response.data.data
      } else {
        throw new Error(response.data.message || '更新文章失敗')
      }
    } catch (err) {
      console.error('更新文章失敗:', err)
      error.value = err.response?.data?.message || err.message || '更新文章失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 刪除文章
  const deleteArticle = async (id) => {
    try {
      loading.value = true
      clearError()

      const response = await articleApi.deleteArticle(id)

      if (response.data.success) {
        // 重新載入文章列表
        await loadFeaturedArticles()
        return true
      } else {
        throw new Error(response.data.message || '刪除文章失敗')
      }
    } catch (err) {
      console.error('刪除文章失敗:', err)
      error.value = err.response?.data?.message || err.message || '刪除文章失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 獲取本地備份文章資料（原有的 localStorage 資料）
  const getFallbackArticles = () => {
    try {
      const saved = localStorage.getItem('homepage-articles')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (err) {
      console.error('讀取本地文章資料失敗:', err)
    }

    // 預設文章資料
    return [
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
    ]
  }

  return {
    // 狀態
    articles,
    featuredArticles,
    loading,
    error,
    pagination,

    // 方法
    clearError,
    loadFeaturedArticles,
    loadAllArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getFallbackArticles,
  }
})
