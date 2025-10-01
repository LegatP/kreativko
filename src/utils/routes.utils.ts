const ROUTES = {
  home: "/",
  login: "/racun#prijava",
  register: "/racun#registracija",
  forgotPassword: "/racun#pozabljeno-geslo",
  cart: "/kosarica",
  shop: "/trgovina",
  orders: "/profil#moja-narocila",
  settings: "/profil#nastavitve",
  profile: "/profil",
  admin: {
    home: "/admin",
    collections: () => "/admin/[collection]",
  },
} as const;

export default ROUTES;
