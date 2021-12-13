<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <div class="d-flex justify-content-between">
            <div>
              <div class="tombol-modify">Data Jurusan</div>
            </div>
            <div class="float-right tom">
              <router-link to="/admin" title="Kembali" class="btn btn-sm btn-dark"><i class="fas fa-arrow-left"></i></router-link>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <table id="example" class="table table-striped table-sm" style="width:100%">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Jurusan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(jur, index) in jurusans" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ jur.nama_jurusan }}</td>
                    <td>
                      <button @click="hapusJurusan(jur.id, jur.nama_jurusan, index)" class="btn btn-sm btn-danger" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> 
          </div>
        </div>
        <div class="col-md-4 form-tambah-jurusan">
          <div class="d-flex justify-content-between">
            <div>
              <div class="tombol-modify">Tambah Jurusan</div>
            </div>
            <div class="float-right tom">
              <div></div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="tambahJurusan">
                <div class="form-group">
                  <label>Nama Jurusan</label>
                  <input type="text" v-model="form.nama_jurusan" class="form-control">
                  <span class="text-danger" v-if="errors['nama_jurusan']">{{ errors['nama_jurusan'][0] }}</span>
                </div>
                <button type="submit" class="btn btn-sm btn-primary float-right d-flex">
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import $ from 'jquery'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const jurusans = ref([])
    const form = reactive({
      nama_jurusan: ''
    })
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

    //datatable
    const datatable = () => {
      $(document).ready(function() {
        $('#example').DataTable();
      });
    }

    const getJurusan = async () => {
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
      let response = await axios.get('api/jurusan')
      if(response.status === 200){
        jurusans.value = response.data
        datatable()
        loader.hide()
      }
    }

    const tambahJurusan = async () => {
      try{
        load.value = true
        let response = await axios.post('api/jurusan', form)
        if(response.status === 200){
          form.nama_jurusan = ''
          $('#example').DataTable().destroy()
          jurusans.value.unshift(response.data.jurusan)
          datatable()
          load.value = false
          errors.value = ''
          Toast.fire({
            icon: 'success',
            title: 'Jurusan berhasil ditambahkan'
          })
        }
      }catch(e){
        load.value = true
        errors.value = e.response.data.errors
        load.value = false
      }
    }

    const hapusJurusan = (id, nama_jurusan, index) => {
      Swal.fire({
        title: 'Apa kamu yakin ?',
        text: 'ingin menghapus jurusan "'+ nama_jurusan + '"?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Kembali'
      }).then((result) => {
        if (result.isConfirmed) {

          axios.delete('api/jurusan/' + id)
          jurusans.value.splice(index, 1)
          $('#example').DataTable().destroy()
          datatable()

         Toast.fire({
            icon: 'success',
            title: 'Jurusan berhasil dihapus'
          })
        }
      })
    }

    onMounted(() => {
      getJurusan()
    })

    return {
      jurusans,
      getJurusan,
      form,
      tambahJurusan,
      hapusJurusan,
      errors,
      load,
      datatable
    }
  }
}
</script>