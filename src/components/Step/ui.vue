<script setup lang="ts">
interface Step {
  label?: string;
}

interface Props {
  steps: Step[];
  modelValue?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
});
</script>

<template>
  <div class="stepper">
    <div v-for="(step, index) in steps" :key="index" class="stepper__item">
      <!-- Круг -->
      <div
        class="stepper__circle"
        :class="{
          '--is-active': index + 1 === modelValue,
          '--is-done': index + 1 < modelValue,
        }"
      >
        {{ index + 1 }}
      </div>

      <!-- Линия -->
      <div v-if="index < steps.length - 1" class="stepper__line">
        <div
          class="stepper__line-fill"
          :class="{ '--is-filled': index + 1 < modelValue }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  display: flex;
  align-items: center;
}

.stepper__item {
  display: flex;
  align-items: center;
}

.stepper__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background-color: var(--neutral-300);
  color: var(--neutral-600);
  font-size: 16px;
  flex-shrink: 0;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;

  &.--is-active {
    background-color: var(--primary-color);
    color: var(--netural-100, #fff);
    transform: scale(1.1);
  }

  &.--is-done {
    background-color: var(--primary-color);
    color: var(--netural-100, #fff);
    transform: scale(1);
  }
}

.stepper__line {
  width: 80px;
  height: 4px;
  background-color: var(--neutral-300);
  border-radius: 2px;
  margin: 0 4px;
  overflow: hidden;
}

.stepper__line-fill {
  height: 100%;
  width: 0;
  background-color: var(--primary-color);
  border-radius: 2px;
  transition: width 0.4s ease;

  &.--is-filled {
    width: 100%;
  }
}
</style>
