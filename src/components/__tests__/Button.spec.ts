import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/Button";

describe("Button", () => {
  describe("classList", () => {
    it("всегда содержит класс button", () => {
      const wrapper = mount(Button);
      expect(wrapper.classes()).toContain("button");
    });

    it.each(["s", "m"] as const)("добавляет класс size_%s", (size) => {
      const wrapper = mount(Button, { props: { size } });
      expect(wrapper.classes()).toContain(`size_${size}`);
    });

    it("добавляет size_s по умолчанию", () => {
      const wrapper = mount(Button);
      expect(wrapper.classes()).toContain("size_s");
    });

    it.each(["primary", "secondary"] as const)(
      "добавляет класс color_%s",
      (color) => {
        const wrapper = mount(Button, { props: { color } });
        expect(wrapper.classes()).toContain(`color_${color}`);
      },
    );

    it("добавляет color_primary по умолчанию", () => {
      const wrapper = mount(Button);
      expect(wrapper.classes()).toContain("color_primary");
    });

    it("добавляет класс --is-disabled если isDisabled = true", () => {
      const wrapper = mount(Button, { props: { isDisabled: true } });
      expect(wrapper.classes()).toContain("--is-disabled");
    });

    it("не добавляет класс --is-disabled по умолчанию", () => {
      const wrapper = mount(Button);
      expect(wrapper.classes()).not.toContain("--is-disabled");
    });
  });

  describe("click", () => {
    it("эмитит click при нажатии", async () => {
      const wrapper = mount(Button);
      await wrapper.trigger("click");
      expect(wrapper.emitted("click")).toHaveLength(1);
    });

    it("передаёт MouseEvent в эмит", async () => {
      const wrapper = mount(Button);
      await wrapper.trigger("click");
      const emitted = wrapper.emitted("click")!;
      expect(emitted[0][0]).toBeInstanceOf(MouseEvent);
    });

    it("не эмитит click если isDisabled = true", async () => {
      const wrapper = mount(Button, { props: { isDisabled: true } });
      await wrapper.trigger("click");
      expect(wrapper.emitted("click")).toBeUndefined();
    });

    it("эмитит click несколько раз при повторных нажатиях", async () => {
      const wrapper = mount(Button);
      await wrapper.trigger("click");
      await wrapper.trigger("click");
      await wrapper.trigger("click");
      expect(wrapper.emitted("click")).toHaveLength(3);
    });
  });

  describe("slots", () => {
    it("рендерит дефолтный слот", () => {
      const wrapper = mount(Button, {
        slots: { default: "Нажми меня" },
      });
      expect(wrapper.text()).toContain("Нажми меня");
    });

    it("рендерит слот left-icon", () => {
      const wrapper = mount(Button, {
        slots: { "left-icon": '<svg data-testid="left-icon" />' },
      });
      expect(wrapper.find('[data-testid="left-icon"]').exists()).toBe(true);
    });

    it("рендерит слот right-icon", () => {
      const wrapper = mount(Button, {
        slots: { "right-icon": '<svg data-testid="right-icon" />' },
      });
      expect(wrapper.find('[data-testid="right-icon"]').exists()).toBe(true);
    });

    it("рендерит все три слота одновременно", () => {
      const wrapper = mount(Button, {
        slots: {
          "left-icon": '<svg data-testid="left-icon" />',
          default: "Текст",
          "right-icon": '<svg data-testid="right-icon" />',
        },
      });
      expect(wrapper.find('[data-testid="left-icon"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("Текст");
      expect(wrapper.find('[data-testid="right-icon"]').exists()).toBe(true);
    });
  });
});
