<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <div class="d-flex justify-content-between">
            <div>
              <div class="tombol-modify">Data Admin</div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <table id="example" class="table table-striped table-sm" style="width:100%">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(ad, index) in admin" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ ad.nama }}</td>
                    <td>{{ ad.email }}</td>
                    <td>
                      <button @click="hapusAdmin(index, ad.id, ad.nama)" class="btn btn-sm btn-danger" title="Hapus"><i class="fas fa-trash-alt"></i></button>
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
              <div class="tombol-modify">Tambah Admin</div>
            </div>
            <div class="float-right tom">
              <div></div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="tambahAdmin">
                <div class="form-group">
                  <label>Nama</label>
                  <input type="text" v-model="form.nama" class="form-control">
                  <span class="text-danger" v-if="errors['nama']">{{ errors['nama'][0] }}</span>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="text" v-model="form.email" class="form-control">
                  <span class="text-danger" v-if="errors['email']">{{ errors['email'][0] }}</span>
                </div>
                <button type="submit" class="btn btn-sm btn-primary float-right d-flex" id="btn-add-admin">
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
import axios from 'axios'
import { reactive, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import $ from 'jquery'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const admin = ref([])
    const form = reactive({
      nama: '',
      email: ''
    })
    const load = ref(false)
    const errors = ref([])

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
        $('#example').DataTable()
      });
    }

    const getAdmin = async () => {
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
      let response = await axios.get('api/admin')
      if(response.status === 200){
        admin.value = response.data.user
        datatable()
        loader.hide()
      }
    }

    const tambahAdmin = async () => {
      let btn = document.getElementById('btn-add-admin')
      try{
        btn.setAttribute('disabled', true)
        load.value = true
        let response = await axios.post('api/admin', form)
        if(response.status === 200){
          $('#example').DataTable().destroy()
          admin.value.unshift(response.data.user)
          datatable()
          btn.removeAttribute('disabled', false)
          form.nama = ''
          form.email = ''
          load.value = false
          Toast.fire({
            icon: 'success',
            title: 'Admin berhasil ditambahkan'
          })
        }
      }catch(e){
        load.value = true
        errors.value = e.response.data.errors
        load.value = false
        btn.removeAttribute('disabled', false)
      }
    }

    const hapusAdmin = (index, id, nama) => {
      Swal.fire({
        title: 'Apa kamu yakin ?',
        text: 'ingin menghapus "'+ nama + '"?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Kembali'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete('api/admin/' + id)
          $('#example').DataTable().destroy()
          admin.value.splice(index, 1)
          datatable()
          Toast.fire({
            icon: 'success',
            title: 'Admin berhasil dihapus'
          })
        }
      })
    }

    onMounted(() => {
      getAdmin()
    })

    return {
      form,
      admin,
      getAdmin,
      tambahAdmin,
      load,
      datatable,
      errors,
      hapusAdmin
    }
  }
}
</script>