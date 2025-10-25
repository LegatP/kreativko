type QueryParams = Record<string, string | number | boolean>;
type PathParams = Record<string, string | number>;

const createRouteBuilder = (basePath: string) => {
  return (params?: { path?: PathParams; query?: QueryParams }) => {
    let path = basePath;

    if (params?.path) {
      // Replace path parameters
      Object.entries(params.path).forEach(([key, value]) => {
        path = path.replace(`[${key}]`, String(value));
      });
    }

    if (params?.query) {
      // Add query parameters
      const searchParams = new URLSearchParams();
      Object.entries(params.query).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      path += `?${searchParams.toString()}`;
    }

    return path;
  };
};

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
  createDesign: createRouteBuilder("/ustvari-motiv"),
} as const;

export default ROUTES;
