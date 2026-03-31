<script setup lang="ts">
import { ref } from "vue";
import StarIcon from "@/assets/icons/star.svg?component";

interface Props {
  modelValue?: number;
  max?: number;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  max: 5,
  readonly: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const hovered = ref<number>(0);

const onSelect = (index: number) => {
  if (props.readonly) return;
  emit("update:modelValue", index);
};
</script>

<template>
  <div class="rating" :class="{ '--readonly': readonly }">
    <button
      v-for="index in max"
      :key="index"
      type="button"
      class="rating__star"
      :class="{ '--is-active': index <= (hovered || modelValue) }"
      :disabled="readonly"
      @click="onSelect(index)"
      @mouseenter="!readonly && (hovered = index)"
      @mouseleave="!readonly && (hovered = 0)"
    >
      <StarIcon />
    </button>
  </div>
</template>

<style scoped lang="scss">
.rating {
  display: inline-flex;
  gap: 4px;

  &.--readonly {
    pointer-events: none;
  }
}

.rating__star {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.15s ease;

  :deep(svg path) {
    stroke: var(--neutral-400);
    fill: transparent;
    transition:
      stroke 0.15s ease,
      fill 0.15s ease;
  }

  &.--is-active {
    :deep(svg path) {
      fill: #ffcc00;
      stroke: #ffcc00;
    }
  }

  &:hover {
    transform: scale(1.15);
  }

  &:disabled {
    cursor: default;
  }
}
</style>
