export const garmet = {
  type: "shirt",
  colors: [
    { name: "Bela", hex: "#F0F1F6" },
    { name: "Črna", hex: "#111017" },
    { name: "Siva", hex: "#9EA1A6" },
    { name: "Mango rumena", hex: "#E29D1C" },
    { name: "Žajbljevo zelena", hex: "#81ABA3" },
    { name: "Svetlo modra", hex: "#0162AD" },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
};

const products = {
  "40-jih-mam-pa-kaj": {
    id: "40-jih-mam-pa-kaj",
    slug: "40-jih-mam-pa-kaj",
    name: "Štirideset jih imam, pa kaj!",
    shortName: "Štirideset jih imam, pa kaj!",
    defaultShirtColor: "#F0F1F6",
    // description: "Popolna majica kot darilo za 40. rojstni dan.",
    variables: [
      {
        key: "primary",
        title: "Številka",
        type: "number",
        placeholder: "40",
        suggestions: ["18", "20", "30", "40", "50", "60"],
      },
    ],
    // prompt:
    //   "A clean flat vector design of a circular road speed limit sign with the number ${variablePrimary} in bold black font inside a white circle with a red border, no shadows or outer gray borders, centered composition, print-ready vector graphic on plain white background.",
    prompt: "Change the number to ${primary}. Do not make any other changes.",
    promptType: "edit",
    designs: [
      // main design is always first
      {
        title: "",
        url: "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/static%2F40-jih-mam-pa-kaj-2.png?alt=media&token=fc5dce58-5618-45b2-9907-b6982d526f85",
      },
    ],
  },
  "samorog-in-stevilka": {
    id: "samorog-in-stevilka",
    slug: "samorog-in-stevilka",
    name: "Samorog in številka",
    shortName: "Samorog in številka",
    defaultShirtColor: "#F0F1F6",
    // description: "Popolna majica kot darilo za 40. rojstni dan.",
    variables: [
      {
        key: "primary",
        title: "Številka",
        type: "number",
        placeholder: "40",
        suggestions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "18"],
      },
    ],
    // prompt:
    //   "A clean flat vector design of a circular road speed limit sign with the number ${variablePrimary} in bold black font inside a white circle with a red border, no shadows or outer gray borders, centered composition, print-ready vector graphic on plain white background.",
    // prompt: "The image represents teh number 5 with Change the number to ${primary}. Do not make any other changes.",
    prompt:
      "Use the provided image as the base. Keep the exact same art style, colors, textures, outlines, and whimsical unicorn theme. Replace the current number with the number ${primary}, recreating it in the same rounded shape, pastel palette, and seamless integration with the unicorn's body. Preserve all decorative elements such as stars, sparkles, hearts, and the unicorn's pose, adjusting only as needed to fit the new number. Do not change the character design, color scheme, or illustration style—only remake the number as ${primary} while matching the original look perfectly.",
    promptType: "edit",
    designs: [
      // main design is always first
      {
        title: "",
        url: "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/9ZqfbbgQm7XcXsv6OGJ7W5VqmMz1%2F1764860785665_ai_generated.png?alt=media&token=86e2bc32-385e-4aa9-8b7a-0e7a948d202e",
      },
    ],
  },
  "prevec-sexy-za-18": {
    id: "prevec-sexy-za-18",
    slug: "prevec-sexy-za-18",
    name: "Preveč seksi za 18",
    shortName: "Preveč seksi za 18",
    defaultShirtColor: "#F0F1F6",
    // description: "",
    variables: [
      {
        key: "primary",
        title: "Številka",
        type: "number",
        placeholder: "40",
        suggestions: ["18", "20", "30", "40", "50", "60"],
      },
    ],
    prompt:
      "Use the provided image as the base. Keep the exact same art style, colors, textures, outlines. Replace the current number with the number ${primary}.",
    promptType: "edit",
    designs: [
      // main design is always first
      {
        title: "",
        url: "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/9ZqfbbgQm7XcXsv6OGJ7W5VqmMz1%2F1765138042860_ai_generated.png?alt=media&token=adcec623-64a5-4901-b56d-aa8fc3f9e091",
      },
    ],
  },
  "hello-20": {
    id: "hello-20",
    slug: "hello-20",
    name: "Hello 20",
    shortName: "Hello 20",
    defaultShirtColor: "#F0F1F6",
    // description: "",
    variables: [
      {
        key: "primary",
        title: "Številka",
        type: "number",
        placeholder: "40",
        suggestions: ["18", "20", "30", "40", "50", "60"],
      },
    ],
    prompt:
      "Use the provided image as the base. Keep the exact same art style, colors, textures. Replace the current number with the number ${primary}.",
    promptType: "edit",
    designs: [
      // main design is always first
      {
        title: "",
        url: "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/9ZqfbbgQm7XcXsv6OGJ7W5VqmMz1%2F1765187157317_ai_generated.png?alt=media&token=102a3cf6-48a7-4ebc-9479-1e87e270063d",
      },
    ],
  },
  "krona-18": {
    id: "krona-18",
    slug: "krona-18",
    name: "Krona 18",
    shortName: "Krona 18",
    defaultShirtColor: "#F0F1F6",
    // description: "",
    variables: [
      {
        key: "primary",
        title: "Številka",
        type: "number",
        placeholder: "40",
        suggestions: ["18", "20", "30", "40", "50", "60"],
      },
    ],
    prompt:
      "Use the provided image as the base. Keep the exact same art style, colors, textures, outlines. Replace the current number with the number ${primary}.",
    promptType: "edit",
    designs: [
      // main design is always first
      {
        title: "",
        url: "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/9ZqfbbgQm7XcXsv6OGJ7W5VqmMz1%2F1765191923935_ai_generated.png?alt=media&token=316381e1-7b0e-452e-a1a4-0a7b9f89465e",
      },
    ],
  },
  // "sadez-zelenjava": {
  //   id: "sadez-zelenjava",
  //   slug: "sadez-zelenjava",
  //   name: "Moj hobi, moj poklic",
  //   shortName: "Moj hobi, moj poklic",
  //   defaultShirtColor: "#F0F1F6",
  //   description:
  //     "Izberi sadje in hobi in ustvari popolnoma unikatno majico zase ali za darilo.",
  //   variables: {
  //     primary: {
  //       title: "Sadež ali zelenjava",
  //       placeholder: "Avokado",
  //       suggestions: [
  //         "Avokado",
  //         "Hruška",
  //         "Jabolko",
  //         "Banana",
  //         "Pomaranča",
  //         "Korenje",
  //         "Brokoli",
  //         "Paradižnik",
  //         "Paprika",
  //       ],
  //     },
  //     secondary: {
  //       title: "Kaj počne oziroma kdo je?",
  //       placeholder: "Izvaja jogo",
  //       suggestions: [
  //         "Izvaja jogo",
  //         "Kolesari",
  //         "Bere",
  //         "Zdravnik",
  //         "Kuhar",
  //         "Športnik",
  //         "Učitelj",
  //         "Slikar",
  //         "Programer",
  //         "Plesalec",
  //       ],
  //     },
  //   },
  //   imageUrl: "/images/majica-sadez-zelenjava.jpg",
  //   prompt:
  //     "You are generating a T-Shirt design. The design consists of a character performing an action or doing activity based on the profession (should also include simple objects that represent that profession or activity). The design cosists of four non-perfect circles, each one representing ${variablePrimary} in a different position. The positions should vary but match ${variableSecondary}. The circles should be a bit deformed and not perfect circles. ${variablePrimary} should be a simplistic cartoon-like character. The character should have stick-like arms and legs.",
  //   designs: [
  //     {
  //       title: "Avokado jogist",
  //       imageUrl:
  //         "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760025709663_ai_generated.png?alt=media&token=5382d01a-7d47-434a-b01f-74cd7bf6ecc4",
  //     },
  //     {
  //       title: "Rekreativno korenje",
  //       imageUrl:
  //         "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/xOet49IcwkW2PD5hiSjfc2tRX2I2%2F1761078014913_ai_generated.png?alt=media&token=95e727e6-e9d1-472e-875f-ca021a930515",
  //     },
  //     {
  //       title: "Ninja borovnica",
  //       imageUrl:
  //         "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/IHo52hfFKeYozR6zuxnGsCtrPCt1%2F1760386169386_ai_generated.png?alt=media&token=d710df42-c56a-4949-97c5-1d6eedad26e0",
  //     },
  //     {
  //       title: "Kuhar pomaranča",
  //       imageUrl:
  //         "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/miMceISWCgaJ00yyVLfeXAUaEb73%2F1760099155030_ai_generated.png?alt=media&token=a9d41db4-53f9-41df-a9ef-cd49889cba6c",
  //     },
  //   ],
  // },
  // "silhueta-zivali": {
  //   id: "silhueta-zivali",
  //   slug: "silhueta-zivali",
  //   name: "Silhueta živali",
  //   shortName: "Silhueta živali",
  //   // TODO: how to improve default color handling to use from garment
  //   defaultShirtColor: "#111017",
  //   description:
  //     "Izberi svojo najljubšo žival in ustvari kul majico s silhueto živali.",
  //   imageUrl: "/images/majica-silhueta-zivali.jpg",
  //   variables: {
  //     primary: {
  //       title: "Žival",
  //       placeholder: "Žirafa",
  //       suggestions: [
  //         "Žirafa",
  //         "Lev",
  //         "Slon",
  //         "Panda",
  //         "Tigra",
  //         "Zajec",
  //         "Lisica",
  //         "Medved",
  //         "Konj",
  //         "Ris",
  //       ],
  //     },
  //   },
  //   prompt:
  //     "Minimalist monochrome t-shirt design featuring a hand-drawn portrait of an animal (e.g., giraffe, lion, panda, fox, owl, or elephant) in vintage sketch style, the animal wearing oversized glasses or other quirky accessories, clean white line art on dark background, no shirt visible, centered composition, high-resolution wide-format vector-style illustration — suitable for screen printing. Animal: ${variablePrimary}",
  //   designs: [
  //     {
  //       title: "Žirafa",
  //       imageUrl:
  //         "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/BwpOTMA1dKh4gHudVXmjgzIc1Rq1%2F1761432770647_ai_generated.png?alt=media&token=004d3e20-138b-4239-8431-e6b427ae1a88",
  //     },
  //   ],
  // },
  // "rojstni-dan-prometni-znak-in-ime": {
  //   id: "rojstni-dan-prometni-znak-in-ime",
  //   slug: "rojstni-dan-prometni-znak-in-ime",
  //   name: "Personalizirana majica za rojstni dan - prometni znak in ime",
  //   shortName: "Rojstni dan prometni znak in ime",
  //   defaultShirtColor: "#F0F1F6",
  //   description:
  //     "Unisex majica z unikatnim dizajnom prometnega znaka s številko in imenom po želji.",
  //   imageUrl: "/images/majica-rojstni-dan-prometni-znak-in-ime.jpg",
  //   variables: {
  //     primary: {
  //       title: "Ime",
  //       placeholder: "Primož",
  //       suggestions: [
  //         "Primož",
  //         "Ema",
  //         "Zala",
  //         "Hana",
  //         "Mark",
  //         "Jakob",
  //         "Filip",
  //         "Luka",
  //         "Špela",
  //       ],
  //     },
  //     secondary: {
  //       title: "Letnica",
  //       placeholder: "30",
  //       suggestions: ["18", "20", "30", "40", "50", "60"],
  //     },
  //   },
  //   prompt:
  //     "A clean flat vector design of a circular road speed limit sign with the number ${variableSecondary} in bold black font inside a white circle with a red border, no shadows or outer gray borders, centered composition, and the handwritten name ${variablePrimary} in elegant cursive text slightly tilted upward and overlapping the lower edge of the circle, print-ready vector graphic on plain white background.",
  //   designs: [
  //     {
  //       title: "Primož 30",
  //       imageUrl:
  //         "https://firebasestorage.googleapis.com/v0/b/kreativko---development.firebasestorage.app/o/BwpOTMA1dKh4gHudVXmjgzIc1Rq1%2F1761433623282_ai_generated.png?alt=media&token=f30f0051-fe30-4173-9d2c-56c708706969",
  //     },
  //   ],
  // },
};

// TODO:
// - extract sizes
// configurable product is subtype of product which is a shirt/mug etc.
// product type: configurable / fixed

export type Product = Omit<
  (typeof products)[keyof typeof products],
  "variables" | "promptType"
> & {
  promptType: "edit" | "create";
  variables: {
    key: string;
    title: string;
    type?: "string" | "number";
    placeholder: string;
    suggestions?: string[];
  }[];
};

export default products;
