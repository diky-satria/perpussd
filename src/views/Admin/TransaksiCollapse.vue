<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div>
          <div class="tombol-modify">Transaksi Collapse</div>
        </div>
        <div class="float-right tom">
          <router-link to="/admin" title="Kembali" class="btn btn-sm btn-dark ml-1"><i class="fas fa-arrow-left"></i></router-link>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <table id="example" class="table table-striped table-sm" style="width:100%">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode Transaksi</th>
                <th>Petugas</th>
                <th>Jumlah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tran, index) in transaksis" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ tran.kode }}</td>
                <td>{{ tran.petugas }}</td>
                <td>{{ tran.jumlah }}</td>
                <td class="d-flex">
                  <div>
                    <button v-if="tran.jumlah < 1" class="btn btn-sm btn-info" title="Silahkan hapus transaksi ini" disabled><i class="fas fa-eye"></i></button>
                    <router-link v-else: :to="{ name: 'transaksi.collapse.detail', params:{id:tran.id} }" class="btn btn-sm btn-info" title="Lihat"><i class="fas fa-eye"></i></router-link>
                  </div>
                  <div>
                    <button v-if="tran.jumlah > 0" class="btn btn-sm btn-danger ml-1" title="Kembalikan buku di transaksi ini terlebih dahulu" disabled><i class="fas fa-trash-alt"></i></button>
                    <button v-else: @click="destroy(tran.id, index)" class="btn btn-sm btn-danger ml-1" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                  </div>
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
import $ from 'jquery'
import Swal from 'sweetalert2'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const transaksis = ref([])

    //datatable
    const datatable = () => {
      $(document).ready(function() {
        $('#example').DataTable();
      });
    }

    //sweetalert
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    const getTransaksi = async () => {
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
      let response = await axios.get('api/collapse')
      if(response.status === 200){
        transaksis.value = response.data.data
        datatable()
        loader.hide()
      }
    }

    const destroy = async (id, index) => {
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
      let response = await axios.delete('api/collapse/' + id + '/delete')
      if(response.status === 200){
        transaksis.value.splice(index, 1)
        $('#example').DataTable().destroy()
        datatable()
        loader.hide()
        Toast.fire({
          icon: 'success',
          title: 'Transaksi collapse berhasil dihapus'
        })
      }
    }

    onMounted(() => {
      getTransaksi()
    })

    return {
      transaksis,
      getTransaksi,
      datatable,
      destroy
    }
  }
}
</script>