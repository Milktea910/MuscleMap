<template>
  <q-layout view="hHh LpR lFf">
    <q-header reveal elevated class="text-white bg-primary">
      <q-toolbar class="bg-primary">
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" class="mobile-menu-btn" />

        <q-toolbar-title class="row items-center">
          <router-link
            to="/"
            style="display: inline-flex; align-items: center; text-decoration: none; color: inherit"
          >
            <img src="../assets/logo.png" />
          </router-link>
        </q-toolbar-title>

        <!-- 用戶狀態顯示區域 - 僅在1500px以上顯示 -->
        <div class="row items-center q-gutter-sm desktop-menu">
          <!-- 主功能選單 -->
          <template v-for="(menuItem, index) in mainMenuList" :key="'toolbar-' + index">
            <q-btn
              size="15px"
              flat
              :icon="menuItem.icon"
              color="white"
              :to="menuItem.to"
              class="q-px-sm parallelogram-btn"
            >
              <span class="q-ml-xs">{{ menuItem.label }}</span>
            </q-btn>
          </template>

          <!-- 底部選單項目 -->
          <template v-for="(menuItem, index) in bottomMenuList" :key="'toolbar-bottom-' + index">
            <q-btn
              size="15px"
              v-if="menuItem.action"
              flat
              :icon="menuItem.icon"
              color="white"
              @click="handleMenuClick(menuItem)"
              class="q-px-sm parallelogram-btn"
            >
              <span class="q-ml-xs">{{ menuItem.label }}</span>
            </q-btn>
            <q-btn
              size="15px"
              v-else
              flat
              :icon="menuItem.icon"
              color="white"
              :to="menuItem.to"
              class="q-px-sm parallelogram-btn"
            >
              <span class="q-ml-xs">{{ menuItem.label }}</span>
            </q-btn>
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" :breakpoint="1500" bordered class="mobile-drawer">
      <q-scroll-area class="fit">
        <q-list>
          <!-- 主功能選單 -->
          <template v-for="(menuItem, index) in mainMenuList" :key="index">
            <template v-if="menuItem.children">
              <q-expansion-item :icon="menuItem.icon" :label="menuItem.label" expand-separator>
                <q-item
                  v-for="(child, cIdx) in menuItem.children"
                  :key="cIdx"
                  clickable
                  v-ripple
                  :to="!child.action ? child.to : undefined"
                  :active="isActiveRoute(child.to)"
                  active-class="text-primary"
                  :style="
                    isActiveRoute(child.to) ? 'background-color: rgba(59, 102, 224, 0.1)' : ''
                  "
                  @click="child.action ? handleMenuClick(child) : undefined"
                >
                  <q-item-section avatar>
                    <q-icon :name="child.icon" :color="isActiveRoute(child.to) ? 'primary' : ''" />
                  </q-item-section>
                  <q-item-section>
                    {{ child.label }}
                  </q-item-section>
                </q-item>
              </q-expansion-item>
            </template>
            <q-item
              v-else
              clickable
              :active="isActiveRoute(menuItem.to)"
              active-class="text-primary"
              :style="isActiveRoute(menuItem.to) ? 'background-color: rgba(59, 102, 224, 0.1)' : ''"
              v-ripple
              :to="menuItem.to"
            >
              <q-item-section avatar>
                <q-icon
                  :name="menuItem.icon"
                  :color="isActiveRoute(menuItem.to) ? 'primary' : ''"
                />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
        <!-- 登入/登出選單固定在底部 -->
        <div style="position: absolute; bottom: 0; left: 0; width: 100%">
          <q-list>
            <template v-for="(menuItem, index) in bottomMenuList" :key="'bottom' + index">
              <q-item v-if="menuItem.action" clickable v-ripple @click="handleMenuClick(menuItem)">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-item
                v-else
                clickable
                v-ripple
                :to="menuItem.to"
                :active="isActiveRoute(menuItem.to)"
                active-class="text-primary"
                :style="
                  isActiveRoute(menuItem.to) ? 'background-color: rgba(59, 102, 224, 0.1)' : ''
                "
              >
                <q-item-section avatar>
                  <q-icon
                    :name="menuItem.icon"
                    :color="isActiveRoute(menuItem.to) ? 'primary' : ''"
                  />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user'
import userService from 'src/services/user'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const user = useUserStore()
const drawer = ref(false)

