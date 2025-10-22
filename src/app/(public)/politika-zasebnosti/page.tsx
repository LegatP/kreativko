export default function PolitikaZasebnostiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Politika zasebnosti
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Datum veljavnosti: {new Date().toLocaleDateString("sl-SI")}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Uvod
              </h2>
              <p className="text-gray-700 mb-4">
                Ta politika zasebnosti opisuje, kako zbiramo, uporabljamo in
                varujemo vaše osebne podatke, ko uporabljate našo spletno stran
                za personalizacijo majic.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Zbiranje podatkov
              </h2>
              <p className="text-gray-700 mb-4">
                Zbiramo naslednje vrste podatkov:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Ime in priimek</li>
                <li>E-poštni naslov</li>
                <li>Naslov za dostavo</li>
                <li>Telefonska številka</li>
                <li>Informacije o naročilu in personalizaciji</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Uporaba podatkov
              </h2>
              <p className="text-gray-700 mb-4">Vaše podatke uporabljamo za:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Obdelavo in dostavo naročil</li>
                <li>Komunikacijo glede naročila</li>
                <li>Izboljšanje naših storitev</li>
                <li>Izpolnjevanje zakonskih obveznosti</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Deljenje podatkov
              </h2>
              <p className="text-gray-700 mb-4">
                Vaših podatkov ne delimo s tretjimi osebami, razen v naslednjih
                primerih:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Za dostavo naročil (poštni operaterji)</li>
                <li>Za obdelavo plačil (plačilni procesorji)</li>
                <li>Kadar to zahteva zakon</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Varovanje podatkov
              </h2>
              <p className="text-gray-700 mb-4">
                Uporabljamo ustrezne tehnične in organizacijske ukrepe za
                zaščito vaših osebnih podatkov pred nepooblaščenim dostopom,
                spremembo, razkritjem ali uničenjem.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Vaše pravice
              </h2>
              <p className="text-gray-700 mb-4">Imate pravico do:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Dostopa do svojih osebnih podatkov</li>
                <li>Popravka netočnih podatkov</li>
                <li>Izbris podatkov</li>
                <li>Omejitve obdelave</li>
                <li>Prenosljivosti podatkov</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Piškotki
              </h2>
              <p className="text-gray-700 mb-4">
                Naša spletna stran uporablja piškotke za izboljšanje uporabniške
                izkušnje in analitiko. Uporabo piškotkov lahko upravljate v
                nastavitvah brskalnika.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Kontakt
              </h2>
              <p className="text-gray-700 mb-4">
                Za vprašanja glede te politike zasebnosti nas kontaktirajte na:
              </p>
              <p className="text-gray-700">
                E-pošta: info@mojamajica.si
                <br />
                Telefon: +386 1 234 5678
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Spremembe politike
              </h2>
              <p className="text-gray-700">
                Pridržujemo si pravico do spremembe te politike zasebnosti. O
                vseh spremembah vas bomo obvestili preko spletne strani.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
