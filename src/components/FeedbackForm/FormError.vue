<script setup lang="ts">
import { Button } from "@/components/Button";
import { Typography } from "@/components/Typography";

interface Errors {
  name: string;
  email: string;
  phone: string;
}

interface Props {
  errors: Errors;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  retry: [];
}>();

const errorList = computed(() => Object.values(props.errors).filter(Boolean));
</script>

<script lang="ts">
import { computed } from "vue";
</script>

<template>
  <div class="form-error">
    <div class="form-error__title">
      <Typography tag-name="h2">Что-то пошло не так</Typography>
      <Typography tag-name="span" size="s">
        Попробуйте заполнить форму позже
      </Typography>
    </div>
    <div class="form-error__icon">
      <img src="../../assets/images/error.svg" alt="Error" />
    </div>
    <ul class="form-error__list">
      <li
        v-for="(error, index) in errorList"
        :key="index"
        class="form-error__item"
      >
        {{ error }}
      </li>
    </ul>

    <Button class="form-error__btn" size="s" @click="emit('retry')">
      <Typography tag-name="span">Вернуться к форме</Typography>
    </Button>
  </div>
</template>

<style scoped lang="scss">
.form-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 0;
  gap: 16px;

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  &__item {
    font-size: 14px;
    color: var(--danger);
    background-color: var(--danger-bg);
    border-radius: 8px;
    padding: 10px 16px;
    text-align: left;
  }

  &__btn {
    :deep(span) {
      color: var(--neutral-100);
    }
  }
}
</style>
