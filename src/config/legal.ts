import { RestaurantConfig } from '../types';

export interface LegalSection {
  title: string;
  content?: string;
  items?: string[];
  details?: { label: string; value: string }[];
}

export interface LegalContent {
  bannerTitle: string;
  bannerSubtitle: string;
  sections: LegalSection[];
}

export function getPrivacyPolicyContent(
  config: RestaurantConfig,
  language: 'fi' | 'en'
): LegalContent {
  const isFi = language === 'fi';

  return {
    bannerTitle: isFi ? 'GDPR-yhteensopiva tietosuoja' : 'GDPR Compliant Data Protection',
    bannerSubtitle: isFi
      ? 'Sovelluksemme on suunniteltu kunnioittamaan yksityisyyttäsi. Emme kerää henkilötietoja taustalla, emmekä myy tai luovuta tietojasi kolmansille osapuolille.'
      : 'Our application is designed to respect your privacy. We do not collect personal data in the background, nor do we sell or share your information with third parties.',
    sections: [
      {
        title: isFi ? '1. Rekisterinpitäjä' : '1. Data Controller',
        details: [
          { label: isFi ? 'Yritys' : 'Company', value: config.legal.entityName },
          { label: isFi ? 'Y-tunnus' : 'Business ID', value: config.legal.businessId },
          {
            label: isFi ? 'Osoite' : 'Address',
            value: `${config.address}, ${config.postalCode} ${config.city}`,
          },
          { label: isFi ? 'Puhelin' : 'Phone', value: config.phone },
          { label: isFi ? 'Sähköposti' : 'Email', value: config.email },
        ],
      },
      {
        title: isFi ? '2. Kerättävät tiedot ja käyttötarkoitus' : '2. Collected Data & Purpose',
        items: [
          isFi
            ? `Arvostelut ja palaute: Kun jätät vapaaehtoisen ruoka-arvostelun, tallennamme vapaaehtoisesti syöttämäsi nimimerkin/nimen, tähtiarvion, kirjallisen palautteen sekä aikaleiman ravintolan (${config.name}) tietokantaan. Näitä tietoja käytetään palvelun laadun kehittämiseen ja julkisten asiakasarvostelujen näyttämiseen.`
            : `Reviews & Feedback: When you leave an optional food review, we store your chosen name/alias, star rating, written feedback, and timestamp in the restaurant (${config.name}) database. This is used to improve service quality and display public feedback.`,
          isFi
            ? 'Tilauslista (Oma tilaus): Valitsemasi annokset tallentuvat vain laitteesi selaimesi paikalliseen muistiin (localStorage). Tilauslista ei tallennu palvelimelle ennen kuin näytät sen tarjoilijalle tai siirrät QR-koodilla.'
            : 'Order List (Your Order): Your selected items are stored only in your browser local storage (localStorage). The list is not saved to the server unless shown to staff or transferred via QR code.',
        ],
      },
      {
        title: isFi ? '3. Tietojen säilytysaika ja suojaus' : '3. Data Retention & Security',
        content: isFi
          ? 'Arvostelut säilytetään tietokannassa toistaiseksi asiakaspalautteen seurantaa varten. Selaimen muistiin (localStorage) tallennetut tilaustiedot säilyvät laitteellasi, kunnes tyhjennät selaimesi tiedot tai tyhjennät tilauslistan sovelluksen toiminnoilla.'
          : 'Reviews are retained in the database indefinitely for feedback tracking. Data stored in browser localStorage remains on your device until you clear your browser data or clear the order list.',
      },
      {
        title: isFi ? '4. Käyttäjän oikeudet (GDPR)' : '4. User Rights (GDPR)',
        content: isFi
          ? `Sinulla on oikeus pyytää itse jättämäsi arvostelun tarkistamista tai poistamista järjestelmästämme ottamalla yhteyttä ravintolaamme sähköpostitse (${config.email}) tai puhelimitse (${config.phone}).`
          : `You have the right to request access to or deletion of your submitted reviews by contacting us via email (${config.email}) or phone (${config.phone}).`,
      },
    ],
  };
}

