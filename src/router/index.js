import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Auth/Login.vue'),
    meta: { guest:true }
  },
  {
    path: '/super-admin',
    name: 'super.admin',
    component: () => import('../views/SuperAdmin/SuperAdmin.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role !== 'super admin'){
        router.replace('/')
      }
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin/Admin.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/jurusan',
    name: 'jurusan',
    component: () => import('../views/Admin/Jurusan.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/mahasiswa',
    name: 'mahasiswa',
    component: () => import('../views/Admin/Mahasiswa.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/mahasiswa.detail/:id',
    name: 'mahasiswa.detail',
    component: () => import('../views/Admin/MahasiswaDetail.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/mahasiswa.edit/:id',
    name: 'mahasiswa.edit',
    component: () => import('../views/Admin/MahasiswaEdit.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/mahasiswa.tambah',
    name: 'mahasiswa.tambah',
    component: () => import('../views/Admin/MahasiswaTambah.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/buku',
    name: 'buku',
    component: () => import('../views/Admin/Buku.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/buku.detail/:id',
    name: 'buku.detail',
    component: () => import('../views/Admin/BukuDetail.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/buku.edit/:id',
    name: 'buku.edit',
    component: () => import('../views/Admin/BukuEdit.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/buku.tambah',
    name: 'buku.tambah',
    component: () => import('../views/Admin/BukuTambah.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/transaksi',
    name: 'transaksi',
    component: () => import('../views/Admin/Transaksi.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/transaksi.tambah',
    name: 'transaksi.tambah',
    component: () => import('../views/Admin/TransaksiTambah.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/transaksi.detail/:id',
    name: 'transaksi.detail',
    component: () => import('../views/Admin/TransaksiDetail.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/transaksi.collapse',
    name: 'transaksi.collapse',
    component: () => import('../views/Admin/TransaksiCollapse.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/transaksi.collapse.detail/:id',
    name: 'transaksi.collapse.detail',
    component: () => import('../views/Admin/TransaksiCollapseDetail.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/laporan.harian',
    name: 'laporan.harian',
    component: () => import('../views/Admin/LaporanHarian.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/laporan.bulanan',
    name: 'laporan.bulanan',
    component: () => import('../views/Admin/LaporanBulanan.vue'),
    meta: { auth:true },
    beforeEnter: () => {
      if(store.getters['auth/user'].role === 'user'){
        router.replace('/')
      }
    }
  },
  {
    path: '/profilDanPassword',
    name: 'profilDanPassword',
    component: () => import('../views/User/ProfilDanPassword.vue'),
    meta: { auth:true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'bg-primary gradient text-white rounded-pill btn-primary'
})

router.beforeEach((to, from, next) => {
  if(to.meta.auth && !store.getters['auth/authenticated']){
    router.replace('/login')
  }
  if(to.meta.guest && store.getters['auth/authenticated']){
    router.replace('/')
  }

  next()
})

export default router
