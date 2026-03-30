import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { Input } from "@/components/Input";

describe("Input", () => {
  describe("рендер", () => {
    it("рендерит input", () => {
      const wrapper = mount(Input);
      expect(wrapper.find("input").exists()).toBe(true);
    });

    it("рендерит label если передан", () => {
      const wrapper = mount(Input, { props: { label: "ФИО" } });
      expect(wrapper.find("label").text()).toBe("ФИО");
    });

    it("не рендерит label если не передан", () => {
      const wrapper = mount(Input);
      expect(wrapper.find("label").exists()).toBe(false);
    });

    it("рендерит hint если передан", () => {
      const wrapper = mount(Input, { props: { hint: "Подсказка" } });
      expect(wrapper.find(".input-hint").text()).toBe("Подсказка");
    });

    it("не рендерит hint если не передан", () => {
      const wrapper = mount(Input);
      expect(wrapper.find(".input-hint").exists()).toBe(false);
    });

    it("устанавливает placeholder по умолчанию", () => {
      const wrapper = mount(Input);
      expect(wrapper.find("input").attributes("placeholder")).toBe("Текст");
    });

    it("устанавливает переданный placeholder", () => {
      const wrapper = mount(Input, {
        props: { placeholder: "Введите имя" },
      });
      expect(wrapper.find("input").attributes("placeholder")).toBe(
        "Введите имя",
      );
    });

    it('устанавливает type="text" по умолчанию', () => {
      const wrapper = mount(Input);
      expect(wrapper.find("input").attributes("type")).toBe("text");
    });

    it("устанавливает переданный type", () => {
      const wrapper = mount(Input, { props: { type: "password" } });
      expect(wrapper.find("input").attributes("type")).toBe("password");
    });

    it("устанавливает modelValue как value инпута", () => {
      const wrapper = mount(Input, { props: { modelValue: "Тест" } });
      expect((wrapper.find("input").element as HTMLInputElement).value).toBe(
        "Тест",
      );
    });
  });

  describe("classList", () => {
    it("всегда содержит класс input", () => {
      const wrapper = mount(Input);
      expect(wrapper.find("input").classes()).toContain("input");
    });

    it("добавляет --is-disabled если isDisabled = true", () => {
      const wrapper = mount(Input, { props: { isDisabled: true } });
      expect(wrapper.find("input").classes()).toContain("--is-disabled");
    });

    it("не добавляет --is-disabled по умолчанию", () => {
      const wrapper = mount(Input);
      expect(wrapper.find("input").classes()).not.toContain("--is-disabled");
    });

    it("добавляет --is-error если isError = true", () => {
      const wrapper = mount(Input, { props: { isError: true } });
      expect(wrapper.find("input").classes()).toContain("--is-error");
    });

    it("не добавляет --is-error по умолчанию", () => {
      const wrapper = mount(Input);
      expect(wrapper.find("input").classes()).not.toContain("--is-error");
    });

    it("hint получает класс --is-error если isError = true", () => {
      const wrapper = mount(Input, {
        props: { isError: true, hint: "Ошибка" },
      });
      expect(wrapper.find(".input-hint").classes()).toContain("--is-error");
    });
  });

  describe("disabled", () => {
    it("устанавливает атрибут disabled если isDisabled = true", () => {
      const wrapper = mount(Input, { props: { isDisabled: true } });
      expect(wrapper.find("input").attributes("disabled")).toBeDefined();
    });

    it("не устанавливает атрибут disabled по умолчанию", () => {
      const wrapper = mount(Input);
      expect(wrapper.find("input").attributes("disabled")).toBeUndefined();
    });
  });

  describe("emit update:modelValue", () => {
    it("эмитит update:modelValue при вводе", async () => {
      const wrapper = mount(Input);
      const input = wrapper.find("input");
      await input.setValue("Привет");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Привет"]);
    });

    it("эмитит несколько раз при последовательном вводе", async () => {
      const wrapper = mount(Input);
      const input = wrapper.find("input");
      await input.setValue("А");
      await input.setValue("АБ");
      expect(wrapper.emitted("update:modelValue")).toHaveLength(2);
    });
  });

  describe('mask="phone"', () => {
    it("устанавливает placeholder +7 (000) 000-00-00", () => {
      const wrapper = mount(Input, { props: { mask: "phone" } });
      expect(wrapper.find("input").attributes("placeholder")).toBe(
        "+7 (000) 000-00-00",
      );
    });

    it('устанавливает inputmode="tel"', () => {
      const wrapper = mount(Input, { props: { mask: "phone" } });
      expect(wrapper.find("input").attributes("inputmode")).toBe("tel");
    });

    it("не устанавливает inputmode без маски", () => {
      const wrapper = mount(Input);
      expect(wrapper.find("input").attributes("inputmode")).toBeUndefined();
    });

    it("эмитит +7 при фокусе на пустом поле", async () => {
      const wrapper = mount(Input, { props: { mask: "phone" } });
      await wrapper.find("input").trigger("focus");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["+7"]);
    });

    it("не эмитит +7 при фокусе если поле уже заполнено", async () => {
      const wrapper = mount(Input, {
        props: { mask: "phone", modelValue: "+7 (999)" },
      });
      await wrapper.find("input").trigger("focus");
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it.each([
      ["79991234567", "+7 (999) 123-45-67"],
      ["89991234567", "+7 (999) 123-45-67"],
      ["9991234567", "+7 (999) 123-45-67"],
    ])('форматирует "%s" в "%s"', async (raw, expected) => {
      const wrapper = mount(Input, { props: { mask: "phone" } });
      const input = wrapper.find("input");
      await input.setValue(raw);
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([expected]);
    });

    it("обрезает лишние цифры сверх 11", async () => {
      const wrapper = mount(Input, { props: { mask: "phone" } });
      await wrapper.find("input").setValue("799912345671234");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
        "+7 (999) 123-45-67",
      ]);
    });

    it("возвращает пустую строку если нет цифр", async () => {
      const wrapper = mount(Input, { props: { mask: "phone" } });
      await wrapper.find("input").setValue("abc");
      expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([""]);
    });

    it("блокирует Backspace если курсор в позиции <= 2", async () => {
      const wrapper = mount(Input, { props: { mask: "phone" } });
      const input = wrapper.find("input").element as HTMLInputElement;
      input.selectionStart = 1;
      input.selectionEnd = 1;

      const event = new KeyboardEvent("keydown", {
        key: "Backspace",
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it("не блокирует Backspace если курсор после позиции 2", async () => {
      const wrapper = mount(Input, {
        props: { mask: "phone", modelValue: "+7 (999)" },
      });
      const input = wrapper.find("input").element as HTMLInputElement;

      // значение нужно чтобы selectionStart корректно встал на позицию > 2
      input.value = "+7 (999)";
      input.selectionStart = 5;
      input.selectionEnd = 5;

      const event = new KeyboardEvent("keydown", {
        key: "Backspace",
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
    });
  });
});
