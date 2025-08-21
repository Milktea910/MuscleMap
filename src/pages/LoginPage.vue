<template>
  <q-page class="flex flex-center">
    <div class="container">
      <div class="row justify-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <q-card class="q-pa-lg">
            <q-card-section>
              <div class="text-h4 text-center q-mb-md">登入</div>
              <q-form @submit="submit" class="q-col-gutter-lg">
                <q-input
                  filled
                  v-model="account.value.value"
                  label="帳號或電子郵件"
                  lazy-rules
                  :rules="account.errorMessage.value ? [account.errorMessage.value] : []"
                  :error="!!account.errorMessage.value"
                  :error-message="account.errorMessage.value"
                  type="text"
                  autocomplete="username"
                />

                <q-input
                  filled
                  v-model="password.value.value"
                  label="密碼"
                  lazy-rules
                  :rules="password.errorMessage.value ? [password.errorMessage.value] : []"
                  :error="!!password.errorMessage.value"
                  :error-message="password.errorMessage.value"
                  type="password"
                  autocomplete="current-password"
                />

                <div class="text-center q-mt-md">
                  <q-btn
                    label="登入"
                    type="submit"
                    color="primary"
                    class="full-width"
                    :loading="isLoading"
                    :disable="
                      !!account.errorMessage.value || !!password.errorMessage.value || isLoading
                    "
                    size="md"
                  />
                </div>

                <div class="text-center q-mt-md">
                  <q-btn
                    flat
                    label="還沒有帳號？註冊"
                    color="secondary"
                    @click="$router.push('/register')"
                    size="md"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import userService from 'src/services/user'
import { useUserStore } from 'src/stores/user'

const $q = useQuasar()
const router = useRouter()
const user = useUserStore()
const isLoading = ref(false)

const form = useForm({
  // 用 yup 定義表單驗證格式
  // https://github.com/jquense/yup
  validationSchema: yup.object({
    account: yup
      // 資料型態是文字
      .string()
      .required('帳號或電子郵件是必填的'),
    password: yup
      .string()
      .required('密碼是必填的')
      .min(4, '密碼至少需要 4 個字元')
      .max(20, '密碼最多只能有 20 個字元'),
  }),
})

const account = useField('account')
const password = useField('password')

const submit = form.handleSubmit(async (values) => {
  isLoading.value = true
  try {
    const { data } = await userService.login({
      account: values.account,
      password: values.password,
    })
    user.login(data.user)

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '登入成功',
    })
    // 登入成功後，導向到首頁
    router.push('/')
  } catch (error) {
    console.error(error)
    const message = error?.response?.data?.message || '登入失敗，請檢查帳號密碼'
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: message,
    })
  } finally {
    isLoading.value = false
  }
})
</script>
<style scoped></style>
