<template>
  <div class="app">
    <TopBar />
    <div class="main-content">
      <Sidebar />
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    TopBar,
    Sidebar
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.main-content {
  display: flex;
  flex: 1;
  height: calc(100vh - 76px);
}
</style>
