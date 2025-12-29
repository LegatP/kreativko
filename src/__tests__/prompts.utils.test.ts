import { insertVariablesIntoPrompt } from "../utils/prompts.utils";

describe("insertVariablesIntoPrompt", () => {
  it("should replace a single variable", () => {
    const prompt = "Hello {{name}}!";
    const result = insertVariablesIntoPrompt(prompt, { name: "World" });
    expect(result).toBe("Hello World!");
  });

  it("should replace multiple different variables", () => {
    const prompt = "{{greeting}} {{name}}, welcome to {{place}}!";
    const result = insertVariablesIntoPrompt(prompt, {
      greeting: "Hello",
      name: "Alice",
      place: "Wonderland",
    });
    expect(result).toBe("Hello Alice, welcome to Wonderland!");
  });

  it("should replace multiple occurrences of the same variable", () => {
    const prompt = "{{name}} said hello to {{name}}";
    const result = insertVariablesIntoPrompt(prompt, { name: "Bob" });
    expect(result).toBe("Bob said hello to Bob");
  });

  it("should leave unmatched placeholders unchanged", () => {
    const prompt = "Hello {{name}}, your order {{orderId}} is ready";
    const result = insertVariablesIntoPrompt(prompt, { name: "Alice" });
    expect(result).toBe("Hello Alice, your order {{orderId}} is ready");
  });

  it("should handle empty variables object", () => {
    const prompt = "Hello {{name}}!";
    const result = insertVariablesIntoPrompt(prompt, {});
    expect(result).toBe("Hello {{name}}!");
  });

  it("should handle prompt without placeholders", () => {
    const prompt = "Hello World!";
    const result = insertVariablesIntoPrompt(prompt, { name: "Test" });
    expect(result).toBe("Hello World!");
  });

  it("should handle empty prompt", () => {
    const result = insertVariablesIntoPrompt("", { name: "Test" });
    expect(result).toBe("");
  });

  it("should handle empty string values", () => {
    const prompt = "Hello {{name}}!";
    const result = insertVariablesIntoPrompt(prompt, { name: "" });
    expect(result).toBe("Hello !");
  });

  it("should handle special characters in values", () => {
    const prompt = "Search for: {{query}}";
    const result = insertVariablesIntoPrompt(prompt, {
      query: "hello & goodbye <test>",
    });
    expect(result).toBe("Search for: hello & goodbye <test>");
  });

  it("should handle Slovenian characters in values", () => {
    const prompt = "Pozdravljen {{ime}}!";
    const result = insertVariablesIntoPrompt(prompt, { ime: "Žan Štefančič" });
    expect(result).toBe("Pozdravljen Žan Štefančič!");
  });

  it("should handle numeric values converted to strings", () => {
    const prompt = "Your total is {{amount}}€";
    const result = insertVariablesIntoPrompt(prompt, { amount: "19.90" });
    expect(result).toBe("Your total is 19.90€");
  });

  it("should handle multiline prompts", () => {
    const prompt = `Dear {{name}},

Your order {{orderId}} has been shipped.

Best regards,
{{company}}`;
    const result = insertVariablesIntoPrompt(prompt, {
      name: "Alice",
      orderId: "12345",
      company: "Kreativko",
    });
    expect(result).toBe(`Dear Alice,

Your order 12345 has been shipped.

Best regards,
Kreativko`);
  });
});
