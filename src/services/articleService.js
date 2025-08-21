import apiService from './api'

export const articleApi = {
  // 獲取精選文章
  getFeaturedArticles() {
    return apiService.api.get('/article/featured')
  },

  // 獲取所有文章
  getAllArticles(params = {}) {
    return apiService.api.get('/article', { params })
  },

  // 獲取單篇文章
  getArticleById(id) {
    return apiService.api.get('/article/' + id)
  },

  // 創建文章
  createArticle(data) {
    return apiService.apiAuth.post('/article', data)
  },

  // 更新文章
  updateArticle(id, articleData) {
    return apiService.apiAuth.patch('/article/' + id, articleData)
  },

  // 刪除文章
  deleteArticle(id) {
    return apiService.apiAuth.delete('/article/' + id)
  },
}
