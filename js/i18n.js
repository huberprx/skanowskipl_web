(function () {
  var STORAGE = "skanowski-lang";
  var ALIAS = { nb: "no", nn: "no" };
  var LANG_META = [
    { id: "pl", name: "Polski" },
    { id: "en", name: "English" },
    { id: "de", name: "Deutsch" },
    { id: "cs", name: "Čeština" },
    { id: "sk", name: "Slovenčina" },
    { id: "hu", name: "Magyar" },
    { id: "sv", name: "Svenska" },
    { id: "no", name: "Norsk" },
    { id: "da", name: "Dansk" },
    { id: "fr", name: "Français" },
    { id: "es", name: "Español" },
    { id: "pt", name: "Português" },
    { id: "it", name: "Italiano" },
    { id: "el", name: "Ελληνικά" },
    { id: "tr", name: "Türkçe" },
  ];
  var LANGS = LANG_META.map(function (item) {
    return item.id;
  });
  var listeners = [];

  var TIMEZONES = {
    "Europe/Warsaw": "pl",
    "Europe/Berlin": "de",
    "Europe/Vienna": "de",
    "Europe/Paris": "fr",
    "Europe/Monaco": "fr",
    "Indian/Reunion": "fr",
    "America/Martinique": "fr",
    "America/Guadeloupe": "fr",
    "America/Cayenne": "fr",
    "Pacific/Noumea": "fr",
    "Pacific/Tahiti": "fr",
    "Africa/Casablanca": "fr",
    "Africa/Abidjan": "fr",
    "Africa/Dakar": "fr",
    "Africa/Bamako": "fr",
    "Africa/Conakry": "fr",
    "Africa/Douala": "fr",
    "Africa/Libreville": "fr",
    "Africa/Brazzaville": "fr",
    "Africa/Kinshasa": "fr",
    "Africa/Lubumbashi": "fr",
    "Africa/Lome": "fr",
    "Africa/Porto-Novo": "fr",
    "Africa/Niamey": "fr",
    "Africa/Ouagadougou": "fr",
    "Africa/Tunis": "fr",
    "Africa/Algiers": "fr",
    "Europe/Madrid": "es",
    "Atlantic/Canary": "es",
    "Africa/Ceuta": "es",
    "America/Mexico_City": "es",
    "America/Cancun": "es",
    "America/Merida": "es",
    "America/Monterrey": "es",
    "America/Tijuana": "es",
    "America/Chihuahua": "es",
    "America/Hermosillo": "es",
    "America/Mazatlan": "es",
    "America/Bogota": "es",
    "America/Lima": "es",
    "America/Guayaquil": "es",
    "America/La_Paz": "es",
    "America/Asuncion": "es",
    "America/Caracas": "es",
    "America/Santiago": "es",
    "America/Punta_Arenas": "es",
    "America/Argentina/Buenos_Aires": "es",
    "America/Argentina/Cordoba": "es",
    "America/Argentina/Mendoza": "es",
    "America/Argentina/Salta": "es",
    "America/Montevideo": "es",
    "America/Havana": "es",
    "America/Santo_Domingo": "es",
    "America/Puerto_Rico": "es",
    "America/Panama": "es",
    "America/Costa_Rica": "es",
    "America/Guatemala": "es",
    "America/El_Salvador": "es",
    "America/Tegucigalpa": "es",
    "America/Managua": "es",
    "Europe/Stockholm": "sv",
    "Europe/Oslo": "no",
    "Arctic/Longyearbyen": "no",
    "Europe/Copenhagen": "da",
    "Europe/Prague": "cs",
    "Europe/Bratislava": "sk",
    "Europe/Budapest": "hu",
    "Europe/Rome": "it",
    "Europe/Vatican": "it",
    "Europe/San_Marino": "it",
    "Europe/Lisbon": "pt",
    "Atlantic/Azores": "pt",
    "Atlantic/Madeira": "pt",
    "America/Sao_Paulo": "pt",
    "America/Fortaleza": "pt",
    "America/Recife": "pt",
    "America/Bahia": "pt",
    "America/Belem": "pt",
    "America/Manaus": "pt",
    "America/Noronha": "pt",
    "Europe/Athens": "el",
    "Europe/Istanbul": "tr",
    "Europe/London": "en",
    "Europe/Dublin": "en",
    "Europe/Guernsey": "en",
    "Europe/Isle_of_Man": "en",
    "Europe/Jersey": "en",
    "Europe/Amsterdam": "en",
    "America/New_York": "en",
    "America/Chicago": "en",
    "America/Denver": "en",
    "America/Los_Angeles": "en",
    "America/Phoenix": "en",
    "America/Anchorage": "en",
    "Pacific/Honolulu": "en",
    "America/Toronto": "en",
    "America/Vancouver": "en",
    "America/Halifax": "en",
    "America/Winnipeg": "en",
    "America/Edmonton": "en",
    "Australia/Sydney": "en",
    "Australia/Melbourne": "en",
    "Australia/Brisbane": "en",
    "Australia/Perth": "en",
    "Australia/Adelaide": "en",
    "Pacific/Auckland": "en",
    "Africa/Johannesburg": "en",
  };

  var MIXED_COUNTRY = { CH: 1, BE: 1, LU: 1, CA: 1, FI: 1, CY: 1 };
  var COUNTRY_LANG = {
    PL: "pl",
    DE: "de",
    AT: "de",
    LI: "de",
    FR: "fr",
    MC: "fr",
    SN: "fr",
    CI: "fr",
    ML: "fr",
    BF: "fr",
    NE: "fr",
    GN: "fr",
    TG: "fr",
    BJ: "fr",
    CM: "fr",
    GA: "fr",
    CG: "fr",
    CD: "fr",
    MG: "fr",
    HT: "fr",
    TD: "fr",
    CF: "fr",
    DJ: "fr",
    KM: "fr",
    BI: "fr",
    ES: "es",
    MX: "es",
    GT: "es",
    HN: "es",
    SV: "es",
    NI: "es",
    CR: "es",
    PA: "es",
    CO: "es",
    VE: "es",
    EC: "es",
    PE: "es",
    BO: "es",
    PY: "es",
    CL: "es",
    AR: "es",
    UY: "es",
    CU: "es",
    DO: "es",
    PR: "es",
    IT: "it",
    SM: "it",
    VA: "it",
    PT: "pt",
    BR: "pt",
    AO: "pt",
    MZ: "pt",
    GW: "pt",
    CV: "pt",
    ST: "pt",
    TL: "pt",
    SE: "sv",
    NO: "no",
    SJ: "no",
    DK: "da",
    FO: "da",
    CZ: "cs",
    SK: "sk",
    HU: "hu",
    GR: "el",
    TR: "tr",
    GB: "en",
    US: "en",
    AU: "en",
    NZ: "en",
    IE: "en",
    IM: "en",
    GG: "en",
    JE: "en",
    ZA: "en",
    NG: "en",
    KE: "en",
    GH: "en",
    UG: "en",
    IN: "en",
    SG: "en",
    PH: "en",
    MT: "en",
  };

  var dict = {
    pl: {
      "meta.title": "Skanowski — wirtualne spacery",
      "meta.description":
        "Wirtualne spacery 360°. Ścieżki dydaktyczne na Mapach Google. Skanowski.",
      "nav.lang": "Język",
      "nav.menuOpen": "Otwórz menu",
      "nav.menuClose": "Zamknij menu",
      "nav.booking": "Rezerwacja",
      "nav.contact": "Kontakt",
      "figure.aria": "Przewodnik ścieżki — przeciągnij, aby przewinąć stronę",
      "hero.alt": "Jesienna droga i drzewo",
      "hero.sub":
        "Wirtualne spacery ścieżek dydaktycznych, obiektów turystycznych i natury — na Mapach Google.",
      "practice.kicker": "01 — Główna korzyść",
      "practice.title":
        "Wirtualne spacery na Mapach Google.<br />Raz zrobione — zostają na zawsze.<br /><em>Bez dodatkowych kosztów.</em>",
      "note.body":
        "Zanim ruszysz, wiesz już, dokąd idziesz<br />i na co się przygotować.<br /><em>A gdy się zgubisz — zawsze się odnajdziesz.</em>",
      "survey.iframe": "Wirtualny spacer na Mapach Google",
      "survey.drag": "idź strzałkami · rozglądaj się",
      "maps.link": "Mapy Google ↗",
      "survey.kicker": "02 — Spacer",
      "survey.title": "Tak wygląda spacer.",
      "survey.lead":
        "Jesienna droga, Nadleśnictwo Zielona Góra. Ten sam las, który potem otworzysz w Mapach — tu możesz iść pierwszy raz.",
      "plate.bukowka.iframe": "Ścieżka Nad Bukówką — wirtualny spacer",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "Pomost nad jeziorem na ścieżce przyrodniczo-leśnej „Nad Bukówką”. Nadleśnictwo Trzcianka. Wejdź na kładkę i idź dalej strzałkami.",
      "plate.tablica.iframe": "Tablica Grzyby, ścieżka Do wieży",
      "plate.tablica.title": "Czytelna tablica.",
      "plate.tablica.body":
        "Tablica na ścieżce „Do wieży”. Zdjęcie sferyczne montuję, a samą tablicę fotografuję osobnym ujęciem — żeby napis był ostry i miał możliwie najwyższą jakość.",
      "booking.kicker": "03 — Rezerwacja",
      "booking.title": "Zarezerwuj już termin.",
      "booking.lead":
        "Najpiękniejsze zdjęcia wychodzą wczesną wiosną, latem i jesienią. Jeśli zależy Ci na aurze zimowej — też jestem otwarty i z przyjemnością podejmę się tego wyzwania.",
      "booking.iframe": "Rezerwacja terminu",
      "contact.kicker": "04 — Kontakt",
      "contact.title": "Napisz lub zadzwoń.",
      "contact.email": "E-mail",
      "contact.phone": "Telefon",
      "contact.reveal": "Kliknij, by zobaczyć",
    },
    en: {
      "meta.title": "Skanowski — virtual walks",
      "meta.description":
        "360° virtual walks. Educational trails on Google Maps. Skanowski.",
      "nav.lang": "Language",
      "nav.menuOpen": "Open menu",
      "nav.menuClose": "Close menu",
      "nav.booking": "Booking",
      "nav.contact": "Contact",
      "figure.aria": "Path guide — drag to scroll the page",
      "hero.alt": "Autumn road and a tree",
      "hero.sub":
        "Virtual walks of educational trails, tourist sites, and nature — on Google Maps.",
      "practice.kicker": "01 — Main benefit",
      "practice.title":
        "Virtual walks on Google Maps.<br />Made once — they stay forever.<br /><em>No extra costs.</em>",
      "note.body":
        "Before you set off, you already know where you’re going<br />and what to prepare for.<br /><em>And if you get lost — you’ll always find your way.</em>",
      "survey.iframe": "Virtual walk on Google Maps",
      "survey.drag": "follow the arrows · look around",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Walk",
      "survey.title": "This is what a walk looks like.",
      "survey.lead":
        "An autumn road, Zielona Góra Forest District. The same forest you’ll later open in Maps — here you can walk it for the first time.",
      "plate.bukowka.iframe": "Nad Bukówką trail — virtual walk",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "A pier on the lake along the “Nad Bukówką” nature trail. Trzcianka Forest District. Step onto the boardwalk and keep going with the arrows.",
      "plate.tablica.iframe": "Fungi board, Do wieży trail",
      "plate.tablica.title": "A readable board.",
      "plate.tablica.body":
        "A board on the “Do wieży” trail. I stitch the photosphere, and I photograph the board itself in a separate shot — so the text stays sharp and as high-quality as possible.",
      "booking.kicker": "03 — Booking",
      "booking.title": "Book a date already.",
      "booking.lead":
        "The most beautiful photos come in early spring, summer, and autumn. If you want a winter mood — I’m open to that too, and I’ll gladly take on the challenge.",
      "booking.iframe": "Book a date",
      "contact.kicker": "04 — Contact",
      "contact.title": "Write or call.",
      "contact.email": "Email",
      "contact.phone": "Phone",
      "contact.reveal": "Click to reveal",
    },
    de: {
      "meta.title": "Skanowski — virtuelle Spaziergänge",
      "meta.description":
        "360°-Rundgänge. Lehrpfade auf Google Maps. Skanowski.",
      "nav.lang": "Sprache",
      "nav.menuOpen": "Menü öffnen",
      "nav.menuClose": "Menü schließen",
      "nav.booking": "Buchung",
      "nav.contact": "Kontakt",
      "figure.aria": "Pfadführer — ziehen, um die Seite zu scrollen",
      "hero.alt": "Herbststraße und ein Baum",
      "hero.sub":
        "Virtuelle Spaziergänge auf Lehrpfaden, zu Ausflugszielen und in der Natur — auf Google Maps.",
      "practice.kicker": "01 — Der Hauptvorteil",
      "practice.title":
        "Virtuelle Spaziergänge auf Google Maps.<br />Einmal gemacht — sie bleiben für immer.<br /><em>Ohne Zusatzkosten.</em>",
      "note.body":
        "Bevor du losgehst, weißt du schon, wohin der Weg führt<br />und worauf du dich einstellen solltest.<br /><em>Und wenn du dich verläufst — findest du immer wieder hin.</em>",
      "survey.iframe": "Virtueller Spaziergang auf Google Maps",
      "survey.drag": "Pfeilen folgen · umsehen",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Rundgang",
      "survey.title": "So sieht ein Spaziergang aus.",
      "survey.lead":
        "Eine Herbststraße, Forstamt Zielona Góra. Derselbe Wald, den du später in Maps öffnest — hier kannst du ihn zum ersten Mal gehen.",
      "plate.bukowka.iframe": "Pfad Nad Bukówką — virtueller Spaziergang",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "Ein Steg am See auf dem Naturlehrpfad „Nad Bukówką“. Forstamt Trzcianka. Tritt auf den Steg und folge den Pfeilen.",
      "plate.tablica.iframe": "Pilztafel, Pfad Do wieży",
      "plate.tablica.title": "Ein lesbares Schild.",
      "plate.tablica.body":
        "Ein Schild auf dem Pfad „Do wieży“. Die Photosphäre setze ich zusammen, das Schild fotografiere ich extra — damit die Schrift scharf bleibt und so hochwertig wie möglich.",
      "booking.kicker": "03 — Buchung",
      "booking.title": "Termin gleich buchen.",
      "booking.lead":
        "Die schönsten Aufnahmen entstehen im Vorfrühling, Sommer und Herbst. Wenn dir an Winterstimmung liegt — auch das mache ich gern.",
      "booking.iframe": "Termin buchen",
      "contact.kicker": "04 — Kontakt",
      "contact.title": "Schreiben oder anrufen.",
      "contact.email": "E-Mail",
      "contact.phone": "Telefon",
      "contact.reveal": "Klicken zum Anzeigen",
    },
    es: {
      "meta.title": "Skanowski — paseos virtuales",
      "meta.description":
        "Paseos virtuales 360°. Senderos didácticos en Google Maps. Skanowski.",
      "nav.lang": "Idioma",
      "nav.menuOpen": "Abrir menú",
      "nav.menuClose": "Cerrar menú",
      "nav.booking": "Reserva",
      "nav.contact": "Contacto",
      "figure.aria": "Guía del sendero — arrastra para desplazarte por la página",
      "hero.alt": "Camino otoñal y un árbol",
      "hero.sub":
        "Paseos virtuales por senderos didácticos, lugares turísticos y la naturaleza — en Google Maps.",
      "practice.kicker": "01 — Beneficio principal",
      "practice.title":
        "Paseos virtuales en Google Maps.<br />Hechos una vez — se quedan para siempre.<br /><em>Sin costes adicionales.</em>",
      "note.body":
        "Antes de salir, ya sabes adónde vas<br />y a qué prepararte.<br /><em>Y si te pierdes — siempre darás con el camino.</em>",
      "survey.iframe": "Paseo virtual en Google Maps",
      "survey.drag": "sigue las flechas · mira a tu alrededor",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Paseo",
      "survey.title": "Así se ve un paseo.",
      "survey.lead":
        "Un camino otoñal, Distrito Forestal de Zielona Góra. El mismo bosque que luego abrirás en Maps — aquí puedes recorrerlo por primera vez.",
      "plate.bukowka.iframe": "Sendero Nad Bukówką — paseo virtual",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "Un embarcadero sobre el lago en el sendero natural «Nad Bukówką». Distrito Forestal de Trzcianka. Entra en la pasarela y sigue con las flechas.",
      "plate.tablica.iframe": "Panel de hongos, sendero Do wieży",
      "plate.tablica.title": "Un panel legible.",
      "plate.tablica.body":
        "Un panel en el sendero «Do wieży». Monto la foto esférica y fotografío el panel por separado — para que el texto quede nítido y con la mayor calidad posible.",
      "booking.kicker": "03 — Reserva",
      "booking.title": "Reserva ya una fecha.",
      "booking.lead":
        "Las fotos más bonitas salen a principios de primavera, en verano y en otoño. Si te importa el ambiente invernal — también estoy abierto y acepto el reto con gusto.",
      "booking.iframe": "Reserva de fecha",
      "contact.kicker": "04 — Contacto",
      "contact.title": "Escribe o llama.",
      "contact.email": "Correo",
      "contact.phone": "Teléfono",
      "contact.reveal": "Haz clic para ver",
    },
    fr: {
      "meta.title": "Skanowski — promenades virtuelles",
      "meta.description":
        "Promenades virtuelles 360°. Sentiers pédagogiques sur Google Maps. Skanowski.",
      "nav.lang": "Langue",
      "nav.menuOpen": "Ouvrir le menu",
      "nav.menuClose": "Fermer le menu",
      "nav.booking": "Réservation",
      "nav.contact": "Contact",
      "figure.aria":
        "Guide du sentier — faites glisser pour faire défiler la page",
      "hero.alt": "Route d’automne et un arbre",
      "hero.sub":
        "Promenades virtuelles sur sentiers pédagogiques, sites touristiques et nature — sur Google Maps.",
      "practice.kicker": "01 — L’avantage principal",
      "practice.title":
        "Promenades virtuelles sur Google Maps.<br />Faites une fois — elles restent pour toujours.<br /><em>Sans frais supplémentaires.</em>",
      "note.body":
        "Avant de partir, vous savez déjà où vous allez<br />et à quoi vous préparer.<br /><em>Et si vous vous perdez — vous retrouverez toujours votre chemin.</em>",
      "survey.iframe": "Promenade virtuelle sur Google Maps",
      "survey.drag": "suivez les flèches · regardez autour",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Promenade",
      "survey.title": "Voici à quoi ressemble une promenade.",
      "survey.lead":
        "Une route d’automne, district forestier de Zielona Góra. La même forêt que vous ouvrirez ensuite dans Maps — ici, vous pouvez la parcourir pour la première fois.",
      "plate.bukowka.iframe": "Sentier Nad Bukówką — promenade virtuelle",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "Un ponton sur le lac, sur le sentier nature « Nad Bukówką ». District forestier de Trzcianka. Avancez sur la passerelle et continuez avec les flèches.",
      "plate.tablica.iframe": "Panneau champignons, sentier Do wieży",
      "plate.tablica.title": "Un panneau lisible.",
      "plate.tablica.body":
        "Un panneau sur le sentier « Do wieży ». Je monte la photosphère, et je photographie le panneau à part — pour que le texte reste net, avec la meilleure qualité possible.",
      "booking.kicker": "03 — Réservation",
      "booking.title": "Réservez déjà une date.",
      "booking.lead":
        "Les plus belles photos se font au début du printemps, en été et en automne. Si l’ambiance hivernale vous tient à cœur — je suis aussi ouvert et je relèverai le défi avec plaisir.",
      "booking.iframe": "Réservation de date",
      "contact.kicker": "04 — Contact",
      "contact.title": "Écrivez ou appelez.",
      "contact.email": "E-mail",
      "contact.phone": "Téléphone",
      "contact.reveal": "Cliquez pour afficher",
    },
    sv: {
      "meta.title": "Skanowski — virtuella promenader",
      "meta.description":
        "360° virtuella promenader. Naturstigar på Google Maps. Skanowski.",
      "nav.lang": "Språk",
      "nav.menuOpen": "Öppna menyn",
      "nav.menuClose": "Stäng menyn",
      "nav.booking": "Bokning",
      "nav.contact": "Kontakt",
      "figure.aria": "Stigguide — dra för att rulla sidan",
      "hero.alt": "Höstväg och ett träd",
      "hero.sub":
        "Virtuella promenader längs naturstigar, turistmål och natur — på Google Maps.",
      "practice.kicker": "01 — Huvudfördelen",
      "practice.title":
        "Virtuella promenader på Google Maps.<br />Gjorda en gång — de finns kvar för alltid.<br /><em>Inga extra kostnader.</em>",
      "note.body":
        "Innan du ger dig av vet du redan vart du är på väg<br />och vad du ska förbereda dig på.<br /><em>Och om du går vilse — hittar du alltid tillbaka.</em>",
      "survey.iframe": "Virtuell promenad på Google Maps",
      "survey.drag": "följ pilarna · se dig omkring",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Promenad",
      "survey.title": "Så här ser en promenad ut.",
      "survey.lead":
        "En höstväg, skogsdistriktet Zielona Góra. Samma skog som du senare öppnar i Maps — här kan du gå den för första gången.",
      "plate.bukowka.iframe": "Stigen Nad Bukówką — virtuell promenad",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "En brygga vid sjön längs naturstigen „Nad Bukówką”. Skogsdistriktet Trzcianka. Kliv ut på spången och fortsätt med pilarna.",
      "plate.tablica.iframe": "Svamptavla, stigen Do wieży",
      "plate.tablica.title": "En läsbar tavla.",
      "plate.tablica.body":
        "En tavla på stigen „Do wieży”. Jag sätter ihop fotosphären och fotograferar själva tavlan separat — så att texten blir skarp och så hög kvalitet som möjligt.",
      "booking.kicker": "03 — Bokning",
      "booking.title": "Boka redan ett datum.",
      "booking.lead":
        "De vackraste bilderna blir tidig vår, sommar och höst. Om du vill ha vinterstämning — är jag öppen för det också och tar gärna uppdraget.",
      "booking.iframe": "Boka datum",
      "contact.kicker": "04 — Kontakt",
      "contact.title": "Skriv eller ring.",
      "contact.email": "E-post",
      "contact.phone": "Telefon",
      "contact.reveal": "Klicka för att visa",
    },
    no: {
      "meta.title": "Skanowski — virtuelle turer",
      "meta.description":
        "360° virtuelle turer. Naturstier på Google Maps. Skanowski.",
      "nav.lang": "Språk",
      "nav.menuOpen": "Åpne menyen",
      "nav.menuClose": "Lukk menyen",
      "nav.booking": "Bestilling",
      "nav.contact": "Kontakt",
      "figure.aria": "Stiguide — dra for å rulle siden",
      "hero.alt": "Høstvei og et tre",
      "hero.sub":
        "Virtuelle turer langs naturstier, turistmål og natur — på Google Maps.",
      "practice.kicker": "01 — Hovedfordelen",
      "practice.title":
        "Virtuelle turer på Google Maps.<br />Laget én gang — de blir værende for alltid.<br /><em>Ingen ekstra kostnader.</em>",
      "note.body":
        "Før du drar, vet du allerede hvor du skal<br />og hva du skal forberede deg på.<br /><em>Og hvis du går deg vill — finner du alltid frem igjen.</em>",
      "survey.iframe": "Virtuell tur på Google Maps",
      "survey.drag": "følg pilene · se deg rundt",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Tur",
      "survey.title": "Slik ser en tur ut.",
      "survey.lead":
        "En høstvei, skogdistriktet Zielona Góra. Den samme skogen du senere åpner i Maps — her kan du gå den for første gang.",
      "plate.bukowka.iframe": "Stien Nad Bukówką — virtuell tur",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "En brygge ved innsjøen langs naturstien „Nad Bukówką”. Skogdistriktet Trzcianka. Gå ut på planken og fortsett med pilene.",
      "plate.tablica.iframe": "Soppskilt, stien Do wieży",
      "plate.tablica.title": "Et lesbart skilt.",
      "plate.tablica.body":
        "Et skilt på stien „Do wieży”. Jeg setter sammen fotosfæren og fotograferer selve skiltet separat — så teksten blir skarp og med høyest mulig kvalitet.",
      "booking.kicker": "03 — Bestilling",
      "booking.title": "Bestill allerede en dato.",
      "booking.lead":
        "De vakreste bildene blir tidlig vår, sommer og høst. Hvis du vil ha vinterstemning — er jeg åpen for det også, og tar gjerne oppdraget.",
      "booking.iframe": "Bestill dato",
      "contact.kicker": "04 — Kontakt",
      "contact.title": "Skriv eller ring.",
      "contact.email": "E-post",
      "contact.phone": "Telefon",
      "contact.reveal": "Klikk for å vise",
    },
    da: {
      "meta.title": "Skanowski — virtuelle vandringer",
      "meta.description":
        "360° virtuelle vandringer. Naturstier på Google Maps. Skanowski.",
      "nav.lang": "Sprog",
      "nav.menuOpen": "Åbn menuen",
      "nav.menuClose": "Luk menuen",
      "nav.booking": "Booking",
      "nav.contact": "Kontakt",
      "figure.aria": "Stiguide — træk for at rulle siden",
      "hero.alt": "Efterårsvej og et træ",
      "hero.sub":
        "Virtuelle vandringer langs naturstier, turiststeder og natur — på Google Maps.",
      "practice.kicker": "01 — Den største fordel",
      "practice.title":
        "Virtuelle vandringer på Google Maps.<br />Lavet én gang — de bliver for evigt.<br /><em>Ingen ekstra omkostninger.</em>",
      "note.body":
        "Før du tager afsted, ved du allerede, hvor du skal hen<br />og hvad du skal forberede dig på.<br /><em>Og hvis du farer vild — finder du altid vej igen.</em>",
      "survey.iframe": "Virtuel vandring på Google Maps",
      "survey.drag": "følg pilene · kig rundt",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Vandring",
      "survey.title": "Sådan ser en vandring ud.",
      "survey.lead":
        "En efterårsvej, skovdistriktet Zielona Góra. Den samme skov, du senere åbner i Maps — her kan du gå den for første gang.",
      "plate.bukowka.iframe": "Stien Nad Bukówką — virtuel vandring",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "En badebro ved søen langs naturstien „Nad Bukówką”. Skovdistriktet Trzcianka. Træd ud på broen og fortsæt med pilene.",
      "plate.tablica.iframe": "Svampetavle, stien Do wieży",
      "plate.tablica.title": "En læsbar tavle.",
      "plate.tablica.body":
        "En tavle på stien „Do wieży”. Jeg samler fotosphæren og fotograferer selve tavlen separat — så teksten bliver skarp og i højest mulig kvalitet.",
      "booking.kicker": "03 — Booking",
      "booking.title": "Book allerede en dato.",
      "booking.lead":
        "De smukkeste billeder bliver tidligt forår, sommer og efterår. Hvis du ønsker vinterstemning — er jeg også åben for det og tager gerne opgaven.",
      "booking.iframe": "Book dato",
      "contact.kicker": "04 — Kontakt",
      "contact.title": "Skriv eller ring.",
      "contact.email": "E-mail",
      "contact.phone": "Telefon",
      "contact.reveal": "Klik for at vise",
    },
    cs: {
      "meta.title": "Skanowski — virtuální procházky",
      "meta.description":
        "Virtuální procházky 360°. Naučné stezky na Google Maps. Skanowski.",
      "nav.lang": "Jazyk",
      "nav.menuOpen": "Otevřít menu",
      "nav.menuClose": "Zavřít menu",
      "nav.booking": "Rezervace",
      "nav.contact": "Kontakt",
      "figure.aria": "Průvodce stezkou — přetáhněte pro posun stránky",
      "hero.alt": "Podzimní cesta a strom",
      "hero.sub":
        "Virtuální procházky naučnými stezkami, turistickými místy a přírodou — na Google Maps.",
      "practice.kicker": "01 — Hlavní výhoda",
      "practice.title":
        "Virtuální procházky na Google Maps.<br />Jednou vytvořené — zůstanou navždy.<br /><em>Bez dalších nákladů.</em>",
      "note.body":
        "Než vyrazíte, už víte, kam jdete<br />a na co se připravit.<br /><em>A když zabloudíte — vždy se najdete.</em>",
      "survey.iframe": "Virtuální procházka na Google Maps",
      "survey.drag": "jdi šipkami · rozhlížej se",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Procházka",
      "survey.title": "Tak vypadá procházka.",
      "survey.lead":
        "Podzimní cesta, Lesní správa Zielona Góra. Stejný les, který později otevřeš v Maps — tady ho můžeš projít poprvé.",
      "plate.bukowka.iframe": "Stezka Nad Bukówką — virtuální procházka",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "Molo u jezera na přírodní stezce „Nad Bukówką”. Lesní správa Trzcianka. Vstup na lávku a pokračuj šipkami.",
      "plate.tablica.iframe": "Tabule Houby, stezka Do wieży",
      "plate.tablica.title": "Čitelná tabule.",
      "plate.tablica.body":
        "Tabule na stezce „Do wieży”. Sférický snímek skládám a samotnou tabuli fotím zvlášť — aby nápis byl ostrý a v co nejvyšší kvalitě.",
      "booking.kicker": "03 — Rezervace",
      "booking.title": "Rezervujte si termín.",
      "booking.lead":
        "Nejkrásnější fotky vznikají brzy na jaře, v létě a na podzim. Pokud vám záleží na zimní náladě — jsem otevřený i tomu a rád se toho ujmu.",
      "booking.iframe": "Rezervace termínu",
      "contact.kicker": "04 — Kontakt",
      "contact.title": "Napište nebo zavolejte.",
      "contact.email": "E-mail",
      "contact.phone": "Telefon",
      "contact.reveal": "Klikněte pro zobrazení",
    },
    sk: {
      "meta.title": "Skanowski — virtuálne prechádzky",
      "meta.description":
        "Virtuálne prechádzky 360°. Náučné chodníky na Google Maps. Skanowski.",
      "nav.lang": "Jazyk",
      "nav.menuOpen": "Otvoriť menu",
      "nav.menuClose": "Zavrieť menu",
      "nav.booking": "Rezervácia",
      "nav.contact": "Kontakt",
      "figure.aria": "Sprievodca chodníkom — potiahnite na posun stránky",
      "hero.alt": "Jesenná cesta a strom",
      "hero.sub":
        "Virtuálne prechádzky náučnými chodníkmi, turistickými miestami a prírodou — na Google Maps.",
      "practice.kicker": "01 — Hlavná výhoda",
      "practice.title":
        "Virtuálne prechádzky na Google Maps.<br />Raz urobené — ostanú navždy.<br /><em>Bez ďalších nákladov.</em>",
      "note.body":
        "Predtým, ako vyrazíte, už viete, kam idete<br />a na čo sa pripraviť.<br /><em>A keď zablúdite — vždy sa nájdete.</em>",
      "survey.iframe": "Virtuálna prechádzka na Google Maps",
      "survey.drag": "choď šípkami · rozhliadni sa",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Prechádzka",
      "survey.title": "Tak vyzerá prechádzka.",
      "survey.lead":
        "Jesenná cesta, Lesná správa Zielona Góra. Ten istý les, ktorý potom otvoríš v Maps — tu ho môžeš prejsť prvý raz.",
      "plate.bukowka.iframe": "Chodník Nad Bukówką — virtuálna prechádzka",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "Mólo pri jazere na prírodnom chodníku „Nad Bukówką”. Lesná správa Trzcianka. Vstúp na lávku a pokračuj šípkami.",
      "plate.tablica.iframe": "Tabuľa Huby, chodník Do wieży",
      "plate.tablica.title": "Čitateľná tabuľa.",
      "plate.tablica.body":
        "Tabuľa na chodníku „Do wieży”. Sférickú snímku skladám a samotnú tabuľu fotím osobitne — aby nápis bol ostrý a v čo najvyššej kvalite.",
      "booking.kicker": "03 — Rezervácia",
      "booking.title": "Rezervujte si termín.",
      "booking.lead":
        "Najkrajšie fotky vznikajú skoro na jar, v lete a na jeseň. Ak vám záleží na zimnej nálade — som otvorený aj tomu a rád sa toho ujmem.",
      "booking.iframe": "Rezervácia termínu",
      "contact.kicker": "04 — Kontakt",
      "contact.title": "Napíšte alebo zavolajte.",
      "contact.email": "E-mail",
      "contact.phone": "Telefón",
      "contact.reveal": "Kliknite na zobrazenie",
    },
    hu: {
      "meta.title": "Skanowski — virtuális séták",
      "meta.description":
        "360°-os virtuális séták. Tanösvények a Google Térképen. Skanowski.",
      "nav.lang": "Nyelv",
      "nav.menuOpen": "Menü megnyitása",
      "nav.menuClose": "Menü bezárása",
      "nav.booking": "Foglalás",
      "nav.contact": "Kapcsolat",
      "figure.aria": "Ösvénykalauz — húzza az oldal görgetéséhez",
      "hero.alt": "Őszi út és egy fa",
      "hero.sub":
        "Virtuális séták tanösvényeken, turisztikai helyszíneken és a természetben — a Google Térképen.",
      "practice.kicker": "01 — A fő előny",
      "practice.title":
        "Virtuális séták a Google Térképen.<br />Egyszer elkészülnek — örökre megmaradnak.<br /><em>Nincs pluszköltség.</em>",
      "note.body":
        "Mielőtt elindulna, már tudja, hová megy<br />és mire készüljön.<br /><em>És ha eltéved — mindig megtalálja az utat.</em>",
      "survey.iframe": "Virtuális séta a Google Térképen",
      "survey.drag": "kövesd a nyilakat · nézz körül",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Séta",
      "survey.title": "Így néz ki egy séta.",
      "survey.lead":
        "Őszi út, Zielona Góra erdészet. Ugyanaz az erdő, amelyet később megnyit a Térképen — itt először végigjárhatja.",
      "plate.bukowka.iframe": "Nad Bukówką ösvény — virtuális séta",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "Stég a tónál a „Nad Bukówką” természeti ösvényen. Trzcianka erdészet. Lépjen a stégre, és folytassa a nyilakkal.",
      "plate.tablica.iframe": "Gomba tábla, Do wieży ösvény",
      "plate.tablica.title": "Olvasható tábla.",
      "plate.tablica.body":
        "Tábla a „Do wieży” ösvényen. A fotoszférát összerakom, magát a táblát külön fotózom — hogy a felirat éles legyen, a lehető legjobb minőségben.",
      "booking.kicker": "03 — Foglalás",
      "booking.title": "Foglaljon már időpontot.",
      "booking.lead":
        "A legszebb képek kora tavasszal, nyáron és ősszel készülnek. Ha a téli hangulat a fontos — arra is nyitott vagyok, és szívesen vállalom.",
      "booking.iframe": "Időpontfoglalás",
      "contact.kicker": "04 — Kapcsolat",
      "contact.title": "Írjon vagy hívjon.",
      "contact.email": "E-mail",
      "contact.phone": "Telefon",
      "contact.reveal": "Kattintson a megjelenítéshez",
    },
    tr: {
      "meta.title": "Skanowski — sanal yürüyüşler",
      "meta.description":
        "360° sanal yürüyüşler. Google Haritalar’da eğitim patikaları. Skanowski.",
      "nav.lang": "Dil",
      "nav.menuOpen": "Menüyü aç",
      "nav.menuClose": "Menüyü kapat",
      "nav.booking": "Rezervasyon",
      "nav.contact": "İletişim",
      "figure.aria": "Patika rehberi — sayfayı kaydırmak için sürükleyin",
      "hero.alt": "Sonbahar yolu ve bir ağaç",
      "hero.sub":
        "Eğitim patikalarında, turistik yerlerde ve doğada sanal yürüyüşler — Google Haritalar’da.",
      "practice.kicker": "01 — Temel yarar",
      "practice.title":
        "Google Haritalar’da sanal yürüyüşler.<br />Bir kez yapılır — sonsuza kadar kalır.<br /><em>Ek ücret yok.</em>",
      "note.body":
        "Yola çıkmadan önce nereye gittiğinizi<br />ve nelere hazırlanmanız gerektiğini bilirsiniz.<br /><em>Kaybolursanız — her zaman yolunuzu bulursunuz.</em>",
      "survey.iframe": "Google Haritalar’da sanal yürüyüş",
      "survey.drag": "okları izle · etrafa bak",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Yürüyüş",
      "survey.title": "Bir yürüyüş böyle görünür.",
      "survey.lead":
        "Sonbahar yolu, Zielona Góra Orman İşletmesi. Daha sonra Haritalar’da açacağınız aynı orman — burada ilk kez yürüyebilirsiniz.",
      "plate.bukowka.iframe": "Nad Bukówką patikası — sanal yürüyüş",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "„Nad Bukówką” doğa patikasındaki göl iskelesi. Trzcianka Orman İşletmesi. İskeleye çıkın ve oklarla devam edin.",
      "plate.tablica.iframe": "Mantar panosu, Do wieży patikası",
      "plate.tablica.title": "Okunaklı bir pano.",
      "plate.tablica.body":
        "„Do wieży” patikasındaki pano. Küresel fotoğrafı birleştiriyorum, panonun kendisini ayrı çekiyorum — yazı net ve mümkün olan en yüksek kalitede olsun diye.",
      "booking.kicker": "03 — Rezervasyon",
      "booking.title": "Hemen bir tarih ayırtın.",
      "booking.lead":
        "En güzel fotoğraflar erken ilkbahar, yaz ve sonbaharda çıkar. Kış havası istiyorsanız — buna da açığım ve memnuniyetle üstlenirim.",
      "booking.iframe": "Tarih rezervasyonu",
      "contact.kicker": "04 — İletişim",
      "contact.title": "Yazın veya arayın.",
      "contact.email": "E-posta",
      "contact.phone": "Telefon",
      "contact.reveal": "Görmek için tıklayın",
    },
    el: {
      "meta.title": "Skanowski — εικονικοί περίπατοι",
      "meta.description":
        "Εικονικοί περίπατοι 360°. Εκπαιδευτικά μονοπάτια στο Google Maps. Skanowski.",
      "nav.lang": "Γλώσσα",
      "nav.menuOpen": "Άνοιγμα μενού",
      "nav.menuClose": "Κλείσιμο μενού",
      "nav.booking": "Κράτηση",
      "nav.contact": "Επικοινωνία",
      "figure.aria": "Οδηγός μονοπατιού — σύρετε για κύλιση της σελίδας",
      "hero.alt": "Φθινοπωρινός δρόμος και ένα δέντρο",
      "hero.sub":
        "Εικονικοί περίπατοι σε εκπαιδευτικά μονοπάτια, τουριστικούς τόπους και τη φύση — στο Google Maps.",
      "practice.kicker": "01 — Το κύριο όφελος",
      "practice.title":
        "Εικονικοί περίπατοι στο Google Maps.<br />Γίνονται μία φορά — μένουν για πάντα.<br /><em>Χωρίς επιπλέον κόστος.</em>",
      "note.body":
        "Πριν ξεκινήσετε, ξέρετε ήδη πού πάτε<br />και σε τι να προετοιμαστείτε.<br /><em>Κι αν χαθείτε — πάντα θα βρίσκετε τον δρόμο.</em>",
      "survey.iframe": "Εικονικός περίπατος στο Google Maps",
      "survey.drag": "ακολούθησε τα βέλη · κοίτα γύρω",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Περίπατος",
      "survey.title": "Έτσι είναι ένας περίπατος.",
      "survey.lead":
        "Φθινοπωρινός δρόμος, Δασαρχείο Zielona Góra. Το ίδιο δάσος που αργότερα θα ανοίξεις στους Χάρτες — εδώ μπορείς να το περπατήσεις πρώτη φορά.",
      "plate.bukowka.iframe": "Μονοπάτι Nad Bukówką — εικονικός περίπατος",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "Προβλήτα στη λίμνη στο φυσικό μονοπάτι «Nad Bukówką». Δασαρχείο Trzcianka. Μπες στην πεζογέφυρα και συνέχισε με τα βέλη.",
      "plate.tablica.iframe": "Πίνακας Μανιτάρια, μονοπάτι Do wieży",
      "plate.tablica.title": "Ευανάγνωστος πίνακας.",
      "plate.tablica.body":
        "Πίνακας στο μονοπάτι «Do wieży». Συνθέτω τη φωτόσφαιρα και φωτογραφίζω τον πίνακα χωριστά — ώστε το κείμενο να είναι ευκρινές, στην καλύτερη δυνατή ποιότητα.",
      "booking.kicker": "03 — Κράτηση",
      "booking.title": "Κλείστε ήδη μια ημερομηνία.",
      "booking.lead":
        "Οι ωραιότερες φωτογραφίες βγαίνουν νωρίς την άνοιξη, το καλοκαίρι και το φθινόπωρο. Αν σας ενδιαφέρει χειμωνιάτικη ατμόσφαιρα — είμαι ανοιχτός και σε αυτό και το αναλαμβάνω με χαρά.",
      "booking.iframe": "Κράτηση ημερομηνίας",
      "contact.kicker": "04 — Επικοινωνία",
      "contact.title": "Γράψτε ή καλέστε.",
      "contact.email": "E-mail",
      "contact.phone": "Τηλέφωνο",
      "contact.reveal": "Κάντε κλικ για εμφάνιση",
    },
    pt: {
      "meta.title": "Skanowski — passeios virtuais",
      "meta.description":
        "Passeios virtuais 360°. Percursos pedagógicos no Google Maps. Skanowski.",
      "nav.lang": "Idioma",
      "nav.menuOpen": "Abrir menu",
      "nav.menuClose": "Fechar menu",
      "nav.booking": "Reserva",
      "nav.contact": "Contacto",
      "figure.aria": "Guia do percurso — arraste para percorrer a página",
      "hero.alt": "Estrada de outono e uma árvore",
      "hero.sub":
        "Passeios virtuais em percursos pedagógicos, sítios turísticos e na natureza — no Google Maps.",
      "practice.kicker": "01 — A principal vantagem",
      "practice.title":
        "Passeios virtuais no Google Maps.<br />Feitos uma vez — ficam para sempre.<br /><em>Sem custos extra.</em>",
      "note.body":
        "Antes de partir, já sabe para onde vai<br />e o que preparar.<br /><em>E se se perder — encontra sempre o caminho.</em>",
      "survey.iframe": "Passeio virtual no Google Maps",
      "survey.drag": "siga as setas · olhe em volta",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Passeio",
      "survey.title": "É assim que é um passeio.",
      "survey.lead":
        "Uma estrada de outono, Distrito Florestal de Zielona Góra. A mesma floresta que depois vai abrir no Maps — aqui pode percorrê-la pela primeira vez.",
      "plate.bukowka.iframe": "Percurso Nad Bukówką — passeio virtual",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "Um cais no lago no percurso natural «Nad Bukówką». Distrito Florestal de Trzcianka. Entre na passarela e continue com as setas.",
      "plate.tablica.iframe": "Painel Cogumelos, percurso Do wieży",
      "plate.tablica.title": "Um painel legível.",
      "plate.tablica.body":
        "Um painel no percurso «Do wieży». Monto a fotosfera e fotografo o painel à parte — para o texto ficar nítido e com a melhor qualidade possível.",
      "booking.kicker": "03 — Reserva",
      "booking.title": "Reserve já uma data.",
      "booking.lead":
        "As fotografias mais belas saem no início da primavera, no verão e no outono. Se quiser ambiente de inverno — também estou aberto e aceito o desafio com gosto.",
      "booking.iframe": "Reserva de data",
      "contact.kicker": "04 — Contacto",
      "contact.title": "Escreva ou ligue.",
      "contact.email": "E-mail",
      "contact.phone": "Telefone",
      "contact.reveal": "Clique para ver",
    },
    it: {
      "meta.title": "Skanowski — passeggiate virtuali",
      "meta.description":
        "Passeggiate virtuali a 360°. Sentieri didattici su Google Maps. Skanowski.",
      "nav.lang": "Lingua",
      "nav.menuOpen": "Apri il menu",
      "nav.menuClose": "Chiudi il menu",
      "nav.booking": "Prenotazione",
      "nav.contact": "Contatto",
      "figure.aria": "Guida del sentiero — trascina per scorrere la pagina",
      "hero.alt": "Strada autunnale e un albero",
      "hero.sub":
        "Passeggiate virtuali su sentieri didattici, luoghi turistici e natura — su Google Maps.",
      "practice.kicker": "01 — Il vantaggio principale",
      "practice.title":
        "Passeggiate virtuali su Google Maps.<br />Fatte una volta — restano per sempre.<br /><em>Senza costi extra.</em>",
      "note.body":
        "Prima di partire sai già dove vai<br />e a cosa prepararti.<br /><em>E se ti perdi — ritrovi sempre la strada.</em>",
      "survey.iframe": "Passeggiata virtuale su Google Maps",
      "survey.drag": "segui le frecce · guarda intorno",
      "maps.link": "Google Maps ↗",
      "survey.kicker": "02 — Passeggiata",
      "survey.title": "Ecco com’è una passeggiata.",
      "survey.lead":
        "Una strada autunnale, distretto forestale di Zielona Góra. Lo stesso bosco che poi aprirai su Maps — qui puoi percorrerlo per la prima volta.",
      "plate.bukowka.iframe": "Sentiero Nad Bukówką — passeggiata virtuale",
      "plate.bukowka.title": "Nad Bukówką.",
      "plate.bukowka.body":
        "Un pontile sul lago sul sentiero naturalistico «Nad Bukówką». Distretto forestale di Trzcianka. Entra sulla passerella e continua con le frecce.",
      "plate.tablica.iframe": "Pannello Funghi, sentiero Do wieży",
      "plate.tablica.title": "Un pannello leggibile.",
      "plate.tablica.body":
        "Un pannello sul sentiero «Do wieży». Compongo la fotosfera e fotografo il pannello a parte — così il testo resta nitido, con la massima qualità possibile.",
      "booking.kicker": "03 — Prenotazione",
      "booking.title": "Prenota già una data.",
      "booking.lead":
        "Le foto più belle escono all’inizio della primavera, in estate e in autunno. Se ti sta a cuore l’atmosfera invernale — sono aperto anche a questo e accetto volentieri la sfida.",
      "booking.iframe": "Prenotazione data",
      "contact.kicker": "04 — Contatto",
      "contact.title": "Scrivi o chiama.",
      "contact.email": "E-mail",
      "contact.phone": "Telefono",
      "contact.reveal": "Clicca per vedere",
    },
  };

  function isLang(code) {
    return LANGS.indexOf(code) !== -1;
  }

  function fromCountry(cc) {
    cc = String(cc || "").toUpperCase();
    if (!cc || MIXED_COUNTRY[cc]) return null;
    return COUNTRY_LANG[cc] || null;
  }

  function fromBrowser() {
    var list = navigator.languages || [navigator.language];
    for (var i = 0; i < list.length; i++) {
      var base = String(list[i] || "")
        .toLowerCase()
        .split("-")[0];
      base = ALIAS[base] || base;
      if (isLang(base)) return base;
    }
    return null;
  }

  function fromTimezone() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return TIMEZONES[tz] || null;
    } catch (err) {
      return null;
    }
  }

  var auto = true;

  function detect() {
    try {
      var saved = localStorage.getItem(STORAGE);
      if (isLang(saved)) {
        auto = false;
        return saved;
      }
    } catch (err) {}

    var query = "";
    try {
      query = new URLSearchParams(window.location.search).get("lang") || "";
    } catch (err) {}
    if (isLang(query)) {
      auto = false;
      try {
        localStorage.setItem(STORAGE, query);
      } catch (err) {}
      return query;
    }

    return fromTimezone() || fromBrowser() || "en";
  }

  function lookupCountry() {
    if (!auto || !window.fetch) return;

    var ctrl = new AbortController();
    var timer = setTimeout(function () {
      ctrl.abort();
    }, 1600);

    fetch("https://ipwho.is/?fields=success,country_code", {
      signal: ctrl.signal,
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!auto || !data || data.success === false) return;
        var next = fromCountry(data.country_code);
        if (next) setLang(next, false);
      })
      .catch(function () {})
      .then(function () {
        clearTimeout(timer);
      });
  }

  var lang = detect();
  var root = document.querySelector(".langs");
  var toggle = root && root.querySelector(".langs__btn");
  var list = root && root.querySelector(".langs__list");
  var codeEl = root && root.querySelector(".langs__code");

  function t(key) {
    return (dict[lang] && dict[lang][key]) || dict.en[key] || key;
  }

  function fill(selector, attr, html) {
    document.querySelectorAll(selector).forEach(function (el) {
      var key = el.getAttribute(attr);
      if (!key) return;
      if (html) el.innerHTML = t(key);
      else el.textContent = t(key);
    });
  }

  function closePicker() {
    if (!root || !toggle || !list) return;
    root.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    list.hidden = true;
  }

  function openPicker() {
    if (!root || !toggle || !list) return;
    var bar = document.querySelector(".bar");
    var menuBtn = document.querySelector(".bar__menu");
    if (bar) bar.classList.remove("is-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    root.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    list.hidden = false;
  }

  function buildList() {
    if (!list) return;
    list.innerHTML = "";
    LANG_META.forEach(function (item) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "option");
      btn.setAttribute("lang", item.id);
      btn.setAttribute("data-lang", item.id);
      btn.innerHTML =
        "<span>" +
        item.name +
        '</span><b class="langs__tag">' +
        item.id.toUpperCase() +
        "</b>";
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        setLang(item.id, true);
        closePicker();
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function apply() {
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.description"));
    if (codeEl) codeEl.textContent = lang.toUpperCase();

    fill("[data-i18n]", "data-i18n", false);
    fill("[data-i18n-html]", "data-i18n-html", true);

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      el.setAttribute("alt", t(el.getAttribute("data-i18n-alt")));
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
    });

    if (list) {
      list.querySelectorAll("[data-lang]").forEach(function (btn) {
        var on = btn.getAttribute("data-lang") === lang;
        btn.classList.toggle("is-on", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    listeners.forEach(function (fn) {
      fn(lang);
    });
  }

  function setLang(next, persist) {
    if (persist) auto = false;
    if (!isLang(next) || next === lang) {
      apply();
      return;
    }
    lang = next;
    if (persist) {
      try {
        localStorage.setItem(STORAGE, next);
      } catch (err) {}
    }
    apply();
  }

  buildList();

  if (toggle) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (root.classList.contains("is-open")) closePicker();
      else openPicker();
    });
  }

  if (list) {
    list.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  document.addEventListener("click", closePicker);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePicker();
  });

  apply();
  lookupCountry();

  window.SkanowskiI18n = {
    t: t,
    get lang() {
      return lang;
    },
    setLang: setLang,
    closePicker: closePicker,
    onChange: function (fn) {
      listeners.push(fn);
    },
  };
})();
