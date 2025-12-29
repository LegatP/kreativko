import { generateOrderNumber } from "@/utils/order.utils";

describe("generateOrderNumber", () => {
  it("should generate order number in format MM-DDMMYY-XXX", () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^MM-\d{6}-\d{3}$/);
  });

  it("should use correct date format for Dec 29, 2025", () => {
    const date = new Date(2025, 11, 29); // Dec 29, 2025
    const orderNumber = generateOrderNumber(date);
    expect(orderNumber).toMatch(/^MM-291225-\d{3}$/);
  });

  it("should use correct date format for Jan 1, 2026", () => {
    const date = new Date(2026, 0, 1); // Jan 1, 2026
    const orderNumber = generateOrderNumber(date);
    expect(orderNumber).toMatch(/^MM-010126-\d{3}$/);
  });

  it("should pad single digit day and month with zeros", () => {
    const date = new Date(2025, 0, 5); // Jan 5, 2025
    const orderNumber = generateOrderNumber(date);
    expect(orderNumber).toMatch(/^MM-050125-\d{3}$/);
  });

  it("should generate different random suffixes", () => {
    const date = new Date(2025, 11, 29);
    const orderNumbers = new Set<string>();

    // Generate 10 order numbers and check they're not all the same
    for (let i = 0; i < 10; i++) {
      orderNumbers.add(generateOrderNumber(date));
    }

    // With 1000 possible suffixes, 10 generations should produce at least 2 different values
    expect(orderNumbers.size).toBeGreaterThan(1);
  });
});
