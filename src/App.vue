<script setup lang="ts">
import TopBar from '@/components/TopBar.vue'
</script>

<template>
  <TopBar class="ffs-pre fixed h-12" />
  <div class="ffs-pre flex min-h-[100vh] flex-col items-center pt-12">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component
          :is="Component"
          v-if="route.meta.keepAlive"
          :key="route.path"
        />
      </keep-alive>
      <component
        :is="Component"
        v-if="!route.meta.keepAlive"
        :key="route.path"
      />
    </router-view>
  </div>
</template>

<style lang="scss">
@import '@/style/utils.scss';

html {
  height: 100%;
  background-color: white;
}

body {
  min-height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  @apply antialiased;
}

@media only screen and (max-width: 768px) {
  html,
  body {
    -webkit-overflow-scrolling: touch;
  }

  body {
    overflow: auto;
  }
}
</style>
