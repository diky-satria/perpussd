<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Tambah Siswa / i</div>
          </div>
          <div class="float-right tom">
            <router-link to="/mahasiswa" title="Kembali" class="btn btn-sm btn-dark"><i class="fas fa-arrow-left"></i></router-link>
          </div>
        </div>
      <div class="card">
        <div class="card-body">
            <form @submit.prevent="addMahasiswa" enctype="multipart/form-data">
              <div class="row">
                <div class="col-md">
                  <div class="form-group">
                      <label>NIS <span class="text-danger">*</span></label>
                      <input type="text" v-model="form.nis" class="form-control">
                      <span class="text-danger" v-if="errors['nis']">{{ errors['nis'][0] }}</span>
                  </div>
                  <div class="form-group">
                      <label>Nama <span class="text-danger">*</span></label>
                      <input type="text" v-model="form.nama" class="form-control">
                      <span class="text-danger" v-if="errors['nama']">{{ errors['nama'][0] }}</span>
                  </div>
                  <div class="form-group">
                      <label>Kelas <span class="text-danger">*</span></label>
                      <select v-model="form.kelas_id" class="form-control">
                        <option v-for="kel in kelases" :key="kel.id" :value="kel.id">{{ kel.kelas }}</option>
                      </select>
                      <span class="text-danger" v-if="errors['kelas_id']">{{ errors['kelas_id'][0] }}</span>
                  </div>
                </div>
                <div class="col-md">
                  <div class="form-group">
                    <label>Telepon</label>
                    <input type="text" v-model="form.telepon" class="form-control">
                  </div>
                  <div class="form-group">
                    <label>Alamat</label>
                    <textarea class="form-control" v-model="form.alamat" rows="5"></textarea>
                  </div>
                  <button type="submit" class="btn btn-sm btn-primary float-right d-flex" id="btn-mhs">
                    <div>
                      Tambah
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
export default {
  setup(){
    const kelases = ref([])
    const form = reactive({
      nis: '',
      nama: '',
      kelas_id: '',
      telepon: '',
      alamat: ''
      // gambar: ''
    })
    const errors = ref([])
    const load = ref(false)

    // const fileGambar = ref()

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

    const getKelas = async () => {
      let response = await axios.get('api/kelas')
      if(response.status === 200){
        kelases.value = response.data
      }
    }

    // const ubahGambar = (e) => {
    //   if(e.target.files.length === 0){
    //     fileGambar.value = ''
    //     // fileURL.value = ''
    //     return
    //   }
    //   fileGambar.value = e.target.files[0]
    // }

    const addMahasiswa = async () => {
      let btn = document.getElementById('btn-mhs')
      try{
        btn.setAttribute('disabled', true)
        load.value = true
        // const data = new FormData()
        // data.append('nim', form.nim)
        // data.append('nama', form.nama)
        // data.append('email', form.email)
        // data.append('jurusan_id', form.jurusan_id)
        // data.append('semester_id', form.semester_id)
        // data.append('kelas_id', form.kelas_id)
        // data.append('gambar', fileGambar.value)
        let response = await axios.post('api/mahasiswa', form)
        if(response.status === 200){
          load.value = false
          btn.removeAttribute('disabled', false)
          router.replace('/mahasiswa')
          setTimeout(() => {
            Toast.fire({
              icon: 'success',
              title: 'Siswa / i berhasil ditambahkan'
            })
          }, 2000)
        }
      }catch(e){
        load.value = true
        errors.value = e.response.data.errors
        load.value = false
        btn.removeAttribute('disabled', false)
      }
    }

    onMounted(() => {
      getKelas()
    })

    return {
      kelases,
      getKelas,
      form,
      addMahasiswa,
      errors,
      load,
      // ubahGambar
    }
  }
}
</script>