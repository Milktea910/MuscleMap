<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from 'src/stores/user'
import userService from 'src/services/user'

const user = useUserStore()

// 應用程式啟動時檢查登入狀態
onMounted(async () => {
  // 如果有 token，驗證其有效性並獲取最新用戶資料
  if (user.token) {
    try {
      const { data } = await userService.profile()
      // 更新用戶資料，但保留原有的 token（除非 API 回傳新的 token）
      user.login({
        account: data.user.account,
        role: data.user.role,
        gender: data.user.gender,
        _id: data.user._id,
        token: user.token,
      })
    } catch (error) {
      console.error('Token 驗證失敗，需要重新登入:', error)
      // 如果 profile API 失敗，表示 token 無效或已過期，需要重新登入
      user.logout()
    }
  }
})
</script>

<style></style>
