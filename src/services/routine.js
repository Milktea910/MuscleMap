import apiServices from './api'

const { apiAuth } = apiServices

const routineService = {
  // 建立新課表
  create(data) {
    return apiAuth.post('/routine', data)
  },

  // 獲取我的課表
  getMyRoutines() {
    return apiAuth.get('/routine/my')
  },

  // 獲取我喜歡的課表
  getLikedRoutines() {
    return apiAuth.get('/routine/liked')
  },

  // 獲取用戶課表（別名方法）
  getUserRoutines() {
    return apiAuth.get('/routine/my')
  },

  // 獲取公開課表
  getPublicRoutines() {
    return apiAuth.get('/routine/public')
  },

  // 刪除課表
  delete(id) {
    return apiAuth.delete(`/routine/${id}`)
  },

  // 刪除課表（別名方法）
  deleteRoutine(id) {
    return apiAuth.delete(`/routine/${id}`)
  },

  // 更新課表
  update(id, data) {
    return apiAuth.patch(`/routine/${id}`, data)
  },

  // 切換點讚
  toggleLike(id) {
    return apiAuth.post(`/routine/${id}/like`)
  },

  // 更新公開狀態
  updateVisibility(id, isPublic) {
    return apiAuth.patch(`/routine/${id}/visibility`, { isPublic })
  },

  // 管理員：獲取所有課表
  getAllRoutines() {
    return apiAuth.get('/routine/admin/all')
  },

  // 管理員：刪除任意課表
  adminDelete(id) {
    return apiAuth.delete(`/routine/admin/${id}`)
  },
}

export default routineService
