import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'
import DashboardView from '../../views/app/DashboardView.vue'
import MyAlbumView from '../../views/app/MyAlbumView.vue'
import MyProjectsView from '../../views/app/MyProjectsView.vue'
import SettingsView from '../../views/app/SettingsView.vue'
import NotFoundView from '../../views/NotFoundView.vue'
import DeveloperPublicView from '../../views/public/DeveloperPublicView.vue'
import ExploreView from '../../views/public/ExploreView.vue'
import HomeView from '../../views/public/HomeView.vue'
import LoginView from '../../views/public/LoginView.vue'
import RegisterView from '../../views/public/RegisterView.vue'
import ResetPasswordView from '../../views/public/ResetPasswordView.vue'
import AppLayout from '../layouts/AppLayout.vue'
import PublicLayout from '../layouts/PublicLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
        meta: {
          title: 'Developer Album',
        },
      },
      {
        path: 'explore',
        name: 'explore',
        component: ExploreView,
        meta: {
          title: 'Explorar Devs | Developer Album',
        },
      },
      {
        path: 'dev/:username',
        name: 'developer-public-profile',
        component: DeveloperPublicView,
        meta: {
          title: 'Perfil Público | Developer Album',
        },
      },
      {
        path: 'login',
        name: 'login',
        component: LoginView,
        meta: {
          title: 'Entrar | Developer Album',
          guestOnly: true,
        },
      },
      {
        path: 'register',
        name: 'register',
        component: RegisterView,
        meta: {
          title: 'Criar Conta | Developer Album',
          guestOnly: true,
        },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPasswordView,
        meta: {
          title: 'Redefinir Senha | Developer Album',
          guestOnly: true,
        },
      },
    ],
  },
  {
    path: '/app',
    component: AppLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardView,
        meta: {
          title: 'Dashboard | Developer Album',
          requiresAuth: true,
        },
      },
      {
        path: 'projects',
        name: 'my-projects',
        component: MyProjectsView,
        meta: {
          title: 'Meus Projetos | Developer Album',
          requiresAuth: true,
        },
      },
      {
        path: 'my-album',
        name: 'my-album',
        component: MyAlbumView,
        meta: {
          title: 'Meu Álbum | Developer Album',
          requiresAuth: true,
        },
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsView,
        meta: {
          title: 'Configurações | Developer Album',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: 'Página não encontrada | Developer Album',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  await authStore.bootstrap()

  const requiresAuth = Boolean(to.meta.requiresAuth)
  const guestOnly = Boolean(to.meta.guestOnly)
  const isAuthenticated = authStore.isAuthenticated

  if (to.name === 'home' && isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (requiresAuth && !isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (guestOnly && isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})

router.afterEach((to) => {
  document.title = typeof to.meta.title === 'string' ? to.meta.title : 'Developer Album'
})

export default router
