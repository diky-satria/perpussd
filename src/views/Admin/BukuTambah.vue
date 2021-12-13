<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Tambah Buku</div>
          </div>
          <div class="float-right tom">
            <router-link to="/buku" title="Kembali" class="btn btn-sm btn-dark"><i class="fas fa-arrow-left"></i></router-link>
          </div>
        </div>
      <div class="card">
        <div class="card-body">
            <form @submit.prevent="tambahBuku">
              <div class="row">
                <div class="col-md">
                  <div class="form-group">
                      <label>Kode</label>
                      <input type="text" v-model="form.kode" class="form-control">
                      <span class="text-danger" v-if="errors['kode']">{{ errors['kode'][0] }}</span>
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
                <div class="col-md">
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
                      <span class="text-danger" v-if="errors['lokasi_id']">{{ errors['lokasi_id'][0] }}</span>
                  </div>
                </div>
                <div class="col-md">
									<div class="form-group">
										<label>Gambar</label>
                    <div class="d-flex flex-column">
                      <img :src="fileURL" v-show="fileURL" class="mb-3" style="width:100%;height:242px;">
                      <div class="custom-file">
                        <input type="file" accept="image/*" @change="ubahGambar" class="custom-file-input" id="customFile">
                        <label class="custom-file-label" for="customFile">Pilih gambar</label>
                      </div>
                    </div>
                    <span class="text-danger" v-if="errors['gambar']">{{ errors['gambar'][0] }}</span>
									</div>
                </div>
              </div>
							<div class="row">
								<div class="col">
									<button type="submit" class="btn btn-sm btn-primary float-right d-flex" id="btn-buku">
										<div>
											Tambah
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
import { ref, onMounted, reactive, watch } from 'vue'
import axios from 'axios'
import router from '@/router'
import Swal from 'sweetalert2'
export default {
  setup(){
    const lokasis = ref([])
    const form = reactive({
      kode: '',
      judul: '',
      pengarang: '',
      penerbit: '',
      tahun: '',
      isbn: '',
      jumlah: '',
      lokasi_id: '',
      gambar: ''
    })
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

    const getLokasi = async () => {
      let response = await axios.get('api/lokasi')
      if(response.status === 200){
        lokasis.value = response.data
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

    const tambahBuku = async () => {
      let btn = document.getElementById('btn-buku')
      try{
        btn.setAttribute('disabled', true)
        load.value = true
        const data = new FormData()
        data.append('kode', form.kode)
        data.append('judul', form.judul)
        data.append('pengarang', form.pengarang)
        data.append('penerbit', form.penerbit)
        data.append('tahun', form.tahun)
        data.append('isbn', form.isbn)
        data.append('jumlah', form.jumlah)
        data.append('lokasi_id', form.lokasi_id)
        data.append('gambar', fileGambar.value)
  
        let response = await axios.post('api/buku', data)
        if(response.status === 200){
          load.value = false
          btn.removeAttribute('disabled', false)
          router.replace('/buku')
          setTimeout(() => {
            Toast.fire({
              icon: 'success',
              title: 'Buku berhasil ditambahkan'
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
      getLokasi()
    })

    return {
      lokasis,
      getLokasi,
      form,
      tambahBuku,
      ubahGambar,
      fileGambar,
      fileURL,
      errors,
      load,
      Toast
    }
  }
}
</script>