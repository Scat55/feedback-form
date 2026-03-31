import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { Step } from "@/components/Step";

const steps = [{ label: "Первый" }, { label: "Второй" }, { label: "Третий" }];

describe("Step", () => {
  describe("рендер", () => {
    it("рендерит нужное количество шагов", () => {
      const wrapper = mount(Step, { props: { steps } });
      expect(wrapper.findAll(".stepper__circle")).toHaveLength(3);
    });

    it("рендерит на один разделитель меньше чем шагов", () => {
      const wrapper = mount(Step, { props: { steps } });
      expect(wrapper.findAll(".stepper__line")).toHaveLength(2);
    });

    it("отображает номера шагов", () => {
      const wrapper = mount(Step, { props: { steps } });
      const circles = wrapper.findAll(".stepper__circle");
      expect(circles[0].text()).toBe("1");
      expect(circles[1].text()).toBe("2");
      expect(circles[2].text()).toBe("3");
    });

    it('все кнопки имеют type="button"', () => {
      const wrapper = mount(Step, { props: { steps } });
      wrapper.findAll(".stepper__circle").forEach((circle) => {
        expect(circle.attributes("type")).toBe("button");
      });
    });
  });

  describe("classList", () => {
    it("помечает активный шаг классом --is-active", () => {
      const wrapper = mount(Step, { props: { steps, modelValue: 2 } });
      const circles = wrapper.findAll(".stepper__circle");
      expect(circles[0].classes()).not.toContain("--is-active");
      expect(circles[1].classes()).toContain("--is-active");
      expect(circles[2].classes()).not.toContain("--is-active");
    });

    it("помечает пройденные шаги классом --is-done", () => {
      const wrapper = mount(Step, { props: { steps, modelValue: 3 } });
      const circles = wrapper.findAll(".stepper__circle");
      expect(circles[0].classes()).toContain("--is-done");
      expect(circles[1].classes()).toContain("--is-done");
      expect(circles[2].classes()).not.toContain("--is-done");
    });

    it("первый шаг активен по умолчанию", () => {
      const wrapper = mount(Step, { props: { steps } });
      const circles = wrapper.findAll(".stepper__circle");
      expect(circles[0].classes()).toContain("--is-active");
      expect(circles[1].classes()).not.toContain("--is-active");
    });

    it("заполняет линию если шаг пройден", () => {
      const wrapper = mount(Step, { props: { steps, modelValue: 3 } });
      const fills = wrapper.findAll(".stepper__line-fill");
      expect(fills[0].classes()).toContain("--is-filled");
      expect(fills[1].classes()).toContain("--is-filled");
    });

    it("не заполняет линию если шаг ещё не пройден", () => {
      const wrapper = mount(Step, { props: { steps, modelValue: 1 } });
      const fills = wrapper.findAll(".stepper__line-fill");
      expect(fills[0].classes()).not.toContain("--is-filled");
      expect(fills[1].classes()).not.toContain("--is-filled");
    });

    it("заполняет только пройденные линии", () => {
      const wrapper = mount(Step, { props: { steps, modelValue: 2 } });
      const fills = wrapper.findAll(".stepper__line-fill");
      expect(fills[0].classes()).toContain("--is-filled");
      expect(fills[1].classes()).not.toContain("--is-filled");
    });
  });

  describe("emit update:modelValue", () => {
    it("эмитит новый шаг при клике на круг", async () => {
      const wrapper = mount(Step, { props: { steps, modelValue: 1 } });
      await wrapper.findAll(".stepper__circle")[1].trigger("click");

      const emitted = wrapper.emitted("update:modelValue");
      expect(emitted).toBeTruthy();
      expect(emitted![0]).toEqual([2]);
    });

    it("эмитит корректный индекс для каждого шага", async () => {
      const wrapper = mount(Step, { props: { steps, modelValue: 1 } });
      const circles = wrapper.findAll(".stepper__circle");

      for (let i = 0; i < steps.length; i++) {
        await circles[i].trigger("click");
        const emitted = wrapper.emitted("update:modelValue")!;
        expect(emitted[i]).toEqual([i + 1]);
      }
    });
  });
});
