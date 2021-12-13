<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Data Transaksi</div>
          </div>
          <div class="float-right tom">
            <router-link to="/transaksi.tambah" title="Tambah" class="btn btn-sm btn-primary ml-1"><i class="fas fa-plus"></i></router-link>
          </div>
        </div>
      <div class="card">
        <div class="card-body">
          <table id="example" class="table table-striped table-sm" style="width:100%">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode Transaksi</th>
                <th>Nama</th>
                <th>Tgl Peminjaman</th>
                <th>Tgl Pengembalian</th>
                <th>Jumlah</th>
                <th>Terlambat | Denda</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(trans, index) in transaksis" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ trans.kode }}</td>
                <td>{{ trans.nama }}</td>
                <td>{{ trans.tgl_peminjaman }}</td>
                <td>{{ trans.tgl_pengembalian }}</td>
                <td>{{ trans.jumlah }}</td>
                <td>
                  <div v-if="denda(trans.tgl_pengembalian) > 0" style="color:red;font-weight:bold;">
                    <div class="float-left">{{ denda(trans.tgl_pengembalian) }} hari |</div> <FormatRupiah :angka="denda(trans.tgl_pengembalian) * 1000 * trans.jumlah" :prefix="'Rp. '" class="float-left ml-1"/>
                  </div>
                  <div v-else:>---</div>
                </td>
                <td class="d-flex">
                  <router-link :to="{ name: 'transaksi.detail', params:{id:trans.id} }" class="btn btn-sm btn-info" title="Lihat"><i class="fas fa-eye"></i></router-link>
                  <button @click="kembalikan(trans.kode, trans.id, index)" class="btn btn-sm btn-danger mar" title="Kembalikan"><i class="fas fa-arrow-left"></i></button>
                  <div>
                    <button v-if="denda(trans.tgl_pengembalian) > 0" class="btn btn-sm btn-success disabled-perpanjangan" style="cursor:default;" title="Tidak bisa melakukan perpanjangan" disabled><i class="fas fa-arrow-right"></i></button>
                    <button @click="perpanjang(trans.kode, trans.id)" v-else: class="btn btn-sm btn-success" title="Perpanjang"><i class="fas fa-arrow-right"></i></button>
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
import FormatRupiah from '@/components/FormatRupiah.vue'
import { useLoading } from 'vue3-loading-overlay'
export default {
  components: {
    FormatRupiah
  },
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
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    //cek terlambat dan denda
    const denda = (tgl_pengembalian) => {
      let tgl_sekarang = new Date().getTime()
      let tgl_kem = new Date(tgl_pengembalian).getTime()
      let kurang = tgl_sekarang - tgl_kem
      let bagi = Math.floor(kurang / (1000 * 60 * 60 * 24))
      if(bagi > 0){
        // return '<div class="color-danger">' + bagi + ' hari, Rp ' + bagi * 1000 + '</div>'
        return bagi
      }else{
        return '---'
      }
    }

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
      let response = await axios.get('api/transaksi')
      if(response.status === 200){
        transaksis.value = response.data.data
        datatable()
        loader.hide()
      }
    }

    const kembalikan = (kode, id, index) => {
      Swal.fire({
        title: 'Apa kamu yakin ?',
        text: 'ingin mengembalikan buku dengan kode transaksi "'+ kode + '"?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Lanjutkan',
        cancelButtonText: 'Kembali'
      }).then((result) => {
        if (result.isConfirmed) {
          
          axios.patch('api/transaksi/' + id + '/kembalikan')
          $('#example').DataTable().destroy()
          transaksis.value.splice(index, 1)
          datatable()

          Toast.fire({
            icon: 'success',
            title: 'Berhasil mengembalikan buku'
          })
        }
      })
    }

    const perpanjang = (kode, id) => {
      Swal.fire({
        title: 'Apa kamu yakin ?',
        text: 'ingin memperpanjang peminjaman buku dengan kode transaksi "'+ kode + '"?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Lanjutkan',
        cancelButtonText: 'Kembali'
      }).then((result) => {
        if (result.isConfirmed) {
          
          axios.patch('api/transaksi/' + id + '/perpanjang')
          // if(response.status === 200){
            getTransaksi()

            setTimeout(() => {
              Toast.fire({
                icon: 'success',
                title: 'Berhasil memperpanjang peminjaman'
              })
            }, 3000)
  
          // }
        }
      })
    }

    onMounted(() => {
      getTransaksi()
    })

    return {
      transaksis,
      getTransaksi,
      datatable,
      denda,
      Toast,
      kembalikan,
      perpanjang,
      // format_rupiah
    }
  }
}
</script>