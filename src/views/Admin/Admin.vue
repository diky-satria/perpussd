<template>
  <div class="admin">
    <div class="container mt-4">
      <div class="row row-admin">
        <div class="col-md">
          <div class="back">
            <div class="front mahasiswa">
              <div class="row">
                <div class="col">
                  <h6 class="text-uppercase">Data Siswa / i</h6>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <h3 style="font-weight:bold;">{{ mahasiswas }}</h3>
                </div>
                <div class="col">
                  <router-link to="/mahasiswa" title="Lihat" class="float-right text-white text-decoration-none"><i class="fas fa-arrow-right"></i></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md">
          <div class="back">
            <div class="front buku">
              <div class="row">
                <div class="col">
                  <h6 class="text-uppercase">Data Buku</h6>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <h3 style="font-weight:bold;">{{ bukus }}</h3>
                </div>
                <div class="col">
                  <router-link to="/buku" title="Lihat" class="float-right text-white text-decoration-none"><i class="fas fa-arrow-right"></i></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="back">
            <div class="front collapse-transaksi">
              <div class="row">
                <div class="col">
                  <h6 class="text-uppercase">Transaksi Collapse</h6>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <h3 style="font-weight:bold;">{{ transaksi }}</h3>
                </div>
                <div class="col">
                  <router-link to="/transaksi.collapse" title="Lihat" class="float-right text-white text-decoration-none"><i class="fas fa-arrow-right"></i></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="back">
            <div class="front laporan-harian">
              <div class="row">
                <div class="col">
                  <h6 class="text-uppercase">Laporan Harian</h6>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <h3>
                    <i class="fas fa-calendar-day"></i>
                  </h3>
                </div>
                <div class="col">
                  <router-link to="/laporan.harian" title="Lihat" class="float-right text-white text-decoration-none"><i class="fas fa-arrow-right"></i></router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="back">
            <div class="front laporan-bulanan">
              <div class="row">
                <div class="col">
                  <h6 class="text-uppercase">Laporan Bulanan</h6>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <h3>
                    <i class="fas fa-calendar-alt"></i>
                  </h3>
                </div>
                <div class="col">
                  <router-link to="/laporan.bulanan" title="Lihat" class="float-right text-white text-decoration-none"><i class="fas fa-arrow-right"></i></router-link>
                </div>
              </div>
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
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const mahasiswas = ref()
    const jurusans = ref()
    const bukus = ref()
    const transaksi = ref()

    const getCount = async () => {
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
      let response = await axios.get('api/count')
      if(response.status === 200){
        mahasiswas.value = response.data.mahasiswa
        jurusans.value = response.data.jurusan
        bukus.value = response.data.buku
        transaksi.value = response.data.transaksi
        loader.hide()
      }
    }

    onMounted(() => {
      getCount()
    })

    return {
      mahasiswas,
      jurusans,
      getCount,
      bukus,
      transaksi,
    }
  }
}
</script>