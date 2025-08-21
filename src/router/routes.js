const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/IndexPage.vue') }],
  },
  {
    path: '/routines',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/RoutinesPage.vue') }],
  },
  {
    path: '/myroutines',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MyRoutinesPage.vue') }],
  },
  {
    path: '/calculator',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CalculaterPage.vue') }],
  },
  {
    path: '/articles',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ArticlesPage.vue') }],
  },
  {
    path: '/wiki',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/WikiPage.vue') }],
  },
  {
    path: '/muscle-exercises',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MuscleExercisePage.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/register',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/RegisterPage.vue') }],
  },
  {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ProfilePage.vue') }],
  },
  {
    path: '/inbody',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/InbodyPage.vue') }],
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AdminPage.vue') }],
  },
  {
    path: '/muscle',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MuscleMapPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
