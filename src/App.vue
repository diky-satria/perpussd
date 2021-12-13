<template>
  <div>
    <Navbar/>
    <div class="spacing"></div>
    <router-view class="pb-5"/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
export default {
  components:{
    Navbar
  }
}
</script>