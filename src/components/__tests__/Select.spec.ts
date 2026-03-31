import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { Select } from "@/components/Select";

const options = [
  { label: "Первый", value: 1 },
  { label: "Второй", value: 2 },
  { label: "Третий", value: 3 },
];

describe("Select", () => {
  describe("рендер", () => {
    it("рендерит компонент", () => {
      const wrapper = mount(Select);
      expect(wrapper.find(".select-wrapper").exists()).toBe(true);
    });

    it("рендерит label если передан", () => {
      const wrapper = mount(Select, { props: { label: "Название" } });
      expect(wrapper.find(".select-label").text()).toBe("Название");
    });

    it("не рендерит label если не передан", () => {
      const wrapper = mount(Select);
      expect(wrapper.find(".select-label").exists()).toBe(false);
    });

    it("показывает placeholder если modelValue не передан", () => {
      const wrapper = mount(Select, { props: { placeholder: "Выберите" } });
      expect(wrapper.find(".select__value").text()).toBe("Выберите");
    });

    it("показывает label выбранного значения", () => {
      const wrapper = mount(Select, {
        props: { modelValue: options[0], options },
      });
      expect(wrapper.find(".select__value").text()).toBe("Первый");
    });

    it("не рендерит dropdown по умолчанию", () => {
      const wrapper = mount(Select);
      expect(wrapper.find(".select__dropdown").exists()).toBe(false);
    });

    it("рендерит hint если передан", () => {
      const wrapper = mount(Select, { props: { hint: "Подсказка" } });
      expect(wrapper.find(".select-hint").exists()).toBe(true);
    });

    it("не рендерит hint если не передан и нет isLoading", () => {
      const wrapper = mount(Select);
      expect(wrapper.find(".select-hint").exists()).toBe(false);
    });
  });

  describe("classList", () => {
    it("всегда содержит класс select", () => {
      const wrapper = mount(Select);
      expect(wrapper.find(".select").exists()).toBe(true);
    });

    it("добавляет size_m по умолчанию", () => {
      const wrapper = mount(Select);
      expect(wrapper.find(".select").classes()).toContain("size_m");
    });

    it("добавляет size_sm если передан", () => {
      const wrapper = mount(Select, { props: { size: "s" } });
      expect(wrapper.find(".select").classes()).toContain("size_s");
    });

    it("добавляет --is-disabled если isDisabled = true", () => {
      const wrapper = mount(Select, { props: { isDisabled: true } });
      expect(wrapper.find(".select").classes()).toContain("--is-disabled");
    });

    it("добавляет --is-loading если isLoading = true", () => {
      const wrapper = mount(Select, { props: { isLoading: true } });
      expect(wrapper.find(".select").classes()).toContain("--is-loading");
    });

    it("добавляет --is-error если isError = true", () => {
      const wrapper = mount(Select, { props: { isError: true } });
      expect(wrapper.find(".select").classes()).toContain("--is-error");
    });

    it("добавляет --is-success если isSuccess = true", () => {
      const wrapper = mount(Select, { props: { isSuccess: true } });
      expect(wrapper.find(".select").classes()).toContain("--is-success");
    });

    it("добавляет --is-open после клика", async () => {
      const wrapper = mount(Select);
      await wrapper.find(".select").trigger("click");
      expect(wrapper.find(".select").classes()).toContain("--is-open");
    });
  });

  describe("dropdown", () => {
    it("открывается по клику", async () => {
      const wrapper = mount(Select, { props: { options } });
      await wrapper.find(".select").trigger("click");
      expect(wrapper.find(".select__dropdown").exists()).toBe(true);
    });

    it("закрывается повторным кликом", async () => {
      const wrapper = mount(Select, { props: { options } });
      await wrapper.find(".select").trigger("click");
      await wrapper.find(".select").trigger("click");
      expect(wrapper.find(".select__dropdown").exists()).toBe(false);
    });

    it("рендерит все переданные опции", async () => {
      const wrapper = mount(Select, { props: { options } });
      await wrapper.find(".select").trigger("click");
      expect(wrapper.findAll(".select__option")).toHaveLength(3);
    });

    it("не открывается если isDisabled = true", async () => {
      const wrapper = mount(Select, {
        props: { isDisabled: true, options },
      });
      await wrapper.find(".select").trigger("click");
      expect(wrapper.find(".select__dropdown").exists()).toBe(false);
    });

    it("не открывается если isLoading = true", async () => {
      const wrapper = mount(Select, { props: { isLoading: true, options } });
      await wrapper.find(".select").trigger("click");
      expect(wrapper.find(".select__dropdown").exists()).toBe(false);
    });

    it("помечает выбранную опцию классом --is-selected", async () => {
      const wrapper = mount(Select, {
        props: { modelValue: options[1], options },
      });
      await wrapper.find(".select").trigger("click");
      const items = wrapper.findAll(".select__option");
      expect(items[1].classes()).toContain("--is-selected");
      expect(items[0].classes()).not.toContain("--is-selected");
    });
  });

  describe("emit update:modelValue", () => {
    it("эмитит выбранную опцию при клике на элемент", async () => {
      const wrapper = mount(Select, { props: { options } });
      await wrapper.find(".select").trigger("click");
      await wrapper.findAll(".select__option")[0].trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([options[0]]);
    });

    it("закрывает dropdown после выбора", async () => {
      const wrapper = mount(Select, { props: { options } });
      await wrapper.find(".select").trigger("click");
      await wrapper.findAll(".select__option")[0].trigger("click");
      expect(wrapper.find(".select__dropdown").exists()).toBe(false);
    });

    it("эмитит разные опции при разных кликах", async () => {
      const wrapper = mount(Select, { props: { options } });

      await wrapper.find(".select").trigger("click");
      await wrapper.findAll(".select__option")[0].trigger("click");

      await wrapper.find(".select").trigger("click");
      await wrapper.findAll(".select__option")[2].trigger("click");

      const emitted = wrapper.emitted("update:modelValue")!;
      expect(emitted[0]).toEqual([options[0]]);
      expect(emitted[1]).toEqual([options[2]]);
    });
  });

  describe("hint", () => {
    it("hint получает класс --is-error если isError = true", () => {
      const wrapper = mount(Select, {
        props: { isError: true, hint: "Ошибка" },
      });
      expect(wrapper.find(".select-hint").classes()).toContain("--is-error");
    });

    it("hint получает класс --is-success если isSuccess = true", () => {
      const wrapper = mount(Select, {
        props: { isSuccess: true, hint: "Успех" },
      });
      expect(wrapper.find(".select-hint").classes()).toContain("--is-success");
    });

    it("hint отображается при isLoading без текста", () => {
      const wrapper = mount(Select, { props: { isLoading: true } });
      expect(wrapper.find(".select-hint").exists()).toBe(true);
    });
  });
});
