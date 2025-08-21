import apiService from './api'

export default {
  // 創建新的 Inbody 資料
  create(data) {
    return apiService.apiAuth.post('/inbody', data)
  },

  // 取得使用者的 Inbody 紀錄列表
  getUserInbody() {
    return apiService.apiAuth.get('/inbody')
  },

  // 取得使用者的 Inbody 資料
  getProfile() {
    return apiService.apiAuth.get('/inbody/profile')
  },

  // 取得所有 Inbody 資料（需要管理員權限）
  getAll() {
    return apiService.apiAuth.get('/inbody')
  },

  // 根據ID取得 Inbody 資料
  getById(id) {
    return apiService.apiAuth.get(`/inbody/${id}`)
  },

  // 更新 Inbody 資料
  updateById(id, data) {
    return apiService.apiAuth.put(`/inbody/${id}`, data)
  },

  // 刪除 Inbody 資料
  deleteById(id) {
    return apiService.apiAuth.delete(`/inbody/${id}`)
  },
}
