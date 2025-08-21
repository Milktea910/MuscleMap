// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import userService from 'src/services/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const account = ref('')
    const username = ref('')
    const role = ref('user')
    const token = ref('')
    const gender = ref('')
    const _id = ref('')

    // 擴展個人資料資訊
    const profile = ref({})
    const profileLoading = ref(false)
    const profileError = ref(null)

    const isLoggedIn = computed(() => token.value.length > 0)
    const isAdmin = computed(() => role.value === 'admin')

    // 完整個人資料計算屬性
    const fullProfile = computed(() => ({
      account: account.value,
      username: username.value,
      role: role.value,
      gender: gender.value,
      _id: _id.value,
      ...profile.value,
    }))

    const login = (data) => {
      account.value = data.account
      username.value = data.username
      role.value = data.role
      gender.value = data.gender
      _id.value = data._id

      // 重新整理頁面時，用 token 取得使用者資料
      // 這個回應不包含 token
      if (data.token) {
        token.value = data.token
      }
    }

    const logout = () => {
      account.value = ''
      username.value = ''
      role.value = 'user'
      token.value = ''
      gender.value = 'male'
      _id.value = ''
      profile.value = {}
      profileError.value = null
    }

    // 載入完整個人資料
    const loadProfile = async () => {
      try {
        profileLoading.value = true
        profileError.value = null

        const { data } = await userService.profile()
        profile.value = data.user

        // 同步更新基本資訊
        if (data.user.account) account.value = data.user.account
        if (data.user.role) role.value = data.user.role
        if (data.user.gender) gender.value = data.user.gender
        if (data.user._id) _id.value = data.user._id

        return profile.value
      } catch (err) {
        profileError.value = err
        console.error('獲取個人資料失敗:', err)
        throw err
      } finally {
        profileLoading.value = false
      }
    }

    // 更新個人資料
    const updateProfile = async (updateData) => {
      try {
        profileLoading.value = true
        profileError.value = null

        const { data } = await userService.updateProfile(updateData)

        // 更新本地狀態
        if (data.user) {
          profile.value = { ...profile.value, ...data.user }

          // 同步更新基本資訊
          if (data.user.account) account.value = data.user.account
          if (data.user.gender) gender.value = data.user.gender
        }

        return data
      } catch (err) {
        profileError.value = err
        console.error('更新個人資料失敗:', err)
        throw err
      } finally {
        profileLoading.value = false
      }
    }

    return {
      account,
      username,
      role,
      token,
      gender,
      _id,
      profile,
      profileLoading,
      profileError,
      isLoggedIn,
      isAdmin,
      fullProfile,
      login,
      logout,
      loadProfile,
      updateProfile,
      loading: profileLoading, // 為了讓 ProfilePage 可以使用 loading 狀態
    }
  },
  {
    persist: {
      key: 'musclemap-user',
      pick: ['token', 'account', 'username', 'role', 'gender', '_id'],
    },
  },
)
