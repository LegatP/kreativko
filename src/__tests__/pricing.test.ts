import { garment } from "../config/garment";
import { SHIPPING } from "../config/shipping";
import { calculateItemPrice, getPriceBreakdown } from "../utils/pricing.utils";

describe("Pricing Configuration", () => {
  describe("T-shirt pricing", () => {
    it("should have correct base price for shirt (1500 cents = 15.00 EUR)", () => {
      expect(garment.pricing.basePrice).toBe(1500);
    });

    it("should have correct print position price (490 cents = 4.90 EUR)", () => {
      expect(garment.pricing.printPositionPrice).toBe(490);
    });
  });

  describe("Shipping configuration", () => {
    it("should have correct base shipping cost (490 cents = 4.90 EUR)", () => {
      expect(SHIPPING.baseCost).toBe(490);
    });

    it("should have correct free shipping threshold (5000 cents = 50.00 EUR)", () => {
      expect(SHIPPING.freeShippingThreshold).toBe(5000);
    });
  });
});

describe("calculateItemPrice", () => {
  it("should calculate price for shirt with no prints as base price only (1500 cents)", () => {
    const price = calculateItemPrice(garment.pricing, {});
    expect(price).toBe(1500);
  });

  it("should calculate 1990 cents for shirt with front print only", () => {
    const price = calculateItemPrice(garment.pricing, {
      front: "https://example.com/design.png",
    });
    expect(price).toBe(1990);
  });

  it("should calculate 2480 cents for shirt with front and back prints", () => {
    const price = calculateItemPrice(garment.pricing, {
      front: "https://example.com/front.png",
      back: "https://example.com/back.png",
    });
    expect(price).toBe(2480);
  });

  it("should calculate 1990 cents for shirt with back print only", () => {
    const price = calculateItemPrice(garment.pricing, {
      back: "https://example.com/back.png",
    });
    expect(price).toBe(1990);
  });

  it("should ignore empty string design URLs", () => {
    const price = calculateItemPrice(garment.pricing, {
      front: "",
      back: "https://example.com/back.png",
    });
    expect(price).toBe(1990);
  });

  it("should ignore undefined design URLs", () => {
    const price = calculateItemPrice(garment.pricing, {
      front: undefined,
      back: "https://example.com/back.png",
    });
    expect(price).toBe(1990);
  });

  it("should work with custom pricing (hoodie example)", () => {
    const hoodiePricing = { basePrice: 2500, printPositionPrice: 590 };
    const price = calculateItemPrice(hoodiePricing, {
      front: "https://example.com/design.png",
    });
    expect(price).toBe(3090);
  });
});

describe("getPriceBreakdown", () => {
  it("should return correct breakdown for shirt with front print", () => {
    const breakdown = getPriceBreakdown(garment.pricing, {
      front: "https://example.com/design.png",
    });

    expect(breakdown).toEqual({
      basePrice: 1500,
      printPositionPrice: 490,
      numberOfPrintPositions: 1,
      totalPerItem: 1990,
    });
  });

  it("should return correct breakdown for shirt with both prints", () => {
    const breakdown = getPriceBreakdown(garment.pricing, {
      front: "https://example.com/front.png",
      back: "https://example.com/back.png",
    });

    expect(breakdown).toEqual({
      basePrice: 1500,
      printPositionPrice: 490,
      numberOfPrintPositions: 2,
      totalPerItem: 2480,
    });
  });

  it("should return zero print positions for no designs", () => {
    const breakdown = getPriceBreakdown(garment.pricing, {});
    expect(breakdown.numberOfPrintPositions).toBe(0);
    expect(breakdown.totalPerItem).toBe(1500);
  });

  it("should work with custom pricing (umbrella example)", () => {
    const umbrellaPricing = { basePrice: 2000, printPositionPrice: 600 };
    const breakdown = getPriceBreakdown(umbrellaPricing, {
      front: "https://example.com/design.png",
    });

    expect(breakdown).toEqual({
      basePrice: 2000,
      printPositionPrice: 600,
      numberOfPrintPositions: 1,
      totalPerItem: 2600,
    });
  });
});

describe("Total order calculations", () => {
  it("should calculate correct total for 3 items with one print (5970 cents)", () => {
    const pricePerItem = calculateItemPrice(garment.pricing, {
      front: "https://example.com/design.png",
    });
    const quantity = 3;
    const total = pricePerItem * quantity;
    expect(total).toBe(5970);
  });

  it("should calculate correct total for 2 items with two prints (4960 cents)", () => {
    const pricePerItem = calculateItemPrice(garment.pricing, {
      front: "https://example.com/front.png",
      back: "https://example.com/back.png",
    });
    const quantity = 2;
    const total = pricePerItem * quantity;
    expect(total).toBe(4960);
  });

  it("should qualify for free shipping when total >= 5000 cents", () => {
    const pricePerItem = calculateItemPrice(garment.pricing, {
      front: "https://example.com/design.png",
    });
    const quantity = 3;
    const productsAmount = pricePerItem * quantity; // 5970
    const qualifiesForFreeShipping =
      productsAmount >= SHIPPING.freeShippingThreshold;
    expect(qualifiesForFreeShipping).toBe(true);
  });

  it("should NOT qualify for free shipping when total < 5000 cents", () => {
    const pricePerItem = calculateItemPrice(garment.pricing, {
      front: "https://example.com/design.png",
    });
    const quantity = 2;
    const productsAmount = pricePerItem * quantity; // 3980
    const qualifiesForFreeShipping =
      productsAmount >= SHIPPING.freeShippingThreshold;
    expect(qualifiesForFreeShipping).toBe(false);
  });

  it("should calculate total with shipping for orders under 5000 cents", () => {
    const pricePerItem = calculateItemPrice(garment.pricing, {
      front: "https://example.com/design.png",
    });
    const quantity = 2;
    const productsAmount = pricePerItem * quantity; // 3980
    const isWithShipping = productsAmount < SHIPPING.freeShippingThreshold;
    const totalWithShipping = isWithShipping
      ? productsAmount + SHIPPING.baseCost
      : productsAmount;
    expect(totalWithShipping).toBe(4470); // 3980 + 490
  });
});
