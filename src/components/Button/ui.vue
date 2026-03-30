<script setup lang="ts">
import { computed, toRefs } from "vue";

interface Props {
  size?: "s" | "m";
  color?: string;
  isDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "s",
  color: "primary",
  isDisabled: false,
});

const emit = defineEmits(["click"]);

const { size, color, isDisabled } = toRefs(props);

const classList = computed(() => [
  "button",
  size.value ? `size_${size.value}` : "",
  isDisabled.value ? "--is-disabled" : "",
  color.value ? `color_${color.value}` : "",
]);

const onClick = (event: MouseEvent): boolean | void => {
  if (props.isDisabled) {
    return false;
  }

  emit("click", event);
};
</script>

<template>
  <button :class="classList" @click="onClick">
    <slot name="left-icon"></slot>
    <slot />
    <slot name="right-icon"></slot>
  </button>
</template>

<style scoped lang="scss">
.button {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid transparent;
  outline: none;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;

  // Colors
  &.color {
    &_primary {
      background-color: var(--primary-color);
      color: var(--netural-100);

      &:hover {
        background-color: var(--primary-color-hover);
      }

      &:active {
        background-color: var(--primary-color-active);
      }

      &.--is-disabled {
        cursor: not-allowed;
        background-color: var(--neutral-400);
      }
    }
    &_secondary {
      background-color: transparent;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);

      &:hover {
        transform: scale(0.9);
      }

      &:active {
        transform: scale(1.1);
      }

      &.--is-disabled {
        cursor: not-allowed;
      }
    }
  }

  // Size
  &.size {
    &_s {
      padding: 10px 8px;
    }
    &_m {
      padding: 14px 16px;
    }
  }
}
</style>
