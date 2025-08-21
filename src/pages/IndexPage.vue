<template>
  <q-page>
    <!-- Hero Section -->
    <section class="hero-section" ref="heroSection">
      <!-- 視差背景圖片 -->
      <div class="hero-parallax-bg" ref="parallaxBg"></div>

      <div class="hero-overlay">
        <div class="container">
          <div class="row items-center min-h-screen">
            <div class="col-12 col-md-6">
              <div class="hero-content">
                <h1 class="hero-title">
                  <span class="gradient-text">MuscleMap</span>
                </h1>
                <h2 class="hero-subtitle">智能健身訓練平台</h2>
                <p class="hero-description">
                  結合人體肌肉地圖、專業動作指導與個人化課表規劃， 讓你的健身之路更科學、更有效率。
                </p>
                <div class="hero-buttons">
                  <q-btn
                    size="lg"
                    color="primary"
                    icon="fitness_center"
                    label="開始訓練"
                    class="q-mr-md q-mb-sm hero-btn"
                    @click="goToMuscleMap"
                  />
                  <q-btn
                    size="lg"
                    outline
                    color="white"
                    icon="menu_book"
                    label="動作百科"
                    class="q-mb-sm hero-btn-outline"
                    @click="goToWiki"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section fade-in-up">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title">核心功能</h2>
          <p class="section-subtitle">專為健身愛好者設計的全方位訓練平台</p>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4" v-for="feature in features" :key="feature.id">
            <q-card class="feature-card" @click="navigateToFeature(feature.route)">
              <q-card-section class="text-center">
                <div class="feature-icon">
                  <q-icon :name="feature.icon" size="3rem" :color="feature.color" />
                </div>
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section" ref="statsSection">
      <!-- 視差背景圖片 -->
      <div class="stats-parallax-bg" ref="statsParallaxBg"></div>

      <div class="stats-overlay">
        <div class="container">
          <div class="row q-col-gutter-lg text-center">
            <div class="col-12 col-md-4" v-for="stat in stats" :key="stat.id">
              <div class="stat-item">
                <div class="stat-number">{{ stat.number }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Routines Section -->
    <section class="popular-section">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title">熱門課表</h2>
          <p class="section-subtitle">社群推薦的精選訓練課表</p>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4" v-for="routine in popularRoutines" :key="routine._id">
            <q-card class="routine-preview-card">
              <q-card-section>
                <div class="routine-header">
                  <h4 class="routine-title">{{ routine.title }}</h4>
                  <q-chip color="red" text-color="white" size="md">
                    <q-icon name="favorite" size="xs" class="q-mr-xs" />
                    {{ routine.likesCount || 0 }}
                  </q-chip>
                </div>
                <p class="routine-description">{{ routine.content }}</p>
                <div class="routine-author">
                  <q-chip color="primary" text-color="white" size="md">
                    {{ routine.user?.username || '匿名用戶' }}
                  </q-chip>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="text-center q-mt-lg">
          <q-btn
            size="lg"
            color="primary"
            outline
            icon="arrow_forward"
            label="查看更多課表"
            @click="goToRoutines"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="text-center">
          <h2 class="cta-title">準備開始你的健身之旅？</h2>
          <p class="cta-description">立即註冊，享受完整的個人化訓練體驗</p>
          <div class="cta-buttons">
            <q-btn
              v-if="!user.isLoggedIn"
              size="lg"
              color="primary"
              icon="person_add"
              label="立即註冊"
              class="q-mr-md q-mb-sm"
              @click="goToRegister"
            />
            <q-btn
              v-if="!user.isLoggedIn"
              size="lg"
              outline
              color="primary"
              icon="login"
              label="會員登入"
              class="q-mb-sm"
              @click="goToLogin"
            />
            <q-btn
              v-else
              size="lg"
              color="primary"
              icon="dashboard"
              label="前往個人面板"
              @click="goToProfile"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="footer-section bg-grey-9 text-white">
      <div class="container">
        <div class="q-pa-lg">
          <!-- 桌面版 Footer -->
          <div class="row justify-between items-start q-gutter-md gt-sm">
            <!-- 公司信息 -->
            <div class="col-auto footer-section">
              <div class="flex items-center q-mb-sm">
                <img
                  src="../assets/logo_white.png"
                  style="height: 50px; width: auto"
                  class="q-mr-sm"
                />
              </div>
              <p class="text-grey-4 q-mb-xs">打造您的專屬健身地圖</p>
              <p class="text-grey-4 q-mb-none text-caption">科學化訓練 • 個人化課表 • 全方位健身</p>
            </div>

            <!-- 快速鏈接 -->
            <div class="col-auto footer-section">
              <h5 class="text-white q-mb-sm">快速鏈接</h5>
              <div class="column q-gutter-xs">
                <router-link to="/muscle" class="footer-link">肌肉地圖</router-link>
                <router-link to="/routines" class="footer-link">推薦課表</router-link>
                <router-link to="/wiki" class="footer-link">動作百科</router-link>
                <router-link to="/calculator" class="footer-link">代謝計算機</router-link>
              </div>
            </div>

            <!-- 用戶服務 -->
            <div class="col-auto footer-section" v-if="user.isLoggedIn">
              <h5 class="text-white q-mb-sm">我的服務</h5>
              <div class="column q-gutter-xs">
                <router-link to="/profile" class="footer-link">個人資料</router-link>
                <router-link to="/myroutines" class="footer-link">我的課表</router-link>
                <router-link to="/inbody" class="footer-link">INBODY紀錄</router-link>
              </div>
            </div>

            <!-- 聯繫方式 -->
            <div class="col-auto footer-section">
              <h5 class="text-white q-mb-sm">聯繫我們</h5>
              <div class="column q-gutter-xs">
                <div class="flex items-center text-grey-4">
                  <q-icon name="email" class="q-mr-xs" size="14px" />
                  <span class="text-caption">contact@musclemap.com</span>
                </div>
                <div class="flex items-center text-grey-4">
                  <q-icon name="phone" class="q-mr-xs" size="14px" />
                  <span class="text-caption">+886 2 1234 5678</span>
                </div>
                <div class="flex items-center q-gutter-xs q-mt-sm">
                  <q-btn
                    round
                    size="sm"
                    icon="fab fa-facebook"
                    color="blue"
                    flat
                    class="social-btn"
                  />
                  <q-btn
                    round
                    size="sm"
                    icon="fab fa-instagram"
                    color="pink"
                    flat
                    class="social-btn"
                  />
                  <q-btn
                    round
                    size="sm"
                    icon="fab fa-youtube"
                    color="red"
                    flat
                    class="social-btn"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 手機版 Footer -->
          <div class="column q-gutter-md lt-md">
            <!-- 公司信息 -->
            <div class="text-center">
              <div class="flex items-center justify-center q-mb-sm">
                <img
                  src="../assets/logo_white.png"
                  style="height: 50px; width: auto"
                  class="q-mr-sm"
                />
              </div>
              <p class="text-grey-4 q-mb-none text-caption">打造您的專屬健身地圖 • 科學化訓練</p>
            </div>

            <!-- 快速鏈接 - 移動版 -->
            <div class="row justify-center q-gutter-md">
              <router-link to="/muscle" class="footer-link">肌肉圖譜</router-link>
              <router-link to="/routines" class="footer-link">推薦課表</router-link>
              <router-link to="/wiki" class="footer-link">動作百科</router-link>
              <router-link to="/calculator" class="footer-link">計算機</router-link>
            </div>

            <!-- 社交媒體 - 移動版 -->
            <div class="flex justify-center q-gutter-sm">
              <q-btn round size="sm" icon="fab fa-facebook" color="blue" flat class="social-btn" />
              <q-btn round size="sm" icon="fab fa-instagram" color="pink" flat class="social-btn" />
              <q-btn round size="sm" icon="fab fa-youtube" color="red" flat class="social-btn" />
            </div>
          </div>

          <!-- 版權信息 -->
          <q-separator class="q-my-md" color="grey-7" />
          <div class="row justify-between items-center">
            <div class="text-grey-4 text-caption">© 2025 MuscleMap. All rights reserved.</div>
            <div class="row q-gutter-md gt-xs">
              <a href="#" class="footer-link text-caption">隱私政策</a>
              <a href="#" class="footer-link text-caption">使用條款</a>
              <a href="#" class="footer-link text-caption">意見回饋</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user'
import routineService from 'src/services/routine'

const router = useRouter()
const user = useUserStore()

// 響應式數據
const popularRoutines = ref([])

// DOM引用
const heroSection = ref(null)
const parallaxBg = ref(null)
const statsSection = ref(null)
const statsParallaxBg = ref(null)

// 視差滾動處理函數
const handleParallaxScroll = () => {
  const scrollY = window.scrollY
  const heroHeight = heroSection.value?.offsetHeight || 0

  // Hero section視差效果
  if (scrollY <= heroHeight) {
    // 背景圖片以較慢速度移動，創造視差效果
    if (parallaxBg.value) {
      const parallaxSpeed = scrollY * 0.7
      parallaxBg.value.style.transform = `translateY(${parallaxSpeed}px)`
    }

    // 移除內容區域的視差效果
  }

  // Stats section視差效果
  if (statsSection.value && statsParallaxBg.value) {
    const statsTop = statsSection.value.offsetTop
    const statsHeight = statsSection.value.offsetHeight
    const viewportHeight = window.innerHeight

    // 當stats section進入視野時開始視差效果
    if (scrollY + viewportHeight > statsTop && scrollY < statsTop + statsHeight) {
      // 計算section在視野中的相對位置 (0到1之間)
      const sectionProgress = Math.max(
        0,
        Math.min(1, (scrollY + viewportHeight - statsTop) / (statsHeight + viewportHeight)),
      )
      // 調整視差計算，確保不會出現留白
      // 從負值開始，向上移動
      const parallaxSpeed = (sectionProgress - 0.5) * statsHeight * 0.6
      statsParallaxBg.value.style.transform = `translateY(${parallaxSpeed}px)`
    } else if (scrollY + viewportHeight <= statsTop) {
      // section還沒進入視野時，背景保持初始位置（負值，準備向上移動）
      const initialOffset = -statsSection.value.offsetHeight * 0.3
      statsParallaxBg.value.style.transform = `translateY(${initialOffset}px)`
    }
  }
}

// 功能特色
const features = ref([
  {
    id: 1,
    title: '肌肉地圖',
    description: '互動式人體肌肉圖，點選器材即時高亮對應肌肉群',
    icon: 'accessibility_new',
    color: 'primary',
    route: '/muscle',
  },
  {
    id: 2,
    title: '動作百科',
    description: '豐富的動作資料庫，包含詳細教學影片與注意事項',
    icon: 'menu_book',
    color: 'secondary',
    route: '/wiki',
  },
  {
    id: 3,
    title: '課表規劃',
    description: '個人化週課表設計，支援分享與社群互動',
    icon: 'event_note',
    color: 'accent',
    route: '/myroutines',
  },
  {
    id: 4,
    title: '體態追蹤',
    description: '記錄 Inbody 數據，追蹤身體變化趨勢',
    icon: 'trending_up',
    color: 'positive',
    route: '/inbody',
  },
  {
    id: 5,
    title: 'BMR 計算',
    description: '精準計算基礎代謝率，協助制定營養計畫',
    icon: 'calculate',
    color: 'warning',
    route: '/calculator',
  },
  {
    id: 6,
    title: '社群分享',
    description: '瀏覽熱門課表，與健身同好交流心得',
    icon: 'people',
    color: 'info',
    route: '/routines',
  },
])

// 統計數據
const stats = ref([
  { id: 1, number: '200+', label: '訓練動作' },
  { id: 2, number: '10+', label: '器材分類' },
  { id: 3, number: '15+', label: '肌肉群組' },
])

// 方法
const navigateToFeature = (route) => {
  router.push(route)
}

const goToMuscleMap = () => {
  router.push('/muscle')
}

const goToWiki = () => {
  router.push('/wiki')
}

const goToRoutines = () => {
  router.push('/routines')
}

const goToRegister = () => {
  router.push('/register')
}

const goToLogin = () => {
  router.push('/login')
}

const goToProfile = () => {
  router.push('/profile')
}

// 載入熱門課表
const loadPopularRoutines = async () => {
  try {
    const { data } = await routineService.getPublicRoutines()
    // 取前3個最熱門的課表
    popularRoutines.value = data.data.slice(0, 3)
  } catch (error) {
    console.error('載入熱門課表失敗:', error)
  }
}

// 生命週期
onMounted(() => {
  loadPopularRoutines()
  // 添加滾動事件監聽器
  window.addEventListener('scroll', handleParallaxScroll)
  // 初始化視差效果
  handleParallaxScroll()
})

onBeforeUnmount(() => {
  // 移除滾動事件監聽器
  window.removeEventListener('scroll', handleParallaxScroll)
})
</script>

<style scoped lang="scss">
// 動畫效果
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

// 全局樣式
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// Hero Section
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

// 視差背景圖片
.hero-parallax-bg {
  position: absolute;
  top: -20%;
  left: 0;
  width: 100%;
  height: 120%;
  background: url('../assets/hero-bg.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  will-change: transform;
  z-index: 1;
}

.hero-overlay {
  padding-top: 150px;
  background: rgba(0, 0, 0, 0.3);
  min-height: 100vh;
  display: flex;
  align-items: start;
  position: relative;
  z-index: 2;
}

.hero-content {
  color: white;
  z-index: 3;
  position: relative;
  will-change: transform;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
}

.gradient-text {
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.8rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.8;
  max-width: 500px;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.hero-btn {
  border-radius: 50px;
  padding: 12px 32px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.hero-btn-outline {
  border-radius: 50px;
  padding: 12px 32px;
  font-weight: 600;
  text-transform: none;
  border: 2px solid white;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.floating-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

// Features Section
.features-section {
  padding: 100px 0;
  background: #f8fafc;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
}

.feature-card {
  height: 100%;
  border-radius: 15px;
  border: 1px solid $primary;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.feature-description {
  color: #718096;
  line-height: 1.6;
}

// Stats Section
.stats-section {
  position: relative;
  overflow: hidden;
  padding: 80px 0;
  color: white;
}

// 視差背景圖片
.stats-parallax-bg {
  position: absolute;
  top: -50%;
  left: 0;
  width: 100%;
  height: 180%;
  background: url('../assets/stats-bg.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
  will-change: transform;
  z-index: 1;
}

.stats-overlay {
  position: relative;
  z-index: 2;
}

.stat-item {
  padding: 2rem 1rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

// Popular Section
.popular-section {
  padding: 100px 0;
  background: white;
}

.routine-preview-card {
  height: 100%;
  border-radius: 15px;
  border: 1px solid $primary;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.routine-preview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.routine-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.routine-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  flex: 1;
  margin-right: 1rem;
}

.routine-description {
  color: #718096;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.routine-author {
  display: flex;
  justify-content: flex-end;
}

// CTA Section
.cta-section {
  padding: 100px 0;
  background: url('../assets/cta-bg.png') no-repeat center -550px;
  background-size: cover;
  color: white;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

// Footer Section
.footer-section {
  min-width: 200px;

  h6 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
  }
}

.footer-link {
  color: #bdbdbd;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.3s ease;

  &:hover {
    color: white;
    text-decoration: none;
  }

  &:visited {
    color: #bdbdbd;
  }
}

.social-btn {
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

// 響應式設計
// 超大螢幕 (1200px+)
@media (min-width: 1200px) {
  .hero-title {
    font-size: 4.5rem;
  }
  .hero-subtitle {
    font-size: 2rem;
  }
}

// 平板設備 (768px - 1024px)
@media (max-width: 1024px) and (min-width: 769px) {
  .hero-parallax-bg {
    background: url('../assets/hero-bg.png') no-repeat -1100px center;
    background-size: cover;
  }

  .hero-title {
    font-size: 3.5rem;
  }
  .hero-subtitle {
    font-size: 1.6rem;
  }
  .hero-description {
    font-size: 1rem;
  }
}

// 手機設備 (最大 768px)
@media (max-width: 768px) {
  // 小螢幕使用不同的背景圖片
  .hero-parallax-bg {
    background: url('../assets/hero-bg.png') no-repeat -1100px center;
    background-size: cover;
    background-attachment: scroll; // 在小螢幕上可能需要改為scroll以提升性能
  }
  .hero-overlay {
    padding-top: 0px;
    align-items: center;
  }
  .hero-content {
    text-align: center;
  }

  .hero-title {
    font-size: 2.8rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .hero-description {
    font-size: 1rem;
    max-width: 100%;
  }

  .hero-buttons {
    justify-content: center;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-title {
    font-size: 2rem;
  }

  .cta-buttons {
    justify-content: center;
  }

  .stats-parallax-bg {
    background: url('../assets/stats-bg.png') no-repeat center center;
    background-attachment: scroll; // 提升移動設備性能
  }

  .cta-section {
    padding: 100px 0;
    background: url('../assets/cta-bg.png') no-repeat center center;
    background-size: cover;
    color: white;
  }

  // Footer 手機版調整
  .footer-section {
    min-width: auto;
    text-align: center;
  }

  .footer-link {
    font-size: 12px;
  }

  .social-btn {
    padding: 6px;
  }
}

// 超小螢幕設備 (最大 576px)
@media (max-width: 576px) {
  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
  }

  .hero-description {
    font-size: 0.95rem;
    padding: 0 10px;
  }

  .hero-btn,
  .hero-btn-outline {
    width: 100%;
    margin-bottom: 10px;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .cta-title {
    font-size: 1.8rem;
  }

  .container {
    padding: 0 15px;
  }
}
</style>
