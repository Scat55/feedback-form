<script setup lang="ts">
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";

interface Errors {
  name: string;
  email: string;
  phone: string;
  grade: string;
}

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  name: string;
  email: string;
  phone: string;
  grade: string | null;
  info: string;
  errors: Errors;
  isDisabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  isDisabled: false,
});

const emit = defineEmits<{
  "update:name": [value: string];
  "update:email": [value: string];
  "update:phone": [value: string];
  "update:grade": [value: string | null];
  "update:info": [value: string];
}>();

const gradeOptions: Option[] = [
  { label: "Intern", value: "intern" },
  { label: "Junior", value: "junior" },
  { label: "Middle", value: "middle" },
  { label: "Senior", value: "senior" },
  { label: "Lead", value: "lead" },
];
</script>

<template>
  <div class="form-fields">
    <div class="form-fields__grid">
      <Input
        :model-value="name"
        label="ФИО"
        placeholder="Иван Иванов"
        :is-disabled="isDisabled"
        :is-error="!!errors.name"
        :hint="errors.name"
        @update:model-value="emit('update:name', $event)"
      />

      <Input
        :model-value="email"
        label="Почта"
        placeholder="example@mail.com"
        type="email"
        :is-disabled="isDisabled"
        :is-error="!!errors.email"
        :hint="errors.email"
        @update:model-value="emit('update:email', $event)"
      />

      <Input
        :model-value="phone"
        label="Номер телефона"
        mask="phone"
        :is-disabled="isDisabled"
        :is-error="!!errors.phone"
        :hint="errors.phone"
        @update:model-value="emit('update:phone', $event)"
      />

      <Select
        :model-value="grade ? { label: grade, value: grade } : null"
        label="Грейд"
        placeholder="Выберите"
        :options="gradeOptions"
        :is-disabled="isDisabled"
        :is-error="!!errors.grade"
        :hint="errors.grade"
        @update:model-value="
          emit('update:grade', $event ? String($event.value) : null)
        "
      />
    </div>
    <div class="form-fields__info">
      <label class="form-fields__label">Дополнительная информация</label>
      <textarea
        class="form-fields__textarea"
        :value="info"
        :disabled="isDisabled"
        placeholder="Что понравилось и не понравилось"
        rows="4"
        @input="
          emit('update:info', ($event.target as HTMLTextAreaElement).value)
        "
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-fields__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}
.form-fields__info {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-fields__label {
  font-size: 14px;
  color: var(--neutral-600);
}

.form-fields__textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: var(--neutral-200);
  color: var(--neutral-800);
  font-size: 16px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: var(--neutral-500);
  }

  &:focus {
    border-color: var(--primary-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    resize: none;
  }
}
</style>
