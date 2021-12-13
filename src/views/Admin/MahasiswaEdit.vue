<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Edit Mahasiswa</div>
          </div>
          <div class="float-right tom">
            <router-link to="/mahasiswa" title="Kembali" class="btn btn-sm btn-dark"><i class="fas fa-arrow-left"></i></router-link>
          </div>
        </div>
      <div class="card">
        <div class="card-body">
            <form @submit.prevent="editMahasiswa">
              <div class="row">
                <div class="col-md">
                  <div class="form-group">
                      <label>NIS</label>
                      <input type="text" v-model="form.nis" class="form-control" readonly>
                  </div>
                  <div class="form-group">
                      <label>Nama</label>
                      <input type="text" v-model="form.nama" class="form-control">
                      <span class="text-danger" v-if="errors['nama']">{{ errors['nama'][0] }}</span>
                  </div>
                  <div class="form-group">
                      <label>Kelas</label>
                      <select v-model="form.kelas_id" class="form-control">
                        <option v-for="kel in kelases" :key="kel.id" :value="kel.id">{{ kel.kelas }}</option>
                      </select>
                  </div>
                </div>
                <div class="col-md">
                  <div class="form-group">
                    <label>Telepon</label>
                    <input type="text" v-model="form.telepon" class="form-control">
                  </div>
                  <div class="form-group">
                    <label>Alamat</label>
                    <textarea class="form-control" rows="5" v-model="form.alamat"></textarea>
                  </div>
                  <button type="submit" class="btn btn-sm btn-primary float-right d-flex" id="btn-mhs-edit">
                    <div>
                      Edit
                    </div>
                    <div>
                      <svg v-if="load === true" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgba(255, 255, 255, 0); display: block; shape-rendering: auto;" width="24px" height="22px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <g>
                          <path d="M50 15A35 35 0 1 0 74.74873734152916 25.251262658470843" fill="none" stroke="#ffffff" stroke-width="12"></path>
                          <path d="M49 3L49 27L61 15L49 3" fill="#ffffff"></path>
                          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
                        </g>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const kelases = ref([])
    const form = reactive({
      nim: '',
      nama: '',
      kelas_id: '',
      telepon: '',
      alamat: ''
    })
    const errors = ref([])
    const load = ref(false)
    const par = useRoute()

    //sweetalert
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    const getDetail = async () => {
        let loader = useLoading();
        loader.show({
          color: '#FFFFFF',
          isFullPage: 'true',
          backgroundColor: '#4B4B4B',
          loader: 'spinner',
          zIndex: 9999,
          width: 45,
          height: 45
        })
        let response = await axios.get('api/mahasiswa/' + par.params.id)
        if(response.status === 200){
            form.nis = response.data.data.nis
            form.nama = response.data.data.nama
            form.kelas_id = response.data.data.kelas_id
            form.telepon = response.data.data.telepon
            kelases.value = response.data.kelas
            form.alamat = response.data.data.alamat
            loader.hide()
        }
    }

    const editMahasiswa = async () => {
      let btn = document.getElementById('btn-mhs-edit')
      try{
        btn.setAttribute('disabled', true)
        load.value = true
        let response = await axios.patch('api/mahasiswa/' + par.params.id, form)
        if(response.status === 200){
          load.value = false
          btn.removeAttribute('disabled', false)
          router.replace('/mahasiswa')
          setTimeout(() => {
            Toast.fire({
              icon: 'success',
              title: 'Siswa / i berhasil diedit'
            })
          }, 1500)
        }
      }catch(e){
        load.value = true
        errors.value = e.response.data.errors
        load.value = false
        btn.removeAttribute('disabled', false)
      }
    }

    onMounted(() => {
      getDetail()
    })

    return {
      kelases,
      form,
      editMahasiswa,
      errors,
      load,
      par,
      getDetail
    }
  }
}
</script>