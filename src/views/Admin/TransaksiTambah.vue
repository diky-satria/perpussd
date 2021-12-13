<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Transaksi Peminjaman</div>
          </div>
          <div class="float-right tom">
              <router-link to="/transaksi" title="Kembali" class="btn btn-sm btn-dark"><i class="fas fa-arrow-left"></i></router-link>
          </div>
        </div>
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="tambahTransaksi">
            <div class="row">
              <div class="col-md">
                <div class="form-group">
                  <label>Kode Peminjaman</label>
                  <input type="text" v-model="kode" class="form-control" readonly>
                  <span class="text-danger" v-if="errors['kode']">{{ errors['kode'][0] }}</span>
                </div>
              </div>
              <div class="col-md">
                <div class="form-group">
                  <label>Tanggal Peminjaman</label>
                  <input type="text" v-model="tgl_peminjaman" class="form-control" readonly>
                  <span class="text-danger" v-if="errors['tgl_peminjaman']">{{ errors['tgl_peminjaman'][0] }}</span>
                </div>
              </div>
              <div class="col-md">
                <div class="form-group">
                  <label>Tanggal Pengembalian</label>
                  <input type="text" v-model="tgl_pengembalian" class="form-control" readonly>
                  <span class="text-danger" v-if="errors['tgl_pengembalian']">{{ errors['tgl_pengembalian'][0] }}</span>
                </div>
              </div>
              <div class="col-md">
                <div class="form-group">
                  <label>Buku</label>
                  <select class="form-control" v-model="form.buku_id" @change="sel">
                    <option v-for="buk in bukus" id="buku" :key="buk.id" :value="buk.id">{{ buk.judul }}</option>
                  </select>
                  <span class="text-danger" v-if="errors['buku_id']">{{ errors['buku_id'][0] }}</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <button type="submit" class="btn btn-sm btn-primary float-right d-flex" id="tam-btn">
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
      <div class="card" style="margin-top:40px;">
        <div class="card-body tog" v-if="count > 0">
          <div class="row">
            <div class="col-md">
              <table id="example" class="table table-sm" style="width:100%">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Buku</th>
                    <th>Judul</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(lihat, index) in lihatBuku" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ lihat.kode_buku }}</td>
                    <td>{{ lihat.judul }}</td>
                    <td>
                      <button @click="hapus(lihat.id, kode, lihat.kode_buku, index)" class="btn btn-sm btn-danger" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="row">
            <div class="col-md"></div>
            <div class="col-md"></div>
            <div class="col-md"></div>
            <div class="col-md">
              <form @submit.prevent="update">
                <div class="form-group">
                  <label>Siswa/i</label>
                  <select class="form-control" v-model="input.mahasiswa_id">
                    <option v-for="mah in mahasiswas" :key="mah.id" :value="mah.id">{{ mah.nama }}</option>
                  </select>
                  <span class="text-danger" v-if="invalid['mahasiswa_id']">{{ invalid['mahasiswa_id'][0] }}</span>
                </div>
                <button type="submit" class="btn btn-sm btn-primary btn-block float-right d-flex justify-content-center" id="btn-tam-trans">
                  <div>
                    Lanjutkan
                  </div>
                  <div>
                    <svg v-if="reload" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgba(255, 255, 255, 0); display: block; shape-rendering: auto;" width="24px" height="22px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
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
        <div v-else: class="text-center text-danger mb-2">*Anda belum memilih buku untuk dipinjam !</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import router from '@/router'
