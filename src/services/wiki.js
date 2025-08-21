import apiService from './api'

const { api, apiAuth } = apiService

export default {
  // 取得所有動作資料
  getExercises() {
    return api.get('/exercise')
  },

  // 根據ID取得單一動作資料
  getExerciseById(id) {
    return api.get(`/exercise/${id}`)
  },

  // 管理員：建立動作
  createExercise(data) {
    return apiAuth.post('/exercise', data)
  },

  // 管理員：更新動作
  updateExercise(id, data) {
    return apiAuth.patch(`/exercise/${id}`, data)
  },

  // 管理員：刪除動作
  deleteExercise(id) {
    return apiAuth.delete(`/exercise/${id}`)
  },
}
