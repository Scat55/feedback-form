import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { Typography } from "@/components/Typography";

describe("Typography", () => {
  describe("tagName", () => {
    it.each(["p", "span", "h1", "h2", "h3", "h4", "h5", "a"] as const)(
      "рендерит тег <%s>",
      (tagName) => {
        const wrapper = mount(Typography, { props: { tagName } });
        expect(wrapper.element.tagName.toLowerCase()).toBe(tagName);
      },
    );

    it("рендерит <p> по умолчанию", () => {
      const wrapper = mount(Typography, { props: { tagName: "p" } });
      expect(wrapper.element.tagName.toLowerCase()).toBe("p");
    });
  });

  describe("classList", () => {
    it("всегда содержит класс typography", () => {
      const wrapper = mount(Typography, { props: { tagName: "p" } });
      expect(wrapper.classes()).toContain("typography");
    });

    it("добавляет класс tag_${tagName}", () => {
      const wrapper = mount(Typography, { props: { tagName: "h1" } });
      expect(wrapper.classes()).toContain("tag_h1");
    });

    it("добавляет класс bold если передан prop bold", () => {
      const wrapper = mount(Typography, {
        props: { tagName: "p", bold: true },
      });
      expect(wrapper.classes()).toContain("bold");
    });

    it("не добавляет класс bold по умолчанию", () => {
      const wrapper = mount(Typography, { props: { tagName: "p" } });
      expect(wrapper.classes()).not.toContain("bold");
    });

    it("добавляет класс link если передан prop isLink", () => {
      const wrapper = mount(Typography, {
        props: { tagName: "p", isLink: true },
      });
      expect(wrapper.classes()).toContain("link");
    });

    it.each(["xs", "s", "m"] as const)("добавляет класс size_%s", (size) => {
      const wrapper = mount(Typography, { props: { tagName: "p", size } });
      expect(wrapper.classes()).toContain(`size_${size}`);
    });
  });

  describe("href", () => {
    it("устанавливает href если tagName = a", () => {
      const wrapper = mount(Typography, {
        props: { tagName: "a", href: "/about" },
      });
      expect(wrapper.attributes("href")).toBe("/about");
    });

    it("не устанавливает href если tagName не a", () => {
      const wrapper = mount(Typography, {
        props: { tagName: "p", href: "/about" },
      });
      expect(wrapper.attributes("href")).toBeUndefined();
    });

    it("рендерит <a> без href если href не передан", () => {
      const wrapper = mount(Typography, { props: { tagName: "a" } });
      expect(wrapper.attributes("href")).toBeUndefined();
    });
  });

  describe("slot", () => {
    it("рендерит текст из слота", () => {
      const wrapper = mount(Typography, {
        props: { tagName: "p" },
        slots: { default: "Привет мир" },
      });
      expect(wrapper.text()).toBe("Привет мир");
    });
  });
});