export function getTermsOfServiceContent(
  config: RestaurantConfig,
  language: 'fi' | 'en'
): LegalContent {
  const isFi = language === 'fi';

  return {
    bannerTitle: isFi ? 'Digitaalinen menu & tilausapu' : 'Digital Menu & Ordering Assistant',
    bannerSubtitle: isFi
      ? `Tämä sovellus toimii ravintolan (${config.name}) digitaalisena ruokalistana ja apuvälineenä oman tilauksen hahmotteluun.`
      : `This app serves as the digital menu and order helper for ${config.name}.`,
    sections: [
      {
        title: isFi ? '1. Hinnat ja tuotetiedot' : '1. Prices & Product Details',
        content: isFi
          ? `Ruokalistan hinnat ilmoitetaan euroissa (${config.currency}) ja ne sisältävät voimassa olevan arvonlisäveron. Pidätämme oikeuden tuotetietojen, saatavuuden ja hintojen muutoksiin ilman erillistä ennakkoilmoitusta. Erityisruokavalioista ja allergeeneista suosittelemme aina varmistamaan myös henkilökunnaltamme tilaushetkellä.`
          : `Menu prices are indicated in ${config.currency} and include applicable VAT. We reserve the right to change product details, availability, and prices without prior notice. Please verify dietary requirements and allergens with staff when ordering.`,
      },
      {
        title: isFi ? '2. Tilauksen tekeminen' : '2. Placing Orders',
        content: isFi
          ? 'Sovelluksen tilauslista-toiminto auttaa kokoamaan ja laskemaan haluamasi annokset valmiiksi. Tilauksen lopullinen vahvistaminen tapahtuu ravintolassa tarjoilijalle näyttämällä tai pöytäjärjestelmän kautta. Digitaalinen lista ei muodosta suoraa velvoittavaa maksutapahtumaa ennen kuin se vahvistetaan henkilökunnalle.'
          : 'The order list feature helps you assemble your selected items. Final order confirmation takes place at the restaurant with staff. The digital list does not constitute a binding payment transaction until confirmed with staff.',
      },
      {
        title: isFi ? '3. Asiakasarvostelut ja sisältö' : '3. Customer Reviews & Content',
        content: isFi
          ? 'Käyttäjien jättämien arvostelujen tulee noudattaa hyvää tapaa. Ravintolalla on oikeus poistaa asiaton, loukkaava tai hyökkäävä sisältö järjestelmästä.'
          : 'Customer reviews must remain respectful. The restaurant reserves the right to remove inappropriate or offensive content.',
      },
    ],
  };
}

export function getCookiePolicyContent(
  _config: RestaurantConfig,
  language: 'fi' | 'en'
): LegalContent {
  const isFi = language === 'fi';

  return {
    bannerTitle: isFi ? 'Ei seurantaevästeitä' : 'No Tracking Cookies',
    bannerSubtitle: isFi
      ? 'Sivustomme on puhdas ja turvallinen. Emme käytä seuranta- tai mainosevästeitä eikä sovelluksessa ole kolmannen osapuolen analytiikkaseuraimia.'
      : 'Our site is clean and safe. We do not use tracking or advertising cookies, nor are there third-party analytics trackers.',
    sections: [
      {
        title: isFi ? '1. Paikallinen tallennustila (localStorage)' : '1. Local Storage (localStorage)',
        content: isFi
          ? 'Sovellus käyttää selaimen teknistä paikallista tallennustilaa (localStorage) parantamaan käyttökokemustasi. Tämän avulla muistamme:'
          : 'The app uses browser local storage (localStorage) to enhance your experience. This is used to remember:',
        items: [
          isFi ? 'Valitsemasi kieliasetuksen (Suomi / Englanti)' : 'Your language preference (Finnish / English)',
          isFi ? 'Kokoamasi tilauslistan sisällön' : 'Your created order list items',
          isFi ? 'Merkintäsi "Sinun ruokasi" -listalla syödyistä annoksista' : 'Saved items and reviews in "Your Foods"',
        ],
      },
      {
        title: isFi ? '2. Evästeiden ja tallennustilan hallinta' : '2. Managing Cookies & Local Storage',
        content: isFi
          ? 'Voit tyhjentää selaimen paikallisen tallennustilan milloin tahansa selaimesi asetuksista tai käyttämällä sovelluksen "Tyhjennä lista" -toimintoja.'
          : 'You can clear browser local storage at any time through your browser settings or by using the clear list functions in the app.',
      },
    ],
  };
}
