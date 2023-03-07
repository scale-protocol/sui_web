import { createRouter, createWebHistory } from 'vue-router'
import HeaderComponent from '@/components/HeaderComponent.vue'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HeaderComponent,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },{
          path: '/airdrop',
          name: 'airDrop',
          component: () => import('@/views/AirDrop.vue')
        }
      ]
    },
    // {
    //   path: '/app-login',
    //   name: 'appLogin',
    //   component: () => import('@/views/login/AppLogin.vue')
    // },{
    //   path: '/download',
    //   name: 'download',
    //   component: () => import('@/views/DownloadApp.vue')
    // },
    // {
    //   path:'/liveness',
    //   name: 'liveness',
    //   component: () => import('@/views/LivenessView.vue')
    // },
    // {
    //   path:'/kycverified',
    //   name: 'kycverified',
    //   component: () => import('@/views/KYCVerifiedView.vue')
    // },
    // {
    //   path:'/minted',
    //   name:'minted',
    //   component: () => import('@/views/MintedView.vue')
    // },
    // {
    //   path:'/beingminted',
    //   name:'beingminted',
    //   component: () => import('@/views/BeingMintedView.vue')
    // },
    // {
    //   path: '/check-inbox',
    //   name: 'checkInBox',
    //   component: () => import('@/views/login/CheckInBox.vue')
    // },
    // {
    //   path: '/link-expired',
    //   name: 'linkExpired',
    //   component: () => import('@/views/login/LinkExpired.vue')
    // },
    // {
    //   path: '/proof-identity',
    //   name: 'proofOfIdentity',
    //   component: () => import('@/views/ProofOfIdentity.vue')
    // },
    // {
    //   path: '/qrcode-link',
    //   name: 'qrcodeLink',
    //   component: () => import('@/views/QrcodeLink.vue')
    // },
    // {
    //   path: '/link-use',
    //   name: 'linkInUse',
    //   component: () => import('@/views/LinkInUse.vue')
    // },
    // {
    //   path: '/verification-progress',
    //   name: 'verificationProgress',
    //   component: () => import('@/views/VerificationProgress.vue')
    // }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
