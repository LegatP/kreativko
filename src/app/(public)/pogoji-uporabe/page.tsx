export default function PogojiUporabePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Pogoji uporabe
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Datum veljavnosti: {new Date().toLocaleDateString("sl-SI")}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Splošne določbe
              </h2>
              <p className="text-gray-700 mb-4">
                Ti pogoji uporabe urejajo dostop in uporabo spletne strani za
                personalizacijo majic. Z uporabo naše storitve se strinjate s
                temi pogoji.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Storitve
              </h2>
              <p className="text-gray-700 mb-4">
                Naša storitev omogoča personalizacijo majic z različnimi dizajni
                in barvami. Izdelke proizvajamo po naročilu in jih dostavimo na
                vaš naslov.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Naročila in plačila
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Vsa naročila so zavezujoča po potrditvi plačila</li>
                <li>Cene vključujejo DDV</li>
                <li>Dostava je brezplačna za naročila nad €50</li>
                <li>Plačilo je možno s kreditno kartico ali PayPal</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Dostava
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Dostava po Sloveniji: 3-5 delovnih dni</li>
                <li>Dostava v tujino: 7-14 delovnih dni</li>
                <li>Stroški dostave: €4,99 za naročila pod €50</li>
                <li>Dostavimo na naslov, ki ga navedete ob naročilu</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Vračila in reklamacije
              </h2>
              <p className="text-gray-700 mb-4">
                Zaradi personalizirane narave izdelkov vračila niso možna, razen
                v primerih:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Napaka v proizvodnji</li>
                <li>Poškodba med transportom</li>
                <li>Napačen izdelek</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Reklamacije sprejemamo v 14 dneh od prejema. Kontaktirajte nas
                na info@mojamajica.si.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Avtorske pravice
              </h2>
              <p className="text-gray-700 mb-4">
                Vsi dizajni in vsebina na spletni strani so zaščiteni z
                avtorskimi pravicami. Prepovedana je uporaba brez dovoljenja.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Omejitev odgovornosti
              </h2>
              <p className="text-gray-700 mb-4">
                Naša odgovornost je omejena na vrednost naročila. Ne odgovarjamo
                za posredne ali posledične škode.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Kakovost izdelkov
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Uporabljamo 100% bombažne majice višje kakovosti</li>
                <li>Digitalni tisk je obstojen in kakovosten</li>
                <li>Barve se lahko rahlo razlikujejo od prikaza na zaslonu</li>
                <li>Priporočamo pranje pri 30°C</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Prekinitev storitve
              </h2>
              <p className="text-gray-700 mb-4">
                Pridržujemo si pravico do prekinitve ali omejitve dostopa do
                storitve brez predhodnega obvestila.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Reševanje sporov
              </h2>
              <p className="text-gray-700 mb-4">
                Za reševanje sporov je pristojno slovensko pravo in sodišča v
                Ljubljani. Poskušamo rešiti vse spore po mirni poti.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Kontakt
              </h2>
              <p className="text-gray-700">
                Za vprašanja glede teh pogojev nas kontaktirajte:
                <br />
                E-pošta: info@mojamajica.si
                <br />
                Telefon: +386 1 234 5678
                <br />
                Naslov: Slovenska ulica 1, 1000 Ljubljana
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
