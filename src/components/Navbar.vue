<template>
  <div>
      <nav class="navbar navbar-expand-lg navbar-fixed fixed-top">
        <div class="container bar">
          <router-link to="/" class="navbar-brand" exact-active-class="bg-transparent">E-PUSTAKA</router-link>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <div></div>
            <div class="my-1"></div>
            <div></div>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav d-flex justify-content-between" style="width:100%;">
              <div class="link-content">
                <div v-if="authenticated && user.role === 'super admin'">
                  <router-link to="/super-admin" class="nav-link">Super admin</router-link>
                </div>
                <div v-if="authenticated && user.role !== 'user'" class="link-admin">
                  <router-link to="/admin" class="nav-link">Dashboard</router-link>
                  <router-link to="/transaksi" class="nav-link">Transaksi</router-link>
                </div>
                <div v-if="authenticated && user.role === 'user'">
                  <router-link to="/user" class="nav-link">Peminjaman</router-link>
                </div>
              </div>
              <div>
                <template v-if="authenticated">
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Halo, {{ user.nama }}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <router-link to="profilDanPassword" class="dropdown-item">Profil & Password</router-link>
                      <button @click="logout" class="dropdown-item">Logout</button>
                    </div>
                  </li>
                </template>
                <template v-else:>
                  <router-link to="/login" class="nav-link tombol">Login</router-link>
                </template>
              </div>
            </div>
          </div>
        </div>
      </nav>
  </div>
</template>

<script>
import store from '@/store'
import { computed } from 'vue'
import router from '@/router'
export default {
  setup(){
    const authenticated = computed(() => store.getters["auth/authenticated"])
    const user = computed(() => store.getters["auth/user"])

    const logout = async () => {
        await store.dispatch('auth/logout')
        router.replace('/login')
    }

    return {
      authenticated,
      user,
      logout
    }
  }
}
</script>