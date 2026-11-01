export interface BlogSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  imageAlt: string;
  intro: string;
  sections: BlogSection[];
  cta: { text: string; links: { href: string; label: string }[] };
}

export const blogPosts: BlogPost[] = [
  {
    slug: "dlaczego-miod-rzepakowy-sie-krystalizuje",
    title: "Dlaczego miód rzepakowy się krystalizuje i czy to dobrze?",
    description:
      "Miód rzepakowy (mniszkowo-rzepakowy) krystalizuje szybko – i to dobry znak. Pszczelarz z Topolna wyjaśnia, skąd bierze się krystalizacja miodu, czym jest kremowany miód i jak go przechowywać.",
    date: "2026-11-01",
    image: "/images/miod-rzepakowo-mniszkowy-1-2-kg.webp",
    imageAlt: "Słoik miodu mniszkowo-rzepakowego 1,2 kg z Jankesowej Pasieki",
    intro:
      "Co roku słyszę to samo pytanie: „Panie Krzysztofie, kupiłem płynny miód, a po kilku tygodniach zrobił się twardy i biały. Czy coś z nim nie tak?”. Odpowiadam zawsze z uśmiechem: wszystko jest w porządku, a nawet lepiej niż w porządku. Miód rzepakowy, a u nas w pasiece mniszkowo-rzepakowy, krystalizuje szybciej niż jakikolwiek inny. To jego naturalna cecha i jeden z najlepszych dowodów, że w słoiku jest prawdziwy miód prosto z ula.",
    sections: [
      {
        heading: "Skąd się bierze krystalizacja miodu?",
        paragraphs: [
          "Miód to w ogromnej większości roztwór cukrów – głównie glukozy i fruktozy – w niewielkiej ilości wody. Glukoza słabo rozpuszcza się w wodzie, więc z czasem zaczyna się z roztworu wytrącać i tworzy drobne kryształki. Te kryształki łączą się, rosną i po pewnym czasie cały słoik zmienia konsystencję z płynnej na stałą. Tak właśnie wygląda krystalizacja miodu, nazywana też potocznie scukrzeniem.",
          "Szybkość tego procesu zależy przede wszystkim od tego, z jakich kwiatów pszczoły zebrały nektar. Im więcej glukozy w stosunku do fruktozy, tym szybciej miód gęstnieje. Znaczenie ma też temperatura przechowywania, zawartość wody oraz drobinki pyłku, które są dla kryształków jakby „zarodkami”.",
        ],
      },
      {
        heading: "Dlaczego miód rzepakowy krystalizuje tak szybko?",
        paragraphs: [
          "Nektar rzepaku jest wyjątkowo bogaty w glukozę. Dlatego miód rzepakowy potrafi skrystalizować już po kilku dniach lub tygodniach od odwirowania – czasem jeszcze zanim trafi na półkę. Mniszek lekarski, który kwitnie wiosną w tym samym czasie co rzepak, dodaje miodowi złocistego koloru i delikatnej kwiatowej nuty, ale nie spowalnia tego procesu.",
          "Na kujawskich polach nad Wisłą, wokół Topolna, wiosną kwitnie i rzepak, i mniszek, więc pszczoły przynoszą do ula mieszankę obu nektarów. Z tego powstaje nasz miód mniszkowo-rzepakowy: jasny, bardzo słodki i łagodny, a po skrystalizowaniu – niemal biały i kremowy.",
        ],
      },
      {
        heading: "Czy skrystalizowany miód jest gorszy?",
        paragraphs: [
          "Nie. Krystalizacja to zmiana fizyczna, a nie chemiczna – miód nie traci przez nią swojego smaku ani wartości odżywczych. To wciąż ten sam miód, tylko w innej postaci. Wielu moich klientów wręcz woli go w formie stałej, bo łatwo rozsmarować go na pieczywie i nie spływa z łyżeczki.",
          "Warto też wiedzieć, że płynny miód, który przez wiele miesięcy w ogóle nie krystalizuje, powinien raczej wzbudzić naszą czujność. Niektóre gatunki – jak miód akacjowy – naturalnie długo pozostają płynne, ale miód rzepakowy, który po pół roku wciąż jest płynny jak syrop, mógł zostać mocno podgrzany albo nie jest w pełni naturalny.",
        ],
      },
      {
        heading: "Czym jest kremowany miód?",
        paragraphs: [
          "Kremowany miód to miód, który podczas krystalizacji jest regularnie mieszany. Dzięki temu kryształki pozostają bardzo drobne, a miód zamiast twardej bryły ma gładką, aksamitną konsystencję przypominającą masło. Nie dodaje się do niego niczego – to wciąż czysty miód, tylko inaczej „wychowany”.",
          "Miód rzepakowy, ze względu na drobne kryształki, nadaje się do kremowania idealnie. Nawet bez specjalnego mieszania często krystalizuje w bardzo przyjemną, kremową masę. Jeśli lubisz miód do smarowania, rzepakowy w tej postaci będzie strzałem w dziesiątkę.",
        ],
      },
      {
        heading: "Jak przywrócić miodowi płynną postać?",
        paragraphs: [
          "Jeżeli wolisz miód płynny, możesz go delikatnie upłynnić. Najważniejsza zasada brzmi: powoli i bez przegrzewania. Wysoka temperatura obniża jakość miodu, dlatego nigdy nie podgrzewaj go w mikrofalówce ani bezpośrednio na kuchence.",
        ],
        list: [
          "Odkręć wieczko i wstaw słoik do garnka z ciepłą wodą (około 40°C, czyli takiej, w której wygodnie trzymasz dłoń).",
          "Co jakiś czas zamieszaj miód i w razie potrzeby wymień wodę na ciepłą.",
          "Upłynniaj tylko tyle miodu, ile zużyjesz w najbliższym czasie – po ostygnięciu i tak ponownie skrystalizuje.",
        ],
      },
      {
        heading: "Jak przechowywać miód rzepakowy?",
        paragraphs: [
          "Najlepiej w szczelnie zamkniętym słoiku, w suchym i chłodnym miejscu, z dala od słońca – na przykład w szafce kuchennej z dala od piekarnika. Miód chłonie wilgoć i zapachy, dlatego zawsze nabieraj go suchą łyżeczką i dobrze zakręcaj wieczko. Lodówka nie jest potrzebna.",
          "Czasem na powierzchni skrystalizowanego miodu pojawiają się jasne, białe „kwiatki” lub smugi przy ściankach słoika. To drobne pęcherzyki powietrza i ślady krystalizacji – całkowicie naturalne zjawisko, które nie wpływa na jakość miodu.",
        ],
      },
      {
        heading: "Do czego najlepiej pasuje?",
        paragraphs: [
          "Łagodny, słodki smak sprawia, że miód mniszkowo-rzepakowy lubią nawet osoby, które zwykle za miodem nie przepadają. Świetnie sprawdza się na kanapkach, w owsiance, w jogurcie z owocami i jako dodatek do wypieków. Do herbaty dodawaj go dopiero, gdy napój nieco przestygnie – wtedy zachowasz pełnię smaku.",
        ],
      },
    ],
    cta: {
      text: "Nasz miód mniszkowo-rzepakowy pochodzi z wiosennych pożytków wokół Topolna nad Wisłą. Możesz go zamówić z wysyłką lub odebrać osobiście.",
      links: [
        { href: "/produkty/miod-rzepakowo-mniszkowy-900ml", label: "Miód mniszkowo-rzepakowy 1,2 kg" },
        { href: "/produkty/miod-rzepakowo-mniszkowy-350ml", label: "Miód mniszkowo-rzepakowy 0,49 kg" },
        { href: "/produkty", label: "Cała oferta pasieki" },
      ],
    },
  },
  {
    slug: "miod-akacjowy-wlasciwosci-smak-dla-kogo",
    title: "Miód akacjowy – właściwości, smak i dla kogo",
    description:
      "Miód akacjowy jest jasny, łagodny i długo pozostaje płynny. Sprawdź, jak smakuje, czym się wyróżnia, dla kogo jest najlepszy i od jakiego wieku można podawać miód dzieciom.",
    date: "2026-11-01",
    image: "/images/miod-akacjowy-1-2-kg.webp",
    imageAlt: "Słoik miodu akacjowego 1,2 kg z Jankesowej Pasieki",
    intro:
      "Gdy ktoś mówi mi, że nie lubi miodu, bo jest „za ostry” albo „drapie w gardle”, proponuję mu zawsze łyżeczkę miodu akacjowego. Najczęściej po chwili słyszę: „O, to zupełnie co innego!”. Akacjowy to jeden z najdelikatniejszych miodów, jakie znamy w Polsce. W tym wpisie opowiem, skąd się bierze, czym się wyróżnia i dla kogo będzie najlepszym wyborem.",
    sections: [
      {
        heading: "Skąd pochodzi miód akacjowy?",
        paragraphs: [
          "Nazwa jest trochę myląca, bo pszczoły nie zbierają go z prawdziwej akacji, lecz z robinii akacjowej, potocznie nazywanej właśnie akacją. To drzewo kwitnie późną wiosną, zwykle na przełomie maja i czerwca, obsypując się gronami białych, pachnących kwiatów. Kwitnienie trwa krótko, a pogoda w tym czasie bywa kapryśna, dlatego miód akacjowy nie każdego roku udaje się zebrać w dużej ilości.",
          "Na nadwiślańskich Kujawach robinia rośnie w zadrzewieniach, przy drogach i na skarpach, więc nasze pszczoły z Topolna mają gdzie pracować. Kiedy akacja kwitnie, w pasiece czuć jej słodki zapach – to jeden z najpiękniejszych momentów w roku.",
        ],
      },
      {
        heading: "Jak smakuje i wygląda miód akacjowy?",
        paragraphs: [
          "Miód akacjowy jest bardzo jasny – od niemal przezroczystego po jasnosłomkowy. Ma łagodny, słodki smak bez goryczki i delikatny, kwiatowy zapach. Nie dominuje nad potrawami, dlatego jest bardzo uniwersalny w kuchni.",
          "Jego najbardziej charakterystyczną cechą jest to, że bardzo długo pozostaje płynny. Zawiera więcej fruktozy niż glukozy, przez co krystalizuje powoli – często dopiero po wielu miesiącach, a i wtedy tylko częściowo. To przeciwieństwo miodu rzepakowego, który gęstnieje w kilka tygodni.",
        ],
      },
      {
        heading: "Czym wyróżnia się miód akacjowy?",
        paragraphs: [
          "Jak każdy naturalny miód, akacjowy zawiera cukry proste, niewielkie ilości enzymów, kwasów organicznych i związków pochodzących z nektaru i pyłku. Nie jest lekarstwem i nie zastąpi wizyty u lekarza – to przede wszystkim wartościowy, naturalny produkt spożywczy, który może być smaczną alternatywą dla cukru w codziennej diecie.",
          "Wiele osób sięga po niego dlatego, że jest łagodny dla podniebienia i dobrze komponuje się z innymi smakami. Warto pamiętać, że miód to nadal źródło cukrów, więc osoby z cukrzycą lub na diecie powinny włączać go do jadłospisu z umiarem i w porozumieniu z lekarzem lub dietetykiem.",
        ],
      },
      {
        heading: "Miód dla dzieci – od jakiego wieku?",
        paragraphs: [
          "Miód akacjowy często nazywa się „miodem dla dzieci”, bo maluchy zwykle chętnie go jedzą ze względu na łagodny smak. To prawda, ale jest jedna bardzo ważna zasada:",
          "Nie podawaj miodu dzieciom poniżej 1. roku życia. Miód – każdy, także najlepszej jakości – może zawierać przetrwalniki bakterii, z którymi układ pokarmowy niemowlęcia jeszcze sobie nie radzi. Dotyczy to również dodawania miodu do kaszek, herbatek czy smoczków.",
          "U starszych dzieci miód można wprowadzać stopniowo i w niewielkich ilościach, obserwując, czy nie pojawia się reakcja alergiczna. W razie wątpliwości – szczególnie u dzieci z alergiami – najlepiej zapytać pediatrę.",
        ],
      },
      {
        heading: "Jak jeść miód akacjowy?",
        paragraphs: [
          "Ponieważ jest płynny i łagodny, świetnie nadaje się do:",
        ],
        list: [
          "słodzenia herbaty, ziół i lemoniady (dodawaj do napoju, który już nieco przestygł),",
          "jogurtu naturalnego, owsianki, twarożku i naleśników,",
          "dressingów do sałatek, np. z musztardą i oliwą,",
          "polewania serów i owoców,",
          "domowych wypieków i marynat.",
        ],
      },
      {
        heading: "Jak przechowywać miód akacjowy?",
        paragraphs: [
          "Tak jak każdy miód: w szczelnie zamkniętym słoiku, w suchym, ciemnym i chłodnym miejscu, w temperaturze pokojowej lub niższej. Nie trzeba go trzymać w lodówce. Zawsze nabieraj go suchą łyżeczką, bo woda i wilgoć mogą sprawić, że zacznie fermentować.",
          "Jeśli po dłuższym czasie miód akacjowy zacznie lekko mętnieć lub gęstnieć – to naturalna krystalizacja, nie wada. Można go delikatnie upłynnić w kąpieli wodnej w temperaturze około 40°C.",
        ],
      },
      {
        heading: "Dla kogo miód akacjowy będzie najlepszy?",
        paragraphs: [
          "Polecam go wszystkim, którzy zaczynają przygodę z miodem, osobom lubiącym delikatne smaki, rodzinom z dziećmi (powyżej 1. roku życia) oraz każdemu, kto szuka uniwersalnego miodu do kuchni. To także bardzo dobry pomysł na prezent – mały słoik 0,49 kg jest idealny na upominek.",
        ],
      },
    ],
    cta: {
      text: "Miód akacjowy z Jankesowej Pasieki pochodzi z kwitnących robinii na Kujawach nad Wisłą. Dostępny w dwóch rozmiarach słoika.",
      links: [
        { href: "/produkty/miod-akacjowy-900ml", label: "Miód akacjowy 1,2 kg" },
        { href: "/produkty/miod-akacjowy-350ml", label: "Miód akacjowy 0,49 kg" },
        { href: "/produkty", label: "Cała oferta pasieki" },
      ],
    },
  },
  {
    slug: "gdzie-kupic-prawdziwy-miod-od-pszczelarza-torun-bydgoszcz-swiecie",
    title: "Gdzie kupić prawdziwy miód od pszczelarza? Toruń, Bydgoszcz, Świecie",
    description:
      "Szukasz miodu prosto od pszczelarza w okolicach Torunia, Bydgoszczy lub Świecia? Dowiedz się, jak rozpoznać prawdziwy miód i jak kupić go w Jankesowej Pasiece – z odbiorem w Topolnie, w Bydgoszczy lub z wysyłką.",
    date: "2026-11-01",
    image: "/images/ule-pasieka-topolno.webp",
    imageAlt: "Ule Jankesowej Pasieki w Topolnie nad Wisłą",
    intro:
      "W sklepach nie brakuje słoików z napisem „miód”, ale coraz więcej osób szuka miodu z konkretnej, lokalnej pasieki – od pszczelarza, którego można zapytać, skąd pochodzi miód i jak powstał. Bardzo mnie to cieszy. W tym wpisie podpowiem, jak rozpoznać prawdziwy miód, na co zwrócić uwagę przy zakupie i jak kupić miód z Jankesowej Pasieki, jeśli mieszkasz w Toruniu, Bydgoszczy, Świeciu lub okolicy.",
    sections: [
      {
        heading: "Dlaczego warto kupować miód od pszczelarza?",
        paragraphs: [
          "Kupując bezpośrednio od pszczelarza, wiesz, kto stoi za słoikiem. Możesz zapytać o gatunek miodu, okres zbioru, okolicę, w której stoją ule, i sposób przechowywania. Taki miód nie przebywa długiej drogi przez hurtownie i magazyny, a pszczelarz nie ma powodu mieszać go z miodami z innych krajów.",
          "Na etykietach miodów sklepowych często można przeczytać „mieszanka miodów pochodzących z UE i spoza UE”. To nie musi oznaczać złego produktu, ale nie wiadomo wtedy, skąd dokładnie pochodzi miód. U lokalnego pszczelarza ten problem nie istnieje – miód pochodzi z jego uli.",
        ],
      },
      {
        heading: "Jak rozpoznać prawdziwy miód?",
        paragraphs: [
          "Nie ma jednego domowego testu, który na sto procent potwierdzi autentyczność miodu – pewność dają tylko badania laboratoryjne. Jest jednak kilka wskazówek, które pomagają dokonać dobrego wyboru:",
        ],
        list: [
          "Krystalizacja jest naturalna. Większość miodów (szczególnie rzepakowy, mniszkowo-rzepakowy i wielokwiatowy) z czasem gęstnieje. Miód, który latami pozostaje płynny jak syrop, może budzić wątpliwości – wyjątkiem są akacjowy i spadziowy, które krystalizują bardzo wolno.",
          "Etykieta mówi wiele. Na miodzie od pszczelarza powinny być: nazwa i adres pasieki, gatunek miodu, masa i data minimalnej trwałości. Sprzedaż bezpośrednia wymaga też wpisu do rejestru u Powiatowego Lekarza Weterynarii.",
          "Smak i zapach są charakterystyczne. Każdy gatunek miodu ma swój aromat – kwiatowy, ziołowy, lekko gorzkawy lub bardzo łagodny. Miód bez zapachu i o „płaskim”, jedynie słodkim smaku to sygnał do zastanowienia.",
          "Cena też coś mówi. Utrzymanie pasieki to dużo pracy przez cały rok. Bardzo tani miód rzadko pochodzi od lokalnego pszczelarza.",
          "Możliwość rozmowy. Dobry pszczelarz chętnie opowie o swoim miodzie i odpowie na pytania.",
        ],
      },
      {
        heading: "Jankesowa Pasieka – miód z Kujaw nad Wisłą",
        paragraphs: [
          "Nasza rodzinna pasieka znajduje się w Topolnie, w gminie Pruszcz, niedaleko Świecia, Torunia i Bydgoszczy. Ule stoją na nadwiślańskich terenach, gdzie wiosną kwitną rzepak i mniszek, później robinia akacjowa, a przez całe lato łąki i zadrzewienia. Miód odwirowujemy z dojrzałych plastrów, nie pasteryzujemy go i nie mieszamy z miodami z zewnątrz.",
          "Prowadzimy sprzedaż bezpośrednią na podstawie wpisu do rejestru Powiatowego Lekarza Weterynarii w Świeciu. W ofercie mamy m.in. miód mniszkowo-rzepakowy, akacjowy i wielokwiatowy, a także miód w plastrach i świece z wosku pszczelego. Sezonowo pojawiają się kolejne gatunki.",
        ],
      },
      {
        heading: "Odbiór osobisty w Topolnie",
        paragraphs: [
          "Jeśli mieszkasz w okolicy Świecia, Pruszcza, Chełmna czy Torunia, zapraszamy po miód prosto do pasieki: Topolno 45, 86-120 Pruszcz. Odbiór osobisty jest możliwy od poniedziałku do piątku w godzinach 8:00–20:00 oraz w soboty w godzinach 8:00–13:00. Prosimy o wcześniejszy telefon pod numer +48 514 070 298, żebyśmy na pewno byli na miejscu i przygotowali zamówienie.",
          "Odbiór osobisty jest bezpłatny, a przy okazji można porozmawiać o miodzie i wybrać gatunek na miejscu.",
        ],
      },
      {
        heading: "Miód w Bydgoszczy – odbiór po umówieniu",
        paragraphs: [
          "Mieszkasz w Bydgoszczy? Na co dzień bywam w Bydgoszczy, więc miód można odebrać również tam. Wystarczy zadzwonić pod numer +48 514 070 298 i umówić się na dogodne miejsce i godzinę przekazania zamówienia. To wygodna opcja dla osób, które chcą kupić miód od pszczelarza bez jazdy na wieś.",
        ],
      },
      {
        heading: "Miód w Toruniu i Świeciu",
        paragraphs: [
          "Z Torunia i Świecia do Topolna jest niedaleko, więc wiele osób łączy zakup miodu z wycieczką nad Wisłę – okolice Topolna i Chełmna to piękne tereny na spacer czy rower. Jeśli jednak nie masz czasu na przyjazd, wybierz wysyłkę.",
        ],
      },
      {
        heading: "Wysyłka miodu w całej Polsce",
        paragraphs: [
          "Miód możesz zamówić przez nasz sklep internetowy i opłacić kartą, BLIK-iem lub Przelewy24. Wysyłamy do Paczkomatów InPost oraz kurierem na wskazany adres. Słoiki pakujemy starannie, żeby dotarły w całości. Aktualne koszty dostawy zobaczysz w koszyku przed złożeniem zamówienia.",
        ],
      },
      {
        heading: "Masz pytania? Zadzwoń",
        paragraphs: [
          "Chętnie doradzę, który miód wybrać – na prezent, dla dzieci (pamiętaj: nie dla niemowląt poniżej 1. roku życia), do herbaty czy na kanapki. Zadzwoń pod numer +48 514 070 298 lub napisz na jankesowa.pasieka@gmail.com.",
        ],
      },
    ],
    cta: {
      text: "Zamów miód prosto z pasieki w Topolnie – z wysyłką InPost lub kurierem, z odbiorem osobistym w pasiece albo po umówieniu w Bydgoszczy.",
      links: [
        { href: "/produkty", label: "Zobacz wszystkie miody" },
        { href: "/kontakt", label: "Kontakt i dojazd" },
      ],
    },
  },
];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
