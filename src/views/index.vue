<script setup lang="ts">
import FeedbackForm from "@/components/FeedbackForm/FeedbackForm.vue";
</script>

<template>
  <div class="app">
    <FeedbackForm />
  </div>
</template>

<style scoped lang="scss">
.app {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-300);
  padding: 24px;

  @media (max-width: 480px) {
    padding: 20px;
  }
}
</style>
