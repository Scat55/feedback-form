<script setup lang="ts">
import { computed, toRefs } from "vue";

interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isError?: boolean;
  hint?: string;
  mask?: "phone";
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  label: "",
  placeholder: "Текст",
  isDisabled: false,
  isError: false,
  hint: "",
  type: "text",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const { isDisabled, isError } = toRefs(props);

const classList = computed(() => [
  "input",
  isDisabled.value ? "--is-disabled" : "",
  isError.value ? "--is-error" : "",
]);

const applyPhoneMask = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 11);

  if (!digits) return "";

  // Если начинается с 8 — заменяем на 7
  const normalized = digits.startsWith("8")
    ? "7" + digits.slice(1)
    : digits.startsWith("7")
      ? digits
      : "7" + digits;

  const d = normalized.slice(1); // убираем код страны

  let result = "+7";
  if (d.length > 0) result += ` (${d.slice(0, 3)}`;
  if (d.length >= 3) result += `) ${d.slice(3, 6)}`;
  if (d.length >= 6) result += `-${d.slice(6, 8)}`;
  if (d.length >= 8) result += `-${d.slice(8, 10)}`;

  return result;
};

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (props.mask === "phone") {
    const masked = applyPhoneMask(input.value);
    input.value = masked;
    emit("update:modelValue", masked);
  } else {
    emit("update:modelValue", input.value);
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if (props.mask !== "phone") return;

  const input = event.target as HTMLInputElement;

  // Запрещаем удалять префикс +7
  if (
    event.key === "Backspace" &&
    input.selectionStart !== null &&
    input.selectionStart <= 2
  ) {
    event.preventDefault();
  }
};

const onFocus = (event: FocusEvent) => {
  if (props.mask !== "phone") return;

  const input = event.target as HTMLInputElement;
  if (!input.value) {
    input.value = "+7";
    emit("update:modelValue", "+7");
  }
};
</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
      :class="classList"
      :value="modelValue"
      :placeholder="mask === 'phone' ? '+7 (000) 000-00-00' : placeholder"
      :disabled="isDisabled"
      :type="type"
      :inputmode="mask === 'phone' ? 'tel' : undefined"
      @input="onInput"
      @keydown="onKeydown"
      @focus="onFocus"
    />
    <span v-if="hint" class="input-hint" :class="{ '--is-error': isError }">
      {{ hint }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-600);
}

.input {
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: var(--neutral-200);
  color: var(--neutral-900);
  font-size: 16px;
  font-weight: 400;
  outline: none;
  transition: border-color 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: var(--neutral-500);
  }

  &:focus {
    border-color: var(--primary-color);
  }

  &:not(:placeholder-shown) {
    color: var(--neutral-900);
  }

  &.--is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.--is-error {
    border-color: var(--danger);
  }
}

.input-hint {
  font-size: 12px;
  color: var(--neutral-500);

  &.--is-error {
    color: var(--danger);
  }
}
</style>