// 主功能選單（不含個人資料與登入/登出）
const mainMenuList = computed(() => {
  if (user.isLoggedIn) {
    return [
      {
        icon: 'home',
        label: '首頁',
        separator: false,
        to: '/',
      },
      {
        icon: 'accessibility_new',
        label: '肌肉地圖',
        separator: true,
        to: '/muscle',
      },
      {
        icon: 'event_note',
        label: '推薦課表',
        separator: false,
        to: '/routines',
      },

      {
        icon: 'calculate',
        label: '代謝計算機',
        separator: false,
        to: '/calculator',
      },
      {
        icon: 'article',
        label: '精選文章',
        separator: false,
        to: '/articles',
      },
      {
        icon: 'menu_book',
        label: '動作百科',
        separator: true,
        to: '/wiki',
      },
      {
        icon: 'table_chart',
        label: 'INBODY紀錄',
        separator: false,
        to: '/inbody',
      },
      {
        icon: 'list_alt',
        label: '我的課表',
        separator: false,
        to: '/myroutines',
      },
    ]
  } else {
    return [
      {
        icon: 'home',
        label: '首頁',
        separator: false,
        to: '/',
      },
      {
        icon: 'accessibility_new',
        label: '肌肉地圖',
        separator: true,
        to: '/muscle',
      },
      {
        icon: 'event_note',
        label: '推薦課表',
        separator: false,
        to: '/routines',
      },
      {
        icon: 'calculate',
        label: '代謝計算機',
        separator: false,
        to: '/calculator',
      },
      {
        icon: 'article',
        label: '精選文章',
        separator: false,
        to: '/articles',
      },
      {
        icon: 'menu_book',
        label: '動作百科',
        separator: false,
        to: '/wiki',
      },
    ]
  }
})

// 底部選單：登入前顯示登入/註冊，登入後顯示個人資料/登出
const bottomMenuList = computed(() => {
  if (user.isLoggedIn) {
    const menuItems = []

    // 如果是管理員，添加管理頁面
    if (user.isAdmin) {
      menuItems.push({
        icon: 'admin_panel_settings',
        label: '管理頁面',
        to: '/admin',
      })
    }

    menuItems.push(
      {
        icon: 'account_circle',
        label: '個人資料',
        to: '/profile',
      },
      {
        icon: 'logout',
        label: '登出',
        action: 'logout',
      },
    )

    return menuItems
  } else {
    return [
      {
        icon: 'login',
        label: '登入',
        to: '/login',
      },
      {
        icon: 'person_add',
        label: '註冊',
        to: '/register',
      },
    ]
  }
})

// 處理菜單項目點擊
const handleMenuClick = (menuItem) => {
  if (menuItem.action === 'logout') {
    handleLogout()
  }
  // 移除 router.push，讓 Vue Router 的 :to 屬性處理導航
}

// 處理登出
const handleLogout = async () => {
  try {
    await userService.logout()
    user.logout()
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'logout',
      message: '已成功登出',
    })
    // 登出後導向首頁
    router.push('/')
  } catch (error) {
    console.error('登出失敗:', error)
    // 即使 API 失敗也清除本地狀態
    user.logout()
    $q.notify({
      color: 'orange-4',
      textColor: 'white',
      icon: 'warning',
      message: '登出完成',
    })
    router.push('/')
  }
}

// 判斷路由是否為活動狀態
const isActiveRoute = (to) => {
  if (!to) return false
  return route.path === to
}

function toggleLeftDrawer() {
  drawer.value = !drawer.value
}
</script>

<style scoped lang="scss">
@use 'sass:color';

img {
  height: 46px;
  width: auto;
}

// 調整 toolbar 高度
.q-toolbar {
  min-height: 70px !important;
  padding: 12px 16px !important;
}

// 平行四邊形按鈕樣式
.parallelogram-btn {
  background-color: #30373e !important;
  color: white !important;
  transform: skew(-15deg);
  margin: 0 5px;
  border-radius: 4px;
  transition: all 0.3s ease;

  // 內容文字反向傾斜以保持水平
  .q-btn__content {
    transform: skew(15deg);

    // 確保內容中的所有元素都保持水平
    * {
      transform: none !important;
    }
  }

  // hover 效果
  &:hover {
    background-color: color.adjust(#30373e, $lightness: 10%) !important;
    transform: skew(-15deg) scale(1.05);

    // hover 時也要保持內容水平
    .q-btn__content {
      transform: skew(15deg);

      // 確保內容中的所有元素都保持水平
      * {
        transform: none !important;
      }
    }
  }

  // 圖標和文字顏色，並確保它們保持水平
  .q-icon,
  span {
    color: white !important;
  }

  // 特別針對圖標確保不傾斜
  .q-icon {
    transform: none !important;
  }
}

// 響應式控制 - 1500px 斷點
@media (min-width: 1500px) {
  .mobile-menu-btn {
    display: none !important;
  }

  .desktop-menu {
    display: flex !important;
  }

  .mobile-drawer {
    display: none !important;
  }
}

@media (max-width: 1499px) {
  .mobile-menu-btn {
    display: flex !important;
  }

  .desktop-menu {
    display: none !important;
  }

  .mobile-drawer {
    display: block !important;
  }
}
</style>
