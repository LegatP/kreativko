import { generateSlug } from "../utils/slug.utils";

describe("generateSlug", () => {
  it("should convert simple text to lowercase slug", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("should handle Slovenian characters (ž, š, č)", () => {
    expect(generateSlug("Žaba šumi pod čerešnjo")).toBe("zaba-sumi-pod-ceresnjo");
  });

  it("should handle đ and ć characters", () => {
    expect(generateSlug("Đurđevac i Ćevapi")).toBe("durdevac-i-cevapi");
  });

  it("should remove special characters", () => {
    expect(generateSlug("Hello! World?")).toBe("hello-world");
  });

  it("should handle multiple spaces", () => {
    expect(generateSlug("Hello    World")).toBe("hello-world");
  });

  it("should handle underscores", () => {
    expect(generateSlug("hello_world")).toBe("hello-world");
  });

  it("should trim leading and trailing spaces", () => {
    expect(generateSlug("  Hello World  ")).toBe("hello-world");
  });

  it("should remove leading and trailing hyphens", () => {
    expect(generateSlug("-hello-world-")).toBe("hello-world");
  });

  it("should handle empty string", () => {
    expect(generateSlug("")).toBe("");
  });

  it("should handle string with only special characters", () => {
    expect(generateSlug("!@#$%")).toBe("");
  });

  it("should handle real Slovenian product names", () => {
    expect(generateSlug("Personalizirana majica - moj hobi")).toBe(
      "personalizirana-majica-moj-hobi"
    );
    expect(generateSlug("Črna majica z motivom")).toBe("crna-majica-z-motivom");
    expect(generateSlug("Šport & Življenje")).toBe("sport-zivljenje");
  });

  it("should handle mixed case", () => {
    expect(generateSlug("HeLLo WoRLd")).toBe("hello-world");
  });

  it("should handle numbers", () => {
    expect(generateSlug("Product 123")).toBe("product-123");
  });
});
