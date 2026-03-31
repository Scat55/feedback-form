import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { Chip } from "@/components/Chip";

const options = [
  { label: "Первый", value: "first" },
  { label: "Второй", value: "second" },
  { label: "Третий", value: "third" },
];

const global = {
  stubs: { Typography: { template: "<span><slot /></span>" } },
};

describe("Chip", () => {
  describe("рендер", () => {
    it("рендерит все переданные опции", () => {
      const wrapper = mount(Chip, { props: { options }, global });
      expect(wrapper.findAll(".chip")).toHaveLength(3);
    });

    it("не рендерит кнопки если options пустой", () => {
      const wrapper = mount(Chip, { global });
      expect(wrapper.findAll(".chip")).toHaveLength(0);
    });

    it("отображает label каждой опции", () => {
      const wrapper = mount(Chip, { props: { options }, global });
      const chips = wrapper.findAll(".chip");
      expect(chips[0].text()).toBe("Первый");
      expect(chips[1].text()).toBe("Второй");
      expect(chips[2].text()).toBe("Третий");
    });

    it('все кнопки имеют type="button"', () => {
      const wrapper = mount(Chip, { props: { options }, global });
      wrapper.findAll(".chip").forEach((chip) => {
        expect(chip.attributes("type")).toBe("button");
      });
    });
  });

  describe("size", () => {
    it("добавляет size_s по умолчанию", () => {
      const wrapper = mount(Chip, { props: { options }, global });
      wrapper.findAll(".chip").forEach((chip) => {
        expect(chip.classes()).toContain("size_s");
      });
    });

    it.each(["s", "m"] as const)("добавляет size_%s если передан", (size) => {
      const wrapper = mount(Chip, { props: { options, size }, global });
      wrapper.findAll(".chip").forEach((chip) => {
        expect(chip.classes()).toContain(`size_${size}`);
      });
    });
  });

  describe("выбор", () => {
    it("не помечает чипы как выбранные если modelValue пустой", () => {
      const wrapper = mount(Chip, {
        props: { options, modelValue: [] },
        global,
      });
      wrapper.findAll(".chip").forEach((chip) => {
        expect(chip.classes()).not.toContain("--is-selected");
      });
    });

    it("помечает чип классом --is-selected если его value в modelValue", () => {
      const wrapper = mount(Chip, {
        props: { options, modelValue: ["second"] },
        global,
      });
      const chips = wrapper.findAll(".chip");
      expect(chips[0].classes()).not.toContain("--is-selected");
      expect(chips[1].classes()).toContain("--is-selected");
      expect(chips[2].classes()).not.toContain("--is-selected");
    });

    it("помечает несколько чипов если modelValue содержит несколько значений", () => {
      const wrapper = mount(Chip, {
        props: { options, modelValue: ["first", "third"] },
        global,
      });
      const chips = wrapper.findAll(".chip");
      expect(chips[0].classes()).toContain("--is-selected");
      expect(chips[1].classes()).not.toContain("--is-selected");
      expect(chips[2].classes()).toContain("--is-selected");
    });
  });

  describe("emit update:modelValue", () => {
    it("эмитит значение при клике на невыбранный чип", async () => {
      const wrapper = mount(Chip, {
        props: { options, modelValue: [] },
        global,
      });
      await wrapper.findAll(".chip")[0].trigger("click");

      const emitted = wrapper.emitted("update:modelValue");
      expect(emitted).toBeTruthy();
      expect(emitted![0]).toEqual([["first"]]);
    });

    it("убирает значение при клике на уже выбранный чип", async () => {
      const wrapper = mount(Chip, {
        props: { options, modelValue: ["first"] },
        global,
      });
      await wrapper.findAll(".chip")[0].trigger("click");

      const emitted = wrapper.emitted("update:modelValue");
      expect(emitted).toBeTruthy();
      expect(emitted![0]).toEqual([[]]);
    });

    it("добавляет к уже выбранным при клике на другой чип", async () => {
      const wrapper = mount(Chip, {
        props: { options, modelValue: ["first"] },
        global,
      });
      await wrapper.findAll(".chip")[1].trigger("click");

      const emitted = wrapper.emitted("update:modelValue");
      expect(emitted).toBeTruthy();
      expect(emitted![0]).toEqual([["first", "second"]]);
    });

    it("не мутирует исходный modelValue", async () => {
      const modelValue = ["first"];
      const wrapper = mount(Chip, {
        props: { options, modelValue },
        global,
      });
      await wrapper.findAll(".chip")[1].trigger("click");
      expect(modelValue).toEqual(["first"]);
    });
  });
});
