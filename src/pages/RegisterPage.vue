<template>
  <q-page class="flex flex-center">
    <div class="container q-mt-xl">
      <div class="row justify-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <q-card class="q-pa-lg">
            <q-card-section>
              <div class="text-h4 text-center q-mb-md">註冊</div>
              <q-form @submit="submit" class="q-gutter-xs">
                <q-input
                  filled
                  v-model="account.value.value"
                  label="帳號"
                  lazy-rules
                  :rules="account.errorMessage.value ? [account.errorMessage.value] : []"
                  :error="!!account.errorMessage.value"
                  type="text"
                  autocomplete="username"
                />

                <q-input
                  filled
                  v-model="username.value.value"
                  label="使用者名稱"
                  lazy-rules
                  :rules="username.errorMessage.value ? [username.errorMessage.value] : []"
                  :error="!!username.errorMessage.value"
                  type="text"
                />

                <q-input
                  filled
                  v-model="email.value.value"
                  label="電子郵件"
                  lazy-rules
                  :rules="email.errorMessage.value ? [email.errorMessage.value] : []"
                  :error="!!email.errorMessage.value"
                  type="email"
                  autocomplete="email"
                />

                <q-input
                  filled
                  v-model="password.value.value"
                  label="密碼"
                  lazy-rules
                  :rules="password.errorMessage.value ? [password.errorMessage.value] : []"
                  :error="!!password.errorMessage.value"
                  type="password"
                  autocomplete="new-password"
                />

                <q-input
                  filled
                  v-model="confirmPassword.value.value"
                  label="確認密碼"
                  lazy-rules
                  :rules="
                    confirmPassword.errorMessage.value ? [confirmPassword.errorMessage.value] : []
                  "
                  :error="!!confirmPassword.errorMessage.value"
                  type="password"
                  autocomplete="new-password"
                />

                <q-select
                  filled
                  v-model="gender.value.value"
                  label="性別"
                  :options="genderOptions"
                  emit-value
                  map-options
                  lazy-rules
                  :rules="gender.errorMessage.value ? [gender.errorMessage.value] : []"
                  :error="!!gender.errorMessage.value"
                />

                <div class="text-center q-mt-md">
                  <q-btn
                    label="註冊"
                    type="submit"
                    color="primary"
                    class="full-width"
                    :loading="isLoading"
                    size="md"
                  />
                </div>

                <div class="text-center q-mt-md">
                  <q-btn
                    flat
                    label="已有帳號？登入"
                    color="secondary"
                    @click="$router.push('/login')"
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

const $q = useQuasar()
const router = useRouter()
const isLoading = ref(false)

const genderOptions = [
  { label: '男性', value: 'male' },
  { label: '女性', value: 'female' },
]

const form = useForm({
  validationSchema: yup.object({
    account: yup
      .string()
      .required('帳號是必填的')
      .min(4, '帳號至少需要 4 個字元')
      .max(20, '帳號最多只能有 20 個字元')
      .matches(/^[a-zA-Z0-9]+$/, '帳號只能包含英文字母和數字'),
    username: yup
      .string()
      .required('使用者名稱是必填的')
      .min(2, '使用者名稱至少需要 2 個字元')
      .max(30, '使用者名稱最多只能有 30 個字元'),
    email: yup.string().required('電子郵件是必填的').email('請輸入有效的電子郵件地址'),
    password: yup
      .string()
      .required('密碼是必填的')
      .min(4, '密碼至少需要 4 個字元')
      .max(20, '密碼最多只能有 20 個字元'),
    confirmPassword: yup
      .string()
      .required('確認密碼是必填的')
      .oneOf([yup.ref('password')], '密碼不一致'),
    gender: yup.string().required('性別是必填的').oneOf(['male', 'female'], '請選擇有效的性別'),
  }),
})

const account = useField('account')
const username = useField('username')
const email = useField('email')
const password = useField('password')
const confirmPassword = useField('confirmPassword')
const gender = useField('gender')

const submit = form.handleSubmit(async (values) => {
  isLoading.value = true
  try {
    await userService.create({
      account: values.account,
      username: values.username,
      email: values.email,
      password: values.password,
      gender: values.gender,
    })
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '註冊成功，請登入',
    })
    // 註冊成功後，導向到登入頁
    router.push('/login')
  } catch (error) {
    console.error(error)
    const message = error?.response?.data?.message || '註冊失敗，請檢查輸入資料'
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
