<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Data Buku</div>
          </div>
          <div class="float-right tom">
            <router-link to="/admin" title="Kembali" class="btn btn-sm btn-dark"><i class="fas fa-arrow-left"></i></router-link>
            <router-link to="/buku.tambah" title="Tambah" class="btn btn-sm btn-primary ml-1"><i class="fas fa-plus"></i></router-link>
          </div>
        </div>
      <div class="card">
        <div class="card-body">
          <table id="example" class="table table-striped table-sm" style="width:100%">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Judul</th>
                <th>Jumlah</th>
                <th>Gambar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(buk, index) in bukus" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ buk.kode }}</td>
                <td>{{ buk.judul }}</td>
                <td>{{ buk.jumlah }}</td>
                <td><img :src="'http://localhost:8000/storage/buku/' + buk.gambar" style="width:100px;height:50px;border-radius:5px;box-shadow:1px 1px 3px gray;"></td>
                <td class="d-flex">
                  <router-link :to="{ name: 'buku.detail', params:{id:buk.id} }" class="btn btn-sm btn-info" title="Lihat"><i class="fas fa-eye"></i></router-link>
                  <router-link :to="{ name: 'buku.edit', params:{id:buk.id} }" class="btn btn-sm btn-success mar" title="Edit"><i class="fas fa-user-edit"></i></router-link>
                  <button @click="hapusBuku(index, buk.id, buk.judul)" class="btn btn-sm btn-danger" title="Hapus"><i class="fas fa-trash-alt"></i></button>
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
import axios from 'axios'
import { ref, onMounted } from 'vue'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const bukus = ref([])

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

    const getBuku = async () => {
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
      let response = await axios.get('api/buku')
      if(response.status === 200){
        bukus.value = response.data.data
        datatable()
        loader.hide()
      }
    }

    const hapusBuku = (index, id, judul) => {
      Swal.fire({
        title: 'Apa kamu yakin ?',
        text: 'ingin menghapus buku "'+ judul + '"?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Kembali'
      }).then((result) => {
        if (result.isConfirmed) {
          
          axios.delete('api/buku/' + id)
          $('#example').DataTable().destroy()
          bukus.value.splice(index, 1)
          datatable()

          Toast.fire({
            icon: 'success',
            title: 'Buku berhasil dihapus'
          })
        }
      })
    }

    onMounted(() => {
      getBuku()
    })

    return {
      getBuku,
      bukus,
      datatable,
      hapusBuku
    }
  }
}
</script>