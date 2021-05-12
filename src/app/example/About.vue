<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import {LoadingService} from "@/public/base";

export default {
  di: {
    inject:{
      loading: LoadingService
    }
  },
  created() {
  }
}
</script>
