<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { Typography } from "@/components/Typography";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  modelValue?: Option | null;
  options?: Option[];
  label?: string;
  placeholder?: string;
  size?: "s" | "m";
  isDisabled?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: () => [],
  label: "",
  placeholder: "Текст",
  size: "m",
  isDisabled: false,
  isLoading: false,
  isError: false,
  isSuccess: false,
  hint: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: Option | null];
}>();

const { size, isDisabled, isLoading, isError, isSuccess } = toRefs(props);

const isOpen = ref(false);

const toggle = () => {
  if (isDisabled.value || isLoading.value) return;
  isOpen.value = !isOpen.value;
};

const select = (option: Option) => {
  emit("update:modelValue", option);
  isOpen.value = false;
};

const wrapperClass = computed(() => [
  "select",
  `size_${size.value}`,
  isDisabled.value ? "--is-disabled" : "",
  isLoading.value ? "--is-loading" : "",
  isError.value ? "--is-error" : "",
  isSuccess.value ? "--is-success" : "",
  isOpen.value ? "--is-open" : "",
]);
</script>

<template>
  <div class="select-wrapper">
    <label v-if="label" class="select-label">{{ label }}</label>

    <div :class="wrapperClass" @click="toggle">
      <Typography
        tag-name="span"
        class="select__value"
        :class="{ '--placeholder': !modelValue }"
      >
        {{ modelValue ? modelValue.label : placeholder }}
      </Typography>

      <!-- Иконка -->
      <span class="select__icon">
        <!-- Loading -->
        <svg
          v-if="isLoading"
          class="icon-spinner"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
            stroke-dasharray="40"
            stroke-dashoffset="10"
          />
        </svg>

        <!-- Chevron up -->
        <svg
          v-else-if="isOpen"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 15L12 9L6 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- Chevron down -->
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>

      <!-- Dropdown -->
      <ul v-if="isOpen" class="select__dropdown" @click.stop>
        <li
          v-for="option in options"
          :key="option.value"
          class="select__option"
          :class="{ '--is-selected': modelValue?.value === option.value }"
          @click="select(option)"
        >
          <Typography tag-name="span">
            {{ option.label }}
          </Typography>
        </li>
      </ul>
    </div>

    <!-- Hint -->
    <div
      v-if="hint || isLoading"
      class="select-hint"
      :class="{
        '--is-error': isError,
        '--is-loading': isLoading,
        '--is-success': isSuccess,
      }"
    >
      <!-- Error icon -->
      <svg
        v-if="isError"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4L4 12M4 4L12 12"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>

      <!-- Loading icon -->
      <svg
        v-else-if="isLoading"
        class="icon-spinner"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-dasharray="24"
          stroke-dashoffset="6"
        />
      </svg>

      <!-- Success icon -->
      <svg
        v-else-if="isSuccess"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 8L6.5 11.5L13 5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <Typography tag-name="span">
        {{ hint }}
      </Typography>
    </div>
  </div>
</template>

<style scoped lang="scss">
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.select-label {
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-600);
}

.select {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: var(--neutral-200);
  cursor: pointer;
  user-select: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
  gap: 8px;

  &:hover:not(.--is-disabled):not(.--is-loading) {
    background-color: var(--neutral-300);
  }

  &.--is-open {
    border-color: var(--primary-color);
  }

  &.--is-disabled,
  &.--is-loading {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.--is-error {
    border-color: var(--danger);
    background-color: var(--danger-bg);
  }

  &.--is-success {
    border-color: var(--success);
    background-color: var(--success-bg);
  }

  // Sizes
  &.size_m {
    padding: 14px 16px;
    font-size: 16px;
  }

  &.size_s {
    padding: 10px 12px;
    font-size: 14px;
  }
}

.select__value {
  flex: 1;
  color: var(--neutral-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.--placeholder {
    color: var(--neutral-500);
  }
}

.select__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--neutral-600);

  svg {
    width: 20px;
    height: 20px;
  }
}

.select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: var(--netural-100, #fff);
  border-radius: 8px;
  border: 1px solid var(--neutral-400);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 100;
  max-height: 220px;
  overflow-y: auto;
}

.select__option {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--neutral-200);
  }

  &.--is-selected {
    :deep(span) {
      color: var(--neutral-900);
    }
  }
}

.select-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--neutral-500);

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }

  &.--is-error {
    color: var(--danger);
  }

  &.--is-loading {
    color: var(--neutral-500);
  }

  &.--is-success {
    color: var(--success);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.icon-spinner {
  animation: spin 1s linear infinite;
}
</style>
