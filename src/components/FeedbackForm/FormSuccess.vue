<script setup lang="ts">
import { Button } from "@/components/Button";
import { Typography } from "@/components/Typography";

const emit = defineEmits<{
  reset: [];
}>();
</script>

<template>
  <div class="form-success">
    <div class="form-success__title">
      <Typography tag-name="h2">Спасибо, ваш ответ отправлен</Typography>
      <Typography tag-name="p" size="s">
        Мы ценим ваше время и обязательно учтём обратную связь
      </Typography>
    </div>
    <div class="form-success__icon">
      <img src="../../assets/images/success.svg" alt="Success" />
    </div>

    <Button class="form-success__btn" @click="emit('reset')" size="s">
      <Typography tag-name="span"> На главную </Typography>
    </Button>
  </div>
</template>

<style scoped lang="scss">
.form-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  gap: 16px;

  &__btn {
    :deep(span) {
      color: var(--neutral-100);
    }
  }
}
</style>
