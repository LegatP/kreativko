import { formatPrice } from "@/utils/currency.utils";

describe("formatPrice", () => {
  it("formats 1500 cents as 15.00", () => {
    expect(formatPrice(1500)).toBe("15.00");
  });

  it("formats 490 cents as 4.90", () => {
    expect(formatPrice(490)).toBe("4.90");
  });

  it("formats 1990 cents as 19.90", () => {
    expect(formatPrice(1990)).toBe("19.90");
  });

  it("formats 0 cents as 0.00", () => {
    expect(formatPrice(0)).toBe("0.00");
  });

  it("formats 5000 cents as 50.00", () => {
    expect(formatPrice(5000)).toBe("50.00");
  });
});
