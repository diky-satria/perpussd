<template>
  <div>
    <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <div class="tombol-modify">Laporan Bulanan</div>
          </div>
          <div class="float-right tom">
            <router-link to="/admin" title="Kembali" class="btn btn-sm btn-dark"><i class="fas fa-arrow-left"></i></router-link>
            <button id="pdf" @click="exportToPdf" class="btn btn-sm btn-danger ml-1" title="Export To Pdf">Pdf</button>
            <button id="excel" @click="exportToExcel" class="btn btn-sm btn-success ml-1" title="Export To Excel">Excel</button>
          </div>
        </div>
      <div class="card">
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-md">
              <form @submit.prevent="getState" class="d-flex float-right">
                <input type="date" v-model="form.from" class="form-control">
                <input type="date" v-model="form.to" class="form-control mx-1">
                <button class="btn btn-sm btn-primary" title="Cari"><i class="fas fa-search"></i></button>
              </form>
            </div>
          </div>
          <div id="laporanBulanan">
            <h5 class="text-center mb-4">Laporan tanggal {{ dari ? dari : '---' }} sampai {{ ke ? ke : '---' }}</h5>
            <table id="example" class="table table-striped table-sm" style="width:100%">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Transaksi</th>
                  <th>Nama</th>
                  <th>Tgl Peminjaman</th>
                  <th>Tgl Pengembalian</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(st, index) in state" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ st.kode }}</td>
                  <td>{{ st.nama }}</td>
                  <td>{{ st.tgl_peminjaman }}</td>
                  <td>{{ st.tgl_pengembalian }}</td>
                  <td>{{ st.jumlah }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import $ from 'jquery'
import html2pdf from 'html2pdf.js'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const state = ref([])
    const form = reactive({
      from: '',
      to: ''
    })
    const dari = ref()
    const ke = ref()

    //datatable
    const datatable = () => {
      $(document).ready(function() {
        $('#example').DataTable()
      });
    }

    const getState = async () => {
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
      let response = await axios.get('api/laporanBulanan', {
        params: {
          from: form.from,
          to: form.to
        }
      })
      if(response.status === 200){
        state.value = response.data.data
        if(state.value.length < 1){
          document.getElementById('pdf').setAttribute('disabled', true)
          document.getElementById('pdf').setAttribute('title', 'Data kosong')
          document.getElementById('excel').setAttribute('disabled', true)
          document.getElementById('excel').setAttribute('title', 'Data kosong')
        }
        datatable()
        if(form.from != null && form.to != null){
          dari.value = form.from
          ke.value = form.to
          $('#example').DataTable().destroy()
          datatable()
          form.from = ''
          form.to = ''
        }
        loader.hide()
      }
    }

    const exportToPdf = () => {
      $('#example').DataTable().destroy()
      var element = document.getElementById('laporanBulanan')
      var opt = {
        margin:       10,
        filename:     'laporan-bulanan.pdf'
      }

      html2pdf().set(opt).from(element).save()
      datatable()
    }

    const exportToExcel = () => {
      $('#example').DataTable().destroy()
      window.open('data:application/vnd.ms-excel,' + encodeURIComponent(document.getElementById('laporanBulanan').innerHTML))
      datatable()
    }

    onMounted(() => {
      getState()
    })

    return {
      state,
      getState,
      datatable,
      exportToPdf,
      exportToExcel,
      form,
      dari,
      ke
    }
  }
}
</script>