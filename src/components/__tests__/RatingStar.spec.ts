import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { RatingStar } from "@/components/RatingStar";

const global = {
  stubs: { StarIcon: { template: "<svg><path /></svg>" } },
};

describe("RatingStar", () => {
  describe("рендер", () => {
    it("рендерит 5 звёзд по умолчанию", () => {
      const wrapper = mount(RatingStar, { global });
      expect(wrapper.findAll(".rating__star")).toHaveLength(5);
    });

    it("рендерит кастомное количество звёзд", () => {
      const wrapper = mount(RatingStar, { props: { max: 10 }, global });
      expect(wrapper.findAll(".rating__star")).toHaveLength(10);
    });

    it('все кнопки имеют type="button"', () => {
      const wrapper = mount(RatingStar, { global });

      wrapper.findAll(".rating__star").forEach((star) => {
        expect(star.attributes("type")).toBe("button");
      });
    });
  });

  describe("classList", () => {
    it("не добавляет --readonly по умолчанию", () => {
      const wrapper = mount(RatingStar, { global });
      expect(wrapper.find(".rating").classes()).not.toContain("--readonly");
    });

    it("добавляет --readonly если передан prop readonly", () => {
      const wrapper = mount(RatingStar, {
        props: { readonly: true },
        global,
      });
      expect(wrapper.find(".rating").classes()).toContain("--readonly");
    });

    it("помечает звёзды --is-active согласно modelValue", () => {
      const wrapper = mount(RatingStar, {
        props: { modelValue: 3 },
        global,
      });

      const stars = wrapper.findAll(".rating__star");

      expect(stars[0]!.classes()).toContain("--is-active");
      expect(stars[1]!.classes()).toContain("--is-active");
      expect(stars[2]!.classes()).toContain("--is-active");
      expect(stars[3]!.classes()).not.toContain("--is-active");
      expect(stars[4]!.classes()).not.toContain("--is-active");
    });

    it("не помечает звёзды если modelValue = 0", () => {
      const wrapper = mount(RatingStar, {
        props: { modelValue: 0 },
        global,
      });

      wrapper.findAll(".rating__star").forEach((star) => {
        expect(star.classes()).not.toContain("--is-active");
      });
    });
  });

  describe("disabled", () => {
    it("устанавливает disabled на все кнопки если readonly = true", () => {
      const wrapper = mount(RatingStar, {
        props: { readonly: true },
        global,
      });

      wrapper.findAll(".rating__star").forEach((star) => {
        expect(star.attributes("disabled")).toBeDefined();
      });
    });

    it("не устанавливает disabled по умолчанию", () => {
      const wrapper = mount(RatingStar, { global });

      wrapper.findAll(".rating__star").forEach((star) => {
        expect(star.attributes("disabled")).toBeUndefined();
      });
    });
  });

  describe("emit update:modelValue", () => {
    it("эмитит значение при клике на звезду", async () => {
      const wrapper = mount(RatingStar, {
        props: { modelValue: 0 },
        global,
      });

      await wrapper.findAll(".rating__star")[2]!.trigger("click");

      const emitted = wrapper.emitted("update:modelValue");

      expect(emitted).toBeTruthy();
      expect(emitted?.[0]).toEqual([3]);
    });

    it("не эмитит если readonly = true", async () => {
      const wrapper = mount(RatingStar, {
        props: { modelValue: 0, readonly: true },
        global,
      });

      await wrapper.findAll(".rating__star")[2]!.trigger("click");

      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it("эмитит корректный индекс для каждой звезды", async () => {
      const wrapper = mount(RatingStar, {
        props: { modelValue: 0 },
        global,
      });

      const stars = wrapper.findAll(".rating__star");

      for (let i = 0; i < 5; i++) {
        await stars[i]!.trigger("click");

        const emitted = wrapper.emitted("update:modelValue");

        expect(emitted?.[i]).toEqual([i + 1]);
      }
    });
  });

  describe("hover", () => {
    it("подсвечивает звёзды при наведении", async () => {
      const wrapper = mount(RatingStar, {
        props: { modelValue: 0 },
        global,
      });

      await wrapper.findAll(".rating__star")[2]!.trigger("mouseenter");

      const stars = wrapper.findAll(".rating__star");

      expect(stars[0]!.classes()).toContain("--is-active");
      expect(stars[1]!.classes()).toContain("--is-active");
      expect(stars[2]!.classes()).toContain("--is-active");
      expect(stars[3]!.classes()).not.toContain("--is-active");
    });

    it("сбрасывает ховер при уходе мыши", async () => {
      const wrapper = mount(RatingStar, {
        props: { modelValue: 0 },
        global,
      });

      await wrapper.findAll(".rating__star")[2]!.trigger("mouseenter");
      await wrapper.findAll(".rating__star")[2]!.trigger("mouseleave");

      wrapper.findAll(".rating__star").forEach((star) => {
        expect(star.classes()).not.toContain("--is-active");
      });
    });

    it("не реагирует на hover если readonly = true", async () => {
      const wrapper = mount(RatingStar, {
        props: { modelValue: 0, readonly: true },
        global,
      });

      await wrapper.findAll(".rating__star")[2]!.trigger("mouseenter");

      wrapper.findAll(".rating__star").forEach((star) => {
        expect(star.classes()).not.toContain("--is-active");
      });
    });
  });
});
