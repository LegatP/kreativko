import Link from "next/link";
import Image from "next/image";

const products = [
  {
    id: "sadez-zelenjava",
    name: "Sadež/Zelenjava Motiv",
    description:
      "Personaliziraj svojo majico z unikatnim motivom sadja ali zelenjave",
    price: 29.99,
    image: "/images/majica-sadez-zelenjava.jpg",
    defaultText: "Jem jabolka",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Ustvari svojo unikatno majico
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Personaliziraj majice z našimi ekskluzivnimi dizajni. Enostavno,
            hitro in z vrhunsko kakovostjo.
          </p>
          <Link
            href="#produkti"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Začni personalizacijo
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section id="produkti" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Naši dizajni
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {/* Fallback design preview */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                      <div className="text-lg font-bold text-gray-800">
                        {product.defaultText}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      €{product.price}
                    </span>
                    <Link
                      href="/moja-majica"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Personaliziraj
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Zakaj izbrati nas?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Enostavno personaliziranje
              </h3>
              <p className="text-gray-600">
                Intuitivno orodje za prilagajanje dizajna
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vrhunska kakovost</h3>
              <p className="text-gray-600">
                100% bombažne majice z dolgotrajnim tiskom
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hitra dostava</h3>
              <p className="text-gray-600">
                Dostava v 3-5 delovnih dneh po Sloveniji
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Moja Majica</h3>
              <p className="text-gray-400">
                Personalizirane majice z edinstvenim dizajnom. Kakovost in stil
                v enem.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <div className="text-gray-400 space-y-2">
                <p>E-pošta: info@mojamajica.si</p>
                <p>Telefon: +386 1 234 5678</p>
                <p>Naslov: Slovenska ulica 1, 1000 Ljubljana</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Pravne informacije</h3>
              <div className="space-y-2">
                <Link
                  href="/politika-zasebnosti"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Politika zasebnosti
                </Link>
                <Link
                  href="/pogoji-uporabe"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Pogoji uporabe
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Moja Majica. Vse pravice pridržane.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
