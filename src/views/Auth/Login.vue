<template>
  <div class="login">
    <div class="container">
      <div class="row mt-3">
        <div class="col-lg-6 kiri">
          <img src="../../assets/login.png">
        </div>
        <div class="col-lg-6 login-background">
          <div class="card">
            <div class="card-body">
              <h3 class="judul">Login</h3>
              <form @submit.prevent="login">
                <div class="alert alert-danger alert-login" v-if="errors['invalid']">{{ errors['invalid'][0] }}</div>
                <div class="form-group">
                  <input type="text" v-model="form.email" class="form-control form-edit" placeholder="Email...">
                  <span class="text-danger val" v-if="errors['email']">{{ errors['email'][0] }}</span>
                </div>
                <div class="form-group">
                  <input type="password" v-model="form.password" class="form-control form-edit" placeholder="Password">
                  <span class="text-danger val" v-if="errors['password']">{{ errors['password'][0] }}</span>
                </div>
                <button type="submit" class="btn btn-login btn-block btn-sm btn-primary d-flex justify-content-center" id="btn-login">
                  <div>
                    Login
                  </div>
                  <div>
                    <svg v-if="load" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgba(255, 255, 255, 0); display: block; shape-rendering: auto;" width="24px" height="24px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                      <g>
                        <path d="M50 15A35 35 0 1 0 74.74873734152916 25.251262658470843" fill="none" stroke="#ffffff" stroke-width="12"></path>
                        <path d="M49 3L49 27L61 15L49 3" fill="#ffffff"></path>
                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
                      </g>
                    </svg>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import store from '@/store'
export default {
  setup(){
    const load = ref(false)

    const errors = ref([])

    const form = reactive({
      email: '',
      password: ''
    })

    const login = async () => {
      let btn = document.getElementById('btn-login')
      try{
        btn.setAttribute('disabled', true)
        load.value = true
        await store.dispatch('auth/login', form)
        setTimeout(() => {
          load.value = false
          form.email = ''
          form.password = ''
          btn.removeAttribute('disabled', false)
        }, 3000)
      }catch(e){
        load.value = true
        errors.value = e.response.data.errors
        load.value = false
        btn.removeAttribute('disabled', false)
      }
    }

    return {
      login,
      form,
      errors,
      load
    }
  }
}
</script>