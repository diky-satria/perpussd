<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Data Siswa / i</div>
          </div>
          <div class="float-right tom">
            <router-link to="/admin" title="Kembali" class="btn btn-sm btn-dark"><i class="fas fa-arrow-left"></i></router-link>
            <router-link to="/mahasiswa.tambah" title="Tambah" class="btn btn-sm btn-primary ml-1"><i class="fas fa-plus"></i></router-link>
          </div>
        </div>
      <div class="card">
        <div class="card-body">
          <table id="example" class="table table-striped table-sm" style="width:100%">
            <thead>
              <tr>
                <th>No</th>
                <th>NIS</th>
                <th>Nama</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mah, index) in mahasiswas" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ mah.nis }}</td>
                <td>{{ mah.nama }}</td>
                <td>
                  <router-link :to="{ name: 'mahasiswa.detail', params:{id:mah.id} }" class="btn btn-sm btn-info" title="Lihat"><i class="fas fa-eye"></i></router-link>
                  <router-link :to="{ name: 'mahasiswa.edit', params:{id:mah.id} }" class="btn btn-sm btn-success mar" title="Edit"><i class="fas fa-user-edit"></i></router-link>
                  <button @click="hapusMahasiswa(index, mah.id, mah.nama)" class="btn btn-sm btn-danger" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import $ from 'jquery'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const mahasiswas = ref([])

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

    const getMahasiswa = async () => {
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
      let response = await axios.get('api/mahasiswa')
      if(response.status === 200){
        mahasiswas.value = response.data.data
        datatable()
        loader.hide()
      }
    }

    const hapusMahasiswa = (index, id, nama) => {
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
          
          axios.delete('api/mahasiswa/' + id)
          $('#example').DataTable().destroy()
          mahasiswas.value.splice(index, 1)
          datatable()

          Toast.fire({
            icon: 'success',
            title: 'Siswa / i berhasil dihapus'
          })
        }
      })
    }

    onMounted(() => {
      getMahasiswa()
    })
    
    return {
      mahasiswas,
      getMahasiswa,
      datatable,
      hapusMahasiswa
    }
  }
}
</script>