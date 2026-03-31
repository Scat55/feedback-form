<script setup lang="ts">
import { Typography } from "@/components/Typography";

interface Props {
  modelValue?: (string | number)[];
  options?: { label: string; value: string | number }[];
  size?: "s" | "m";
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  options: () => [],
  size: "s",
});

const emit = defineEmits<{
  "update:modelValue": [value: (string | number)[]];
}>();

const isSelected = (value: string | number) => props.modelValue.includes(value);

const toggle = (value: string | number) => {
  const next = isSelected(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value];
  emit("update:modelValue", next);
};
</script>

<template>
  <div class="chip-group">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="chip"
      :class="[`size_${size}`, { '--is-selected': isSelected(option.value) }]"
      @click="toggle(option.value)"
    >
      <Typography tag-name="span" size="s">
        {{ option.label }}
      </Typography>
    </button>
  </div>
</template>

<style scoped lang="scss">
.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  border: none;
  border-radius: 50px;
  background-color: var(--neutral-200);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  user-select: none;

  :deep(span) {
    color: var(--neutral-900);
  }

  &.size_m {
    padding: 12px 24px;
    :deep(span) {
      font-size: 16px;
    }
  }

  &.size_s {
    padding: 5px 16px;
  }

  &.--is-selected {
    background-color: var(--neutral-700);
    :deep(span) {
      color: var(--netural-100, #fff);
    }
  }

  &:hover:not(.--is-selected) {
    background-color: var(--neutral-400);
  }
}
</style>
