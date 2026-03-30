<script setup lang="ts">
import { computed, toRefs } from "vue";

interface Props {
  tagName: "span" | "p" | "a" | "h1" | "h2" | "h3" | "h4" | "h5";
  bold?: boolean;
  size?: "xs" | "s" | "m";
  isLink?: boolean;
  href?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tagName: "p",
  bold: false,
  size: "m",
  isLink: false,
});

const { tagName, bold, size, isLink } = toRefs(props);

const classList = computed(() => [
  "typography",
  size.value ? `size_${size.value}` : "",
  bold.value ? "bold" : "",
  `tag_${tagName.value}`,
  isLink.value ? "link" : "",
]);
</script>

<template>
  <component
    :is="props.tagName"
    :class="classList"
    v-bind="props.tagName === 'a' ? { href: props.href } : {}"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
.typography {
  font-style: normal;
  font-weight: 400;
  color: var(--neutral-600);
}

.bold {
  font-weight: 600;
}

.link {
  text-decoration: underline;
  color: var(--primary-color);
  cursor: pointer;
}

.tag {
  &_h1 {
    font-size: 50px;
    font-weight: 700;
    line-height: 62px;
    color: var(--neutral-800);
  }
  &_h2 {
    font-size: 34px;
    font-weight: 700;
    line-height: 46px;
    color: var(--neutral-800);
  }
  &_h3 {
    font-size: 24px;
    font-weight: 700;
    line-height: 35px;
    color: var(--neutral-800);
  }
  &_h4 {
    font-size: 22px;
    font-weight: 700;
    line-height: 28px;
    color: var(--neutral-800);
  }
  &_h5 {
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    color: var(--neutral-800);
  }
}

.size {
  &_xs {
    font-size: 12px;
    line-height: 16px;
  }

  &_s {
    font-size: 14px;
    line-height: 20px;
  }

  &_m {
    font-size: 16px;
    line-height: 28px;
  }
}
</style>
