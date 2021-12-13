<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-10">
          <div class="d-flex justify-content-between">
            <div>
              <div class="tombol-modify">Detail Buku</div>
            </div>
            <div class="float-right tom">
              <router-link to="/buku" title="Kembali" class="btn btn-sm btn-dark"><i class="fas fa-arrow-left"></i></router-link>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <form>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group row">
                      <label for="staticEmail" class="col-3 col-form-label">Kode</label>
                      <div class="col-9">
                        <div class="form-control-plaintext">{{ state.kode }}</div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="staticEmail" class="col-3 col-form-label">Judul</label>
                      <div class="col-9">
                        <div class="form-control-plaintext">{{ state.judul }}</div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="staticEmail" class="col-3 col-form-label">Pengarang</label>
                      <div class="col-9">
                        <div class="form-control-plaintext">{{ state.pengarang }}</div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="staticEmail" class="col-3 col-form-label">Penerbit</label>
                      <div class="col-9">
                        <div class="form-control-plaintext">{{ state.penerbit }}</div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="staticEmail" class="col-3 col-form-label">Tahun</label>
                      <div class="col-9">
                        <div class="form-control-plaintext">{{ state.tahun }}</div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="staticEmail" class="col-3 col-form-label">ISBN</label>
                      <div class="col-9">
                        <div class="form-control-plaintext">{{ state.isbn }}</div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="staticEmail" class="col-3 col-form-label">Lokasi</label>
                      <div class="col-9">
                        <div class="form-control-plaintext">{{ state.lokasi }}</div>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="staticEmail" class="col-3 col-form-label">Jumlah</label>
                      <div class="col-9">
                        <div class="form-control-plaintext">{{ state.jumlah }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <img :src="'http://localhost:8000/storage/buku/' + state.gambar" style="width:100%;height:410px;border-radius:10px;box-shadow:2px 2px 6px black;">
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useLoading } from 'vue3-loading-overlay'
export default {
  setup(){
    const par = useRoute()
    const state = ref([])

    const getDetail = async () => {
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
      let response = await axios.get('api/buku/' + par.params.id)
      if(response.status === 200){
        state.value = response.data.data
        loader.hide()
      }
    }

    onMounted(() => {
      getDetail()
    })

    return {
      par,
      getDetail,
      state
    }
  }
}
</script>