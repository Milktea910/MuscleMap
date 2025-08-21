import apiService from './api'

export default {
  create(data) {
    return apiService.api.post('/user', data)
  },
  login(data) {
    return apiService.api.post('/user/login', data)
  },
  profile() {
    return apiService.apiAuth.get('/user/profile')
  },
  updateProfile(data) {
    return apiService.apiAuth.patch('/user/profile', data)
  },
  refresh() {
    return apiService.apiAuth.patch('/user/refresh')
  },
  logout() {
    return apiService.apiAuth.delete('/user/logout')
  },
}
