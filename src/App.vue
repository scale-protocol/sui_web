<script setup lang="ts">
</script>

<template>
  <EthosConnectProvider>
    <RouterView v-slot="{ Component }">
      <div>
        <Transition name="fade">
          <component :is="Component" />
        </Transition>
      </div>
    </RouterView>
  </EthosConnectProvider>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease-in-out;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
