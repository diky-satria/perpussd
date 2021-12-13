<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Edit Buku</div>
          </div>
          <div class="float-right tom">
            <router-link to="/buku" title="Kembali" class="btn btn-sm btn-dark"><i class="fas fa-arrow-left"></i></router-link>
          </div>
        </div>
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="editBuku">
            <div class="row">
              <div class="col-md-3">
                <div class="form-group">
                    <label>Kode</label>
                    <input type="text" v-model="form.kode" class="form-control" readonly>
                </div>
                <div class="form-group">
                    <label>Judul</label>
                    <input type="text" v-model="form.judul" class="form-control">
                    <span class="text-danger" v-if="errors['judul']">{{ errors['judul'][0] }}</span>
                </div>
                <div class="form-group">
                    <label>Pengarang</label>
                    <input type="text" v-model="form.pengarang" class="form-control">
                    <span class="text-danger" v-if="errors['pengarang']">{{ errors['pengarang'][0] }}</span>
                </div>
                <div class="form-group">
                    <label>Penerbit</label>
                    <input type="text" v-model="form.penerbit" class="form-control">
                    <span class="text-danger" v-if="errors['penerbit']">{{ errors['penerbit'][0] }}</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                    <label>Tahun</label>
                    <input type="text" v-model="form.tahun" class="form-control">
                    <span class="text-danger" v-if="errors['tahun']">{{ errors['tahun'][0] }}</span>
                </div>
                <div class="form-group">
                    <label>ISBN</label>
                    <input type="text" v-model="form.isbn" class="form-control">
                    <span class="text-danger" v-if="errors['isbn']">{{ errors['isbn'][0] }}</span>
                </div>
                <div class="form-group">
                    <label>Jumlah</label>
                    <input type="text" v-model="form.jumlah" class="form-control">
                    <span class="text-danger" v-if="errors['jumlah']">{{ errors['jumlah'][0] }}</span>
                </div>
                <div class="form-group">
                    <label>Lokasi</label>
                    <select class="form-control" v-model="form.lokasi_id">
                      <option v-for="lok in lokasis" :key="lok.id" :value="lok.id">{{ lok.nama }}</option>
                    </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Gambar</label>
                  <div class="d-flex">
                    <img class="mb-3 float-left mr-3" :src="'http://localhost:8000/storage/buku/' + form.gambar" style="width:48%;height:242px;">
                    <img v-if="fileURL" class="mb-3 float-left" accept="image/*" :src="fileURL" style="width:48%;height:242px;">
                  </div>
                  <div class="custom-file">
                    <input type="file" @change="ubahGambar" class="custom-file-input" id="customFile">
                    <label class="custom-file-label" for="customFile">Ganti gambar</label>
                  </div>
                  <span class="text-danger" v-if="errors['gambar']">{{ errors['gambar'][0] }}</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <button type="submit" class="btn btn-sm btn-primary float-right d-flex" id="btn-buku-edit">
                  <div>
                    Edit
                  </div>
                  <div>
                    <svg v-if="load" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgba(255, 255, 255, 0); display: block; shape-rendering: auto;" width="24px" height="22px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
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
import { useRoute } from 'vue-router'
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import router from '@/router'
import Swal from 'sweetalert2'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const par = useRoute()
    const form = ref([])
    const lokasis = ref([])
    const fileGambar = ref('')
    const fileURL = ref('')
    const errors = ref([])
    const load = ref(false)

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
      let response = await axios.get('api/buku/' + par.params.id)
      if(response.status === 200){
        form.value = response.data.data
        lokasis.value = response.data.lokasi
        loader.hide()
      }
    }

    //ubah gambar
    const ubahGambar = (e) => {
      if(e.target.files.length === 0){
        fileGambar.value = ''
        fileURL.value = ''
        return
      }
      fileGambar.value = e.target.files[0]
    }
    
    watch(fileGambar, (fileGambar) => {
      if(!(fileGambar instanceof File)){
        return
      }
      const fileReader = new FileReader()

      fileReader.readAsDataURL(fileGambar)

      fileReader.addEventListener("load", () => {
        fileURL.value = fileReader.result
      })
    })

    const editBuku = async () => {
      let btn = document.getElementById('btn-buku-edit')
      try{
        btn.setAttribute('disabled', true)
        load.value = true
        const data = new FormData()
        data.append('judul', form.value.judul)
        data.append('pengarang', form.value.pengarang)
        data.append('penerbit', form.value.penerbit)
        data.append('tahun', form.value.tahun)
        data.append('isbn', form.value.isbn)
        data.append('jumlah', form.value.jumlah)
        data.append('lokasi_id', form.value.lokasi_id)
        data.append('gambar', fileGambar.value)
        let response = await axios.post('api/buku/' + par.params.id, data)
        if(response.status === 200){
          load.value = false
          btn.removeAttribute('disabled', false)
          router.replace('/buku')
          setTimeout(() => {
            Toast.fire({
              icon: 'success',
              title: 'Buku berhasil diedit'
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
      // getLokasi()
    })

    return {
      par,
      getDetail,
      form,
      lokasis,
      // getLokasi,
      ubahGambar,
      fileGambar,
      fileURL,
      editBuku,
      errors,
      load
    }
  }
}
</script>