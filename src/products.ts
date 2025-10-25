const products = {
  "sadez-zelenjava": {
    id: "sadez-zelenjava",
    slug: "sadez-zelenjava",
    name: "Personalizirana majica - moj hobi, moj poklic",
    shortName: "Moj hobi, moj poklic",
    description:
      "Izberi sadje in hobi in ustvari popolnoma unikatno majico zase ali za darilo.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    fruits: [
      "Avokado",
      "Hruška",
      "Jabolko",
      "Banana",
      "Pomaranča",
      "Korenje",
      "Brokoli",
      "Paradižnik",
      "Paprika",
    ],
    activities: [
      "Izvaja jogo",
      "Kolesari",
      "Bere",
      "Zdravnik",
      "Kuhar",
      "Športnik",
      "Učitelj",
      "Slikar",
      "Programer",
      "Plesalec",
    ],
    imageUrl: "/images/majica-sadez-zelenjava.jpg",
    designs: [
      {
        title: "Avokado jogist",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760025709663_ai_generated.png?alt=media&token=5382d01a-7d47-434a-b01f-74cd7bf6ecc4",
      },
      {
        title: "Rekreativno korenje",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/xOet49IcwkW2PD5hiSjfc2tRX2I2%2F1761078014913_ai_generated.png?alt=media&token=95e727e6-e9d1-472e-875f-ca021a930515",
      },
      {
        title: "Ninja borovnica",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/IHo52hfFKeYozR6zuxnGsCtrPCt1%2F1760386169386_ai_generated.png?alt=media&token=d710df42-c56a-4949-97c5-1d6eedad26e0",
      },
      {
        title: "Kuhar pomaranča",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760099155030_ai_generated.png?alt=media&token=a9d41db4-53f9-41df-a9ef-cd49889cba6c",
      },
    ],
  },
  "silhueta-zivali": {
    id: "silhueta-zivali",
    slug: "silhueta-zivali",
    name: "Personalizirana majica - silhueta živali",
    shortName: "Silhueta živali",
    description:
      "Izberi svojo najljubšo žival in ustvari unikatno majico s silhueto živali.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    imageUrl: "/images/majica-silhueta-zivali.jpg",
    animals: [
      "Žirafa",
      "Lev",
      "Slon",
      "Panda",
      "Tigra",
      "Zajec",
      "Lisica",
      "Medved",
      "Konj",
      "Ris",
    ],
    designs: [
      {
        title: "Žirafa",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/BwpOTMA1dKh4gHudVXmjgzIc1Rq1%2F1761432770647_ai_generated.png?alt=media&token=004d3e20-138b-4239-8431-e6b427ae1a88",
      },
    ],
  },
  "rojstni-dan-prometni-znak-in-ime": {
    id: "rojstni-dan-prometni-znak-in-ime",
    slug: "rojstni-dan-prometni-znak-in-ime",
    name: "Personalizirana majica - rojstni dan prometni znak in ime",
    shortName: "Rojstni dan prometni znak in ime",
    description:
      "Izberi svoj rojstni dan znak in ustvari unikatno majico s simbolom svojega zodiaka.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Rdeča", "Modra", "Zelena", "Rumena", "Črna", "Bela"],
    imageUrl: "/images/majica-rojstni-dan-prometni-znak-in-ime.jpg",
    prompt:
      "A clean flat vector design of a circular road speed limit sign with the number 30 in bold black font inside a white circle with a red border, no shadows or outer gray borders, centered composition, and the handwritten name 'Primož' in elegant cursive text slightly tilted upward and overlapping the lower edge of the circle, print-ready vector graphic on plain white background.",
    designs: [
      {
        title: "Primož 30",
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/BwpOTMA1dKh4gHudVXmjgzIc1Rq1%2F1761433623282_ai_generated.png?alt=media&token=f30f0051-fe30-4173-9d2c-56c708706969",
      },
    ],
  },
};

// TOOD:
// - extract sizes
// configurable product is subtype of product which is a shirt/mug etc.
// product type: configurable / fixed

export default products;
