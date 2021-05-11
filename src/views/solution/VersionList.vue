<template>
  <div class="app-container">
    <span>{{id}}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id
    }
  }
}
</script>
