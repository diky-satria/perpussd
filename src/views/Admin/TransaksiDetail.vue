<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Detail Transaksi</div>
          </div>
          <div class="float-right tom">
            <router-link to="/transaksi" title="Kembali" class="btn btn-sm btn-dark ml-1"><i class="fas fa-arrow-left"></i></router-link>
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
                  <td>{{ transaksis.kode }}</td>
                </tr>
                <tr>
                  <td>Tgl Peminjaman</td>
                  <td>:</td>
                  <td>{{ transaksis.tgl_peminjaman }}</td>
                </tr>
                <tr>
                  <td>Tgl Pengembalian</td>
                  <td>:</td>
                  <td>{{ transaksis.tgl_pengembalian }}</td>
                </tr>
                <tr>
                  <td>Nama</td>
                  <td>:</td>
                  <td>{{ transaksis.nama }}</td>
                </tr>
                <tr>
                  <td>NIS</td>
                  <td>:</td>
                  <td>{{ transaksis.nis }}</td>
                </tr>
                <tr>
                  <td>Kelas</td>
                  <td>:</td>
                  <td>{{ transaksis.kelas }}</td>
                </tr>
                <tr>
                  <td>Telepon</td>
                  <td>:</td>
                  <td>
                    <div v-if="transaksis.telepon != null">{{ transaksis.telepon }}</div>
                    <div v-else:>---</div>
                  </td>
                </tr>
                <tr>
                  <td>Alamat</td>
                  <td>:</td>
                  <td>
                    <div v-if="transaksis.alamat != null">{{ transaksis.alamat }}</div>
                    <div v-else:>---</div>
                  </td>
                </tr>
                <tr>
                  <td>Jumlah</td>
                  <td>:</td>
                  <td>{{ transaksis.jumlah }}</td>
                </tr>
                <tr>
                  <td>Petugas</td>
                  <td>:</td>
                  <td>{{ transaksis.petugas }}</td>
                </tr>
                <tr>
                  <td>Terlambat | Denda</td>
                  <td>:</td>
                  <td>
                    <div v-if="denda(transaksis.tgl_pengembalian) > 0" style="color:red;font-weight:bold;">
                      {{ denda(transaksis.tgl_pengembalian) }} hari | <FormatRupiah :angka="denda(transaksis.tgl_pengembalian) * 1000 * transaksis.jumlah" :prefix="'Rp. '"/>
                    </div>
                    <div v-else:>---</div>
                  </td>
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(pem, index) in peminjaman" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ pem.kode_buku }}</td>
                    <td>{{ pem.judul }}</td>
                    <td>{{ pem.lokasi }}</td>
                  </tr>
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
import FormatRupiah from '@/components/FormatRupiah.vue'
import { useLoading } from 'vue3-loading-overlay'
export default {
  components:{
    FormatRupiah
  },
  setup(){
    const par = useRoute()
    const transaksis = ref([])
    const peminjaman = ref([])

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
      let response = await axios.get('api/transaksi/' + par.params.id)
      if(response.status === 200){
        transaksis.value = response.data.data
        peminjaman.value = response.data.peminjaman
        loader.hide()
      }
    }

    onMounted(() => {
      getTransaksi()
    })

    return {
      par,
      transaksis,
      peminjaman,
      getTransaksi,
      denda
    }
  }
}
</script>