import { garment } from "../config/garment";
import { SHIPPING } from "../config/shipping";
import { calculateItemPrice, getPriceBreakdown } from "../utils/pricing.utils";

describe("Pricing Configuration", () => {
  describe("T-shirt pricing", () => {
    it("should have correct base price for shirt (15.00 EUR)", () => {
      expect(garment.pricing.basePrice).toBe(15.0);
    });

    it("should have correct print position price (4.90 EUR)", () => {
      expect(garment.pricing.printPositionPrice).toBe(4.9);
    });
  });

  describe("Shipping configuration", () => {
    it("should have correct base shipping cost (4.90 EUR)", () => {
      expect(SHIPPING.baseCost).toBe(4.9);
    });

    it("should have correct free shipping threshold (50.00 EUR)", () => {
      expect(SHIPPING.freeShippingThreshold).toBe(50.0);
    });
  });
});

describe("calculateItemPrice", () => {
  it("should calculate price for shirt with no prints as base price only (15.00 EUR)", () => {
    const price = calculateItemPrice(garment.pricing, {});
    expect(price).toBe(15.0);
  });

  it("should calculate 19.90 EUR for shirt with front print only", () => {
    const price = calculateItemPrice(garment.pricing, {
      front: "https://example.com/design.png",
    });
    expect(price).toBe(19.9);
  });

  it("should calculate 24.80 EUR for shirt with front and back prints", () => {
    const price = calculateItemPrice(garment.pricing, {
      front: "https://example.com/front.png",
      back: "https://example.com/back.png",
    });
    expect(price).toBe(24.8);
  });

  it("should calculate 19.90 EUR for shirt with back print only", () => {
    const price = calculateItemPrice(garment.pricing, {
      back: "https://example.com/back.png",
    });
    expect(price).toBe(19.9);
  });

  it("should ignore empty string design URLs", () => {
    const price = calculateItemPrice(garment.pricing, {
      front: "",
      back: "https://example.com/back.png",
    });
    expect(price).toBe(19.9);
  });

  it("should ignore undefined design URLs", () => {
    const price = calculateItemPrice(garment.pricing, {
      front: undefined,
      back: "https://example.com/back.png",
    });
    expect(price).toBe(19.9);
  });

  it("should work with custom pricing (hoodie example)", () => {
    const hoodiePricing = { basePrice: 25.0, printPositionPrice: 5.9 };
    const price = calculateItemPrice(hoodiePricing, {
      front: "https://example.com/design.png",
    });
    expect(price).toBe(30.9);
  });
});

describe("getPriceBreakdown", () => {
  it("should return correct breakdown for shirt with front print", () => {
    const breakdown = getPriceBreakdown(garment.pricing, {
      front: "https://example.com/design.png",
    });

    expect(breakdown).toEqual({
      basePrice: 15.0,
      printPositionPrice: 4.9,
      numberOfPrintPositions: 1,
      totalPerItem: 19.9,
    });
  });

  it("should return correct breakdown for shirt with both prints", () => {
    const breakdown = getPriceBreakdown(garment.pricing, {
      front: "https://example.com/front.png",
      back: "https://example.com/back.png",
    });

    expect(breakdown).toEqual({
      basePrice: 15.0,
      printPositionPrice: 4.9,
      numberOfPrintPositions: 2,
      totalPerItem: 24.8,
    });
  });

  it("should return zero print positions for no designs", () => {
    const breakdown = getPriceBreakdown(garment.pricing, {});
    expect(breakdown.numberOfPrintPositions).toBe(0);
    expect(breakdown.totalPerItem).toBe(15.0);
  });

  it("should work with custom pricing (umbrella example)", () => {
    const umbrellaPricing = { basePrice: 20.0, printPositionPrice: 6.0 };
    const breakdown = getPriceBreakdown(umbrellaPricing, {
      front: "https://example.com/design.png",
    });

    expect(breakdown).toEqual({
      basePrice: 20.0,
      printPositionPrice: 6.0,
      numberOfPrintPositions: 1,
      totalPerItem: 26.0,
    });
  });
});

describe("Total order calculations", () => {
  it("should calculate correct total for 3 items with one print (59.70 EUR)", () => {
    const pricePerItem = calculateItemPrice(garment.pricing, {
      front: "https://example.com/design.png",
    });
    const quantity = 3;
    const total = pricePerItem * quantity;
    expect(total).toBeCloseTo(59.7, 2);
  });

  it("should calculate correct total for 2 items with two prints (49.60 EUR)", () => {
    const pricePerItem = calculateItemPrice(garment.pricing, {
      front: "https://example.com/front.png",
      back: "https://example.com/back.png",
    });
    const quantity = 2;
    const total = pricePerItem * quantity;
    expect(total).toBeCloseTo(49.6, 2);
  });

  it("should qualify for free shipping when total >= 50 EUR", () => {
    const pricePerItem = calculateItemPrice(garment.pricing, {
      front: "https://example.com/design.png",
    });
    const quantity = 3;
    const productsAmount = pricePerItem * quantity; // 59.70
    const qualifiesForFreeShipping =
      productsAmount >= SHIPPING.freeShippingThreshold;
    expect(qualifiesForFreeShipping).toBe(true);
  });

  it("should NOT qualify for free shipping when total < 50 EUR", () => {
    const pricePerItem = calculateItemPrice(garment.pricing, {
      front: "https://example.com/design.png",
    });
    const quantity = 2;
    const productsAmount = pricePerItem * quantity; // 39.80
    const qualifiesForFreeShipping =
      productsAmount >= SHIPPING.freeShippingThreshold;
    expect(qualifiesForFreeShipping).toBe(false);
  });

  it("should calculate total with shipping for orders under 50 EUR", () => {
    const pricePerItem = calculateItemPrice(garment.pricing, {
      front: "https://example.com/design.png",
    });
    const quantity = 2;
    const productsAmount = pricePerItem * quantity; // 39.80
    const isWithShipping = productsAmount < SHIPPING.freeShippingThreshold;
    const totalWithShipping = isWithShipping
      ? productsAmount + SHIPPING.baseCost
      : productsAmount;
    expect(totalWithShipping).toBeCloseTo(44.7, 2); // 39.80 + 4.90
  });
});
