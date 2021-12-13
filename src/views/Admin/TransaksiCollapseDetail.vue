<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Transaksi Collapse Detail</div>
          </div>
          <div class="float-right tom">
            <router-link to="/transaksi.collapse" title="Kembali" class="btn btn-sm btn-dark ml-1"><i class="fas fa-arrow-left"></i></router-link>
          </div>
        </div>
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <table class="table-sm">
                <tr>
                  <td>Kode Transaksi</td>
                  <td>:</td>
                  <td>{{ transaksi.kode }}</td>
                </tr>
                <tr>
                  <td>Tgl Peminjaman</td>
                  <td>:</td>
                  <td>{{ transaksi.tgl_peminjaman }}</td>
                </tr>
                <tr>
                  <td>Tgl Pengembalian</td>
                  <td>:</td>
                  <td>{{ transaksi.tgl_pengembalian }}</td>
                </tr>
                <tr>
                  <td>Petugas</td>
                  <td>:</td>
                  <td>{{ transaksi.petugas }}</td>
                </tr>
              </table>
            </div>
            <div class="col-md-8">
              <table id="example" class="table table-sm" style="width:100%">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Buku</th>
                    <th>Judul</th>
                    <th>Lokasi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="detail.length > 0">
                    <tr v-for="(det, index) in detail" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td>{{ det.kode_buku }}</td>
                      <td>{{ det.judul }}</td>
                      <td>{{ det.lokasi }}</td>
                      <td>
                        <button @click="kembalikan(transaksi.id, det.id, det.buku_id, index)" class="btn btn-sm btn-danger mar" title="Kembalikan"><i class="fas fa-arrow-left"></i></button>
                      </td>
                    </tr>
                  </template>
                  <template v-else:>
                    <tr class="text-center text-danger">
                      <td colspan="5"><div class="mt-4">Detail Collapse kosong, silahkan kembali dan hapus transaksi dengan kode <b>{{ transaksi.kode }}</b></div></td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const transaksi = ref([])
    const detail = ref([])
    const par = useRoute()

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

    const getTransDet = async () => {
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
      let response = await axios.get('api/collapseDetail/' + par.params.id)
      if(response.status === 200){
        transaksi.value = response.data.transaksi
        detail.value = response.data.detail
        loader.hide()
      }
    }

    const kembalikan = async (transaksi_id, detail_id, buku_id, index) => {
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
      let response = await axios.delete('api/collapse/' + transaksi_id + '/' + detail_id + '/' + buku_id)
      if(response.status === 200){
        detail.value.splice(index, 1)
        loader.hide()
        setTimeout(() => {
          Toast.fire({
            icon: 'success',
            title: 'Buku berhasil dikembalikan ke tempat semula'
          })
        }, 1000)
      }
    }

    onMounted(() => {
      getTransDet()
    })

    return {
      transaksi,
      detail,
      getTransDet,
      kembalikan,
      Toast
    }
  }
}
</script>