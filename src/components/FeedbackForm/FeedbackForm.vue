<script setup lang="ts">
import { ref, reactive, computed } from "vue";

import FormFields from "./FormFields.vue";
import FormRating from "./FormRating.vue";
import FormSuccess from "@/components/FeedbackForm/FormSuccess.vue";
import FormError from "@/components/FeedbackForm/FormError.vue";
import { Typography } from "@/components/Typography";

import { Step } from "@/components/Step";
import { Button } from "@/components/Button";

type Screen = "form" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  phone: string;
  grade: string | null;
  info: string;
  rating: number;
  chips: (string | number)[];
}

const screen = ref<Screen>("form");
const currentStep = ref<1 | 2>(1);

const form = reactive<FormData>({
  name: "",
  email: "",
  phone: "",
  grade: null,
  info: "",
  rating: 0,
  chips: [],
});

const errors = reactive({
  name: "",
  email: "",
  phone: "",
  grade: "",
});

const steps = [{ label: "Шаг 1" }, { label: "Шаг 2" }];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_FILLED = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

const showTitle = computed(
  () => screen.value !== "success" && screen.value !== "error",
);

const validateStepOne = (): boolean => {
  errors.name = "";
  errors.email = "";
  errors.phone = "";
  errors.grade = "";

  let valid = true;

  if (!form.name.trim()) {
    errors.name = "Введите ФИО";
    valid = false;
  }

  if (!EMAIL_REGEX.test(form.email)) {
    errors.email = "Введите корректный email";
    valid = false;
  }

  if (!PHONE_FILLED.test(form.phone)) {
    errors.phone = "Введите корректный номер телефона";
    valid = false;
  }

  if (!form.grade) {
    errors.grade = "Выберите грейд";
    valid = false;
  }

  return valid;
};

const onNext = () => {
  if (!validateStepOne()) {
    screen.value = "error";
    return;
  }
  currentStep.value = 2;
};

const onBack = () => {
  currentStep.value = 1;
};

const onSubmit = () => {
  screen.value = "success";
};

const onCancel = () => {
  onReset();
};

const onReset = () => {
  form.name = "";
  form.email = "";
  form.phone = "";
  form.grade = null;
  form.rating = 0;
  form.chips = [];

  errors.name = "";
  errors.email = "";
  errors.phone = "";
  errors.grade = "";

  screen.value = "form";
  currentStep.value = 1;
};

const onRetry = () => {
  screen.value = "form";
};
</script>

<template>
  <div class="feedback-form">
    <!-- Хедер -->
    <div class="feedback-form__header" v-if="showTitle">
      <Typography tag-name="h2"> Форма обратной связи </Typography>
      <Typography tag-name="p" size="s">
        Пожалуйста, оцените свой опыт прохождения тестового
      </Typography>
    </div>

    <!-- Основной контент -->
    <Transition name="fade" mode="out-in">
      <!-- Форма -->
      <div v-if="screen === 'form'" class="feedback-form__body">
        <Step
          v-model="currentStep"
          :steps="steps"
          class="feedback-form__stepper"
        />

        <!-- Рейтинг — только шаг 2, v-show чтобы не размонтировать -->
        <div v-show="currentStep === 2" class="feedback-form__rating">
          <FormRating
            :rating="form.rating"
            :chips="form.chips"
            @update:rating="form.rating = $event"
            @update:chips="form.chips = $event"
          />
        </div>

        <!-- Поля — всегда видны -->
        <FormFields
          :name="form.name"
          :email="form.email"
          :phone="form.phone"
          :grade="form.grade"
          :errors="errors"
          :info="form.info"
          :is-disabled="currentStep === 2"
          @update:name="form.name = $event"
          @update:email="form.email = $event"
          @update:phone="form.phone = $event"
          @update:grade="form.grade = $event"
          @update:info="form.info = $event"
        />

        <!-- Кнопки -->
        <div class="feedback-form__actions">
          <Button v-if="currentStep === 1" color="secondary" @click="onCancel">
            <Typography tag-name="p">Отменить</Typography>
          </Button>
          <Button v-if="currentStep === 2" color="secondary" @click="onBack">
            <Typography tag-name="p">Назад</Typography>
          </Button>
          <Button v-if="currentStep === 1" @click="onNext">
            <Typography tag-name="span">Далее</Typography>
          </Button>
          <Button v-if="currentStep === 2" @click="onSubmit">
            <Typography tag-name="span">Отправить</Typography>
          </Button>
        </div>
      </div>

      <!-- Успех -->
      <FormSuccess v-else-if="screen === 'success'" @reset="onReset" />

      <!-- Ошибка -->
      <FormError
        v-else-if="screen === 'error'"
        :errors="errors"
        @retry="onRetry"
      />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.feedback-form {
  background-color: var(--netural-100, #fff);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 637px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);

  @media (max-width: 480px) {
    padding: 24px 16px;
  }

  &__header {
    text-align: center;
    margin-bottom: 24px;
  }

  &__stepper {
    justify-content: center;
    margin-bottom: 24px;
  }

  &__rating {
    margin-bottom: 20px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;

    :deep(.button) {
      flex: 1;
    }

    :deep(.button span) {
      color: var(--neutral-100);
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
