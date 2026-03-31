<script setup lang="ts">
import { computed } from "vue";
import { RatingStar } from "@/components/RatingStar";
import { Chip } from "@/components/Chip";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  rating: number;
  chips: (string | number)[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:rating": [value: number];
  "update:chips": [value: (string | number)[]];
}>();

const chipsByRating: Record<number, Option[]> = {
  1: [
    { label: "Не понятно", value: "unclear" },
    { label: "Однообразно", value: "monotonous" },
    { label: "Слишком сложно", value: "too-hard" },
  ],
  2: [
    { label: "Не понятно", value: "unclear" },
    { label: "Однообразно", value: "monotonous" },
    { label: "Можно лучше", value: "could-be-better" },
  ],
  3: [
    { label: "Интересно", value: "interesting" },
    { label: "Легко", value: "easy" },
    { label: "Быстро сделал", value: "fast" },
    { label: "Красиво", value: "beautiful" },
  ],
  4: [
    { label: "Интересно", value: "interesting" },
    { label: "Легко", value: "easy" },
    { label: "Быстро сделал", value: "fast" },
    { label: "Красиво", value: "beautiful" },
    { label: "Подробно описано", value: "detailed" },
    { label: "Все понятно и по делу", value: "clear" },
  ],
  5: [
    { label: "Интересно", value: "interesting" },
    { label: "Легко", value: "easy" },
    { label: "Быстро сделал", value: "fast" },
    { label: "Красиво", value: "beautiful" },
    { label: "Подробно описано", value: "detailed" },
    { label: "Все понятно и по делу", value: "clear" },
  ],
};

const currentChipOptions = computed(() => chipsByRating[props.rating] ?? []);
</script>

<template>
  <div class="form-rating">
    <div class="form-rating__stars">
      <RatingStar
        :model-value="rating"
        @update:model-value="emit('update:rating', $event)"
      />
    </div>

    <Transition name="fade">
      <div v-if="rating > 0" class="form-rating__chips">
        <Chip
          :model-value="chips"
          :options="currentChipOptions"
          @update:model-value="emit('update:chips', $event)"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.form-rating {
  margin-bottom: 20px;
}

.form-rating__stars {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.form-rating__chips {
  display: flex;
  justify-content: center;
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
  transform: translateY(-8px);
}
</style>