// import $ from 'jquery'
import Swal from 'sweetalert2'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const kode = ref()
    const tgl_peminjaman = ref()
    const tgl_pengembalian = ref()
    const bukus = ref([])
    const mahasiswas = ref([])
    const form = reactive({
      buku_id: ''
    })
    const errors = ref([])
    const load = ref(false) 
    const lihatBuku = ref([])
    const count = ref()
    const input = reactive({
      mahasiswa_id: '',
    })
    const invalid = ref([])
    const reload = ref(false)

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

    // select2
    // const select = () => {
    //   $(document).ready(function() {
    //       $('#buku').select2();
    //   });
    // } 

    const getData = async () => {
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
      let response = await axios.get('api/get')
      if(response.status === 200){
        kode.value = response.data.kode
        tgl_peminjaman.value = response.data.tgl_peminjaman
        tgl_pengembalian.value = response.data.tgl_pengembalian
        mahasiswas.value = response.data.mahasiswa
        loader.hide()
      }
    }

    const getBukuSelect = async () => {
      let response = await axios.get('api/getBuku')
      if(response.status === 200){
        bukus.value = response.data.data
      }
    }

    const getBuku = async () => {
      let response = await axios.get('api/transaksi/' + kode.value + '/getTrans')
      if(response.status === 200){
        lihatBuku.value = response.data.peminjaman
        count.value = response.data.count
      }
    }

    const sel = () => {
      let tam = document.getElementById('tam-btn');
      tam.removeAttribute('disabled', false)
    }

    const tambahTransaksi = async () => {
      let loader = useLoading();
      try{
        if(lihatBuku.value !== null){
          loader.show({
            color: '#FFFFFF',
            isFullPage: 'true',
            backgroundColor: '#4B4B4B',
            loader: 'spinner',
            zIndex: 9999,
            width: 45,
            height: 45
          })
        }
        load.value = true
        let data = new FormData()
        data.append('kode', kode.value)
        data.append('tgl_peminjaman', tgl_peminjaman.value)
        data.append('tgl_pengembalian', tgl_pengembalian.value)
        data.append('buku_id', form.buku_id)
        let response = await axios.post('api/transaksi/' + kode.value , data)
        if(response.status === 200){

          let tam = document.getElementById('tam-btn');
          tam.setAttribute('disabled', true)

          errors.value = ''
          getBukuSelect()
          getBuku()
          load.value = false
          if(lihatBuku.value !== null){
            loader.hide()
          }
          setTimeout(() => {
            Toast.fire({
              icon: 'success',
              title: 'Buku berhasil ditambahkan'
            })
          }, 1000)
        }
      }catch(e){
        load.value = true
        errors.value = e.response.data.errors
        load.value = false
        loader.hide()
      }
    }

    const hapus = async (id, kode, kodeBuku, index) => {
      let loader = useLoading();
        if(lihatBuku.value !== null){
          loader.show({
            color: '#FFFFFF',
            isFullPage: 'true',
            backgroundColor: '#4B4B4B',
            loader: 'spinner',
            zIndex: 9999,
            width: 45,
            height: 45
          })
        }
      let response = await axios.delete('api/transaksi/' + kode + '/' + id + '/' + kodeBuku)
      if(response.status === 200){
        lihatBuku.value.splice(index, 1)
        count.value = count.value - 1
        getBukuSelect()
        if(lihatBuku.value !== null){
          loader.hide()
        }

        Toast.fire({
          icon: 'success',
          title: 'Buku berhasil dihapus',
          timer: 1000
        })
      }
    }

    const update = async () => {
      let btn = document.getElementById('btn-tam-trans')
      try{  
        btn.setAttribute('disabled', true)
        reload.value = true
        let response = await axios.patch('api/transaksi/' + kode.value + '/update' , input)
        if(response.status === 200){
          reload.value = false
          btn.removeAttribute('disabled', false)
          router.replace('/transaksi')
          setTimeout(() => {
            Toast.fire({
              icon: 'success',
              title: 'Transaksi berhasil ditambahkan'
            })
          }, 3000)
        }
      }catch(e){
        reload.value = true
        invalid.value = e.response.data.errors
        reload.value = false
        btn.removeAttribute('disabled', false)
      }
    }

    onMounted(() => {
      getData()
      getBuku()
      getBukuSelect()
      // select()
    })
    
    return {
      kode,
      tgl_peminjaman,
      tgl_pengembalian,
      bukus,
      mahasiswas,
      getData,
      tambahTransaksi,
      form,
      errors,
      load,
      getBukuSelect,
      getBuku,
      lihatBuku,
      hapus,
      count,
      update,
      input,
      invalid,
      reload,
      // select,
      sel
    }
  }
}
</script>