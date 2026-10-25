// Studio in the four languages of 4xor.de (English, German, French, Italian),
// with the same wording where both sites say the same thing. The product names
// stay in English in every language, as on 4xor.de.
import { createContext, useContext, useEffect, useState } from "react";

export const LANGUAGES = { en: "English", de: "Deutsch", fr: "Français", it: "Italiano" };
export const LANGS = Object.keys(LANGUAGES);
const STORE = "studio-lang";

/** ?lang= wins (links from 4xor.de carry it), then the visitor's last pick, then the browser. */
function initialLang() {
  const q = new URLSearchParams(window.location.search).get("lang");
  if (LANGS.includes(q)) return q;
  try {
    const saved = localStorage.getItem(STORE);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // storage blocked: fall through
  }
  const nav = (navigator.language || "en").slice(0, 2);
  return LANGS.includes(nav) ? nav : "en";
}

const LangContext = createContext({ lang: "en", setLang: () => {}, t: null });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l) => {
    setLangState(l);
    try {
      localStorage.setItem(STORE, l);
    } catch {
      // storage blocked: the pick lasts for this visit
    }
  };
  return <LangContext.Provider value={{ lang, setLang, t: UI[lang] }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** 4xor.de keeps English at / and the others under /de/, /fr/, /it/. */
export const siteHome = (lang) => `https://www.4xor.de${lang === "en" ? "" : `/${lang}`}/`;

const PRODUCT = { workflow: "Agent Workflow Automation", social: "Social Media Automation" };

export const UI = {
  en: {
    promo: "A 4XOR product.",
    promoExtra: " AI agents and automation from Switzerland, see 4xor.de",
    homeLabel: "4XOR Studio, home",
    menu: "Menu",
    langLabel: "Language",
    groups: { services: "Services", studio: "Studio" },
    tryLive: "Open live demo",
    signIn: "Sign in",
    cta: "Book free intro call",
    request: "Request this service",
    askAgent: "Ask the agent on the Be[X] map",
    footerPlace: "4XOR, Aesch, Switzerland",
    mapLink: "Be[X] map",
    landing: {
      eyebrow: "4XOR Studio",
      title: "Your business keeps running while you focus on customers.",
      sub: "Two ready-made AI services, set up and run by 4XOR. Your Studio workspace shows what they do for you, and you approve what goes out.",
      steps: "Live in 30 days",
      stepNames: ["Discover", "Prototype", "Build", "Go live"],
    },
    products: {
      workflow: {
        lead: "Your routine work runs by itself, and your team approves what matters.",
        outcomes: [
          "New leads get an answer in minutes",
          "Bookings land in your calendar",
          "Emails and reports go out on time",
          "Your tools pass data to each other, no copy and paste",
        ],
        note: "Start with one process and add the next once it pays off.",
      },
      social: {
        lead: "Your channels stay active every week while you work on customers.",
        outcomes: [
          "One upload becomes posts for every channel",
          "Captions and hashtags written in your voice",
          "Posts scheduled at the right times",
          "Nothing goes out until you approve it",
        ],
        note: "Instagram, TikTok, YouTube, Facebook and WhatsApp.",
      },
    },
    try: {
      eyebrow: "Try it live",
      titles: { workflow: "A new lead, answered and booked", social: "One upload, a post for every channel" },
      steps: {
        workflow: ["Lead arrives", "AI understands it", "Reply written", "Meeting offered", "CRM and follow-up"],
        social: ["You upload", "Branded", "Posts written", "You approve once", "Scheduled"],
      },
      watch: (product, minutes) => [`Watch ${product} do in seconds what usually takes a person `, `${minutes} minutes`, ". Then run it once with your own business."],
      example: "Example: ",
      liveFor: "Live run for ",
      replay: "Replay",
      newMessage: "New message · just now",
      reply: "Reply",
      urgency: "Urgency",
      urgencyLevels: { low: "low", medium: "medium", high: "high" },
      offered: "Offered times:",
      crm: "CRM",
      followUp: "Follow-up",
      approveAll: (n) => `Approve for all ${n} channels`,
      done: (minutes) => ["Done in under a minute. By hand this takes about ", `${minutes} minutes`, ", every time."],
      yourTurn: "Your turn",
      yourTurnText: "One free live run a day for each service, written by AI for your business. Sign in with your 4XOR account to start.",
      signInPrompt: (product) => `Sign in once, then run ${product} for your own business.`,
      signInToRun: "Sign in to run it live",
      used: "You've used today's free run. The next one is ready tomorrow. Want this running for your business every day?",
      soon: "The live run with your own business is coming soon. Until then, ask us or the agent on the map what it would do for you.",
      liveDone: "That was today's free run. After booking, it runs on your own accounts every day, and you approve in your Studio workspace.",
      business: "Your business",
      hints: {
        workflow: { business: "e.g. Physio practice in Zurich", detailLabel: "A message a new customer might send you", detail: "e.g. Hi, do you have time this week for…" },
        social: { business: "e.g. Family bakery in Basel", detailLabel: "What your photo or video shows", detail: "e.g. Fresh croissants coming out of the oven" },
      },
      signedInAs: (name) => `Signed in as ${name || "you"} · 1 free run`,
      run: "Run it live",
      running: "Running…",
      error: "Something went wrong. Please try again.",
      unreachable: "The demo didn't answer in time. Please try again in a minute.",
    },
    ws: {
      overview: "Overview",
      social: "Social media",
      workflows: "Agent workflows",
      workflowsShort: "Workflows",
      title: "Your workspace",
      sub: "Everything your 4XOR services do for you, in one place.",
      leads: {
        social: "Upload once. Posts for every channel are written, scheduled and waiting for your OK.",
        workflow: "Your AI team takes care of routine work every day and plans the next week from the results.",
      },
      tabs: { create: "Create", approve: "Approve", schedule: "Schedule", results: "Results", team: "Your AI team", goals: "Goals and weekly plan" },
      actions: {
        create: ["Create posts", "Upload photos or videos"],
        approve: ["Approve posts", "You decide what goes out"],
        schedule: ["Posting schedule", "How often per channel"],
        results: ["Results", "Reach and engagement"],
        team: ["Your AI team", "Who does what, right now"],
        goals: ["Goals and weekly plan", "Set a target, get a plan"],
      },
      teamSub: "Each one has a job, works around the clock and reports what it did.",
      weekPlan: "See this week's plan",
    },
  },

  de: {
    promo: "Ein 4XOR-Produkt.",
    promoExtra: " KI-Agenten und Automatisierung aus der Schweiz, siehe 4xor.de",
    homeLabel: "4XOR Studio, Startseite",
    menu: "Menü",
    langLabel: "Sprache",
    groups: { services: "Services", studio: "Studio" },
    tryLive: "Live-Demo öffnen",
    signIn: "Anmelden",
    cta: "Gratis Erstgespräch buchen",
    request: "Service anfragen",
    askAgent: "Den Agenten auf der Be[X]-Karte fragen",
    footerPlace: "4XOR, Aesch, Schweiz",
    mapLink: "Be[X]-Karte",
    landing: {
      eyebrow: "4XOR Studio",
      title: "Ihr Geschäft läuft weiter, während Sie sich um Ihre Kunden kümmern.",
      sub: "Zwei fertige KI-Services, eingerichtet und betreut von 4XOR. Ihr Studio-Workspace zeigt, was sie für Sie erledigen, und Sie geben frei, was rausgeht.",
      steps: "Live in 30 Tagen",
      stepNames: ["Verstehen", "Prototyp", "Bauen", "Live gehen"],
    },
    products: {
      workflow: {
        lead: "Routinearbeit erledigt sich von selbst, und Ihr Team gibt frei, was zählt.",
        outcomes: [
          "Neue Anfragen bekommen in Minuten eine Antwort",
          "Buchungen landen in Ihrem Kalender",
          "E-Mails und Berichte gehen pünktlich raus",
          "Ihre Tools geben Daten selbst weiter, ohne Copy-Paste",
        ],
        note: "Starten Sie mit einem Prozess und nehmen Sie den nächsten dazu, sobald er sich lohnt.",
      },
      social: {
        lead: "Ihre Kanäle bleiben jede Woche aktiv, während Sie sich um Kunden kümmern.",
        outcomes: [
          "Ein Upload wird zu Beiträgen für jeden Kanal",
          "Texte und Hashtags in Ihrem Ton",
          "Beiträge zur richtigen Zeit eingeplant",
          "Nichts geht raus, bevor Sie es freigeben",
        ],
        note: "Instagram, TikTok, YouTube, Facebook und WhatsApp.",
      },
    },
    try: {
      eyebrow: "Live ausprobieren",
      titles: { workflow: "Eine neue Anfrage, beantwortet und gebucht", social: "Ein Upload, ein Beitrag für jeden Kanal" },
      steps: {
        workflow: ["Anfrage kommt rein", "KI versteht sie", "Antwort geschrieben", "Termin angeboten", "CRM und Nachfassen"],
        social: ["Sie laden hoch", "Mit Ihrer Marke", "Beiträge geschrieben", "Einmal freigeben", "Eingeplant"],
      },
      watch: (product, minutes) => [`Sehen Sie, wie ${product} in Sekunden erledigt, wofür eine Person sonst `, `${minutes} Minuten`, " braucht. Danach starten Sie es einmal für Ihr eigenes Geschäft."],
      example: "Beispiel: ",
      liveFor: "Live-Lauf für ",
      replay: "Nochmals abspielen",
      newMessage: "Neue Nachricht · gerade eben",
      reply: "Antwort",
      urgency: "Dringlichkeit",
      urgencyLevels: { low: "tief", medium: "mittel", high: "hoch" },
      offered: "Angebotene Termine:",
      crm: "CRM",
      followUp: "Nachfassen",
      approveAll: (n) => `Für alle ${n} Kanäle freigeben`,
      done: (minutes) => ["In unter einer Minute erledigt. Von Hand dauert das etwa ", `${minutes} Minuten`, ", jedes Mal."],
      yourTurn: "Jetzt Sie",
      yourTurnText: "Ein kostenloser Live-Lauf pro Tag und Service, von der KI für Ihr Geschäft geschrieben. Melden Sie sich mit Ihrem 4XOR-Konto an.",
      signInPrompt: (product) => `Einmal anmelden, dann ${product} für Ihr eigenes Geschäft starten.`,
      signInToRun: "Anmelden und live starten",
      used: "Den kostenlosen Lauf für heute haben Sie genutzt. Morgen ist der nächste bereit. Soll das jeden Tag für Ihr Geschäft laufen?",
      soon: "Der Live-Lauf mit Ihrem eigenen Geschäft kommt bald. Bis dahin fragen Sie uns oder den Agenten auf der Karte, was er für Sie erledigen würde.",
      liveDone: "Das war Ihr kostenloser Lauf für heute. Nach der Buchung läuft es jeden Tag mit Ihren eigenen Konten, und Sie geben im Studio-Workspace frei.",
      business: "Ihr Geschäft",
      hints: {
        workflow: { business: "z. B. Physiotherapie-Praxis in Zürich", detailLabel: "Eine Nachricht, die Ihnen ein neuer Kunde schicken könnte", detail: "z. B. Grüezi, haben Sie diese Woche Zeit für…" },
        social: { business: "z. B. Familienbäckerei in Basel", detailLabel: "Was Ihr Foto oder Video zeigt", detail: "z. B. Frische Gipfeli direkt aus dem Ofen" },
      },
      signedInAs: (name) => `Angemeldet als ${name || "Sie"} · 1 kostenloser Lauf`,
      run: "Live starten",
      running: "Läuft…",
      error: "Etwas ist schiefgelaufen. Bitte nochmals versuchen.",
      unreachable: "Die Demo hat nicht rechtzeitig geantwortet. Bitte in einer Minute nochmals versuchen.",
    },
    ws: {
      overview: "Übersicht",
      social: "Social Media",
      workflows: "Agent Workflows",
      workflowsShort: "Workflows",
      title: "Ihr Workspace",
      sub: "Alles, was Ihre 4XOR-Services für Sie erledigen, an einem Ort.",
      leads: {
        social: "Einmal hochladen. Beiträge für jeden Kanal werden geschrieben, eingeplant und warten auf Ihr OK.",
        workflow: "Ihr KI-Team erledigt jeden Tag die Routinearbeit und plant die nächste Woche aus den Resultaten.",
      },
      tabs: { create: "Erstellen", approve: "Freigeben", schedule: "Planen", results: "Resultate", team: "Ihr KI-Team", goals: "Ziele und Wochenplan" },
      actions: {
        create: ["Beiträge erstellen", "Fotos oder Videos hochladen"],
        approve: ["Beiträge freigeben", "Sie entscheiden, was rausgeht"],
        schedule: ["Posting-Plan", "Wie oft pro Kanal"],
        results: ["Resultate", "Reichweite und Interaktion"],
        team: ["Ihr KI-Team", "Wer gerade was erledigt"],
        goals: ["Ziele und Wochenplan", "Ziel setzen, Plan erhalten"],
      },
      teamSub: "Jedes Mitglied hat eine Aufgabe, arbeitet rund um die Uhr und meldet, was es erledigt hat.",
      weekPlan: "Wochenplan ansehen",
    },
  },

  fr: {
    promo: "Un produit 4XOR.",
    promoExtra: " Agents IA et automatisation depuis la Suisse, voir 4xor.de",
    homeLabel: "4XOR Studio, accueil",
    menu: "Menu",
    langLabel: "Langue",
    groups: { services: "Services", studio: "Studio" },
    tryLive: "Ouvrir la démo",
    signIn: "Se connecter",
    cta: "Réserver un entretien gratuit",
    request: "Demander ce service",
    askAgent: "Demander à l’agent sur la carte Be[X]",
    footerPlace: "4XOR, Aesch, Suisse",
    mapLink: "Carte Be[X]",
    landing: {
      eyebrow: "4XOR Studio",
      title: "Votre activité continue pendant que vous vous occupez de vos clients.",
      sub: "Deux services IA prêts à l’emploi, mis en place et gérés par 4XOR. Votre espace Studio montre ce qu’ils font pour vous, et vous validez ce qui part.",
      steps: "En service en 30 jours",
      stepNames: ["Comprendre", "Prototype", "Développer", "Mise en service"],
    },
    products: {
      workflow: {
        lead: "Le travail de routine se fait tout seul, et votre équipe valide ce qui compte.",
        outcomes: [
          "Les nouvelles demandes reçoivent une réponse en quelques minutes",
          "Les réservations arrivent dans votre agenda",
          "E-mails et rapports partent à l’heure",
          "Vos outils s’échangent les données, sans copier-coller",
        ],
        note: "Commencez par un processus et ajoutez le suivant dès qu’il est rentable.",
      },
      social: {
        lead: "Vos canaux restent actifs chaque semaine pendant que vous vous occupez de vos clients.",
        outcomes: [
          "Un seul envoi devient une publication pour chaque canal",
          "Textes et hashtags écrits avec votre ton",
          "Publications programmées au bon moment",
          "Rien ne part sans votre validation",
        ],
        note: "Instagram, TikTok, YouTube, Facebook et WhatsApp.",
      },
    },
    try: {
      eyebrow: "Essayer en direct",
      titles: { workflow: "Une nouvelle demande, traitée et réservée", social: "Un envoi, une publication pour chaque canal" },
      steps: {
        workflow: ["La demande arrive", "L’IA la comprend", "Réponse rédigée", "Rendez-vous proposé", "CRM et relance"],
        social: ["Vous envoyez", "À votre marque", "Publications rédigées", "Une seule validation", "Programmé"],
      },
      watch: (product, minutes) => [`Voyez ${product} faire en quelques secondes ce qui prend d’habitude `, `${minutes} minutes`, " à une personne. Puis lancez-le une fois pour votre propre activité."],
      example: "Exemple : ",
      liveFor: "Essai en direct pour ",
      replay: "Rejouer",
      newMessage: "Nouveau message · à l’instant",
      reply: "Réponse",
      urgency: "Urgence",
      urgencyLevels: { low: "faible", medium: "moyenne", high: "élevée" },
      offered: "Créneaux proposés :",
      crm: "CRM",
      followUp: "Relance",
      approveAll: (n) => `Valider pour les ${n} canaux`,
      done: (minutes) => ["Fait en moins d’une minute. À la main, cela prend environ ", `${minutes} minutes`, ", à chaque fois."],
      yourTurn: "À vous",
      yourTurnText: "Un essai en direct gratuit par jour et par service, rédigé par l’IA pour votre activité. Connectez-vous avec votre compte 4XOR.",
      signInPrompt: (product) => `Connectez-vous une fois, puis lancez ${product} pour votre propre activité.`,
      signInToRun: "Se connecter et lancer",
      used: "Vous avez utilisé l’essai gratuit du jour. Le prochain est prêt demain. Vous voulez que cela tourne chaque jour pour votre activité ?",
      soon: "L’essai en direct avec votre propre activité arrive bientôt. D’ici là, demandez-nous ou à l’agent sur la carte ce qu’il ferait pour vous.",
      liveDone: "C’était votre essai gratuit du jour. Après réservation, cela tourne chaque jour sur vos propres comptes, et vous validez dans votre espace Studio.",
      business: "Votre activité",
      hints: {
        workflow: { business: "p. ex. cabinet de physiothérapie à Genève", detailLabel: "Un message qu’un nouveau client pourrait vous envoyer", detail: "p. ex. Bonjour, avez-vous du temps cette semaine pour…" },
        social: { business: "p. ex. boulangerie familiale à Lausanne", detailLabel: "Ce que montre votre photo ou vidéo", detail: "p. ex. Croissants tout juste sortis du four" },
      },
      signedInAs: (name) => `Connecté en tant que ${name || "vous"} · 1 essai gratuit`,
      run: "Lancer en direct",
      running: "En cours…",
      error: "Une erreur est survenue. Veuillez réessayer.",
      unreachable: "La démo n’a pas répondu à temps. Veuillez réessayer dans une minute.",
    },
    ws: {
      overview: "Vue d’ensemble",
      social: "Réseaux sociaux",
      workflows: "Workflows d’agents",
      workflowsShort: "Workflows",
      title: "Votre espace",
      sub: "Tout ce que vos services 4XOR font pour vous, au même endroit.",
      leads: {
        social: "Un seul envoi. Les publications pour chaque canal sont rédigées, programmées et attendent votre accord.",
        workflow: "Votre équipe IA s’occupe chaque jour du travail de routine et planifie la semaine suivante à partir des résultats.",
      },
      tabs: { create: "Créer", approve: "Valider", schedule: "Planifier", results: "Résultats", team: "Votre équipe IA", goals: "Objectifs et plan de la semaine" },
      actions: {
        create: ["Créer des publications", "Envoyer photos ou vidéos"],
        approve: ["Valider les publications", "Vous décidez de ce qui part"],
        schedule: ["Planning de publication", "À quelle fréquence par canal"],
        results: ["Résultats", "Portée et engagement"],
        team: ["Votre équipe IA", "Qui fait quoi, en ce moment"],
        goals: ["Objectifs et plan de la semaine", "Fixez un objectif, recevez un plan"],
      },
      teamSub: "Chacun a sa tâche, travaille jour et nuit et rend compte de ce qu’il a fait.",
      weekPlan: "Voir le plan de la semaine",
    },
  },

  it: {
    promo: "Un prodotto 4XOR.",
    promoExtra: " Agenti IA e automazione dalla Svizzera, vedi 4xor.de",
    homeLabel: "4XOR Studio, home",
    menu: "Menu",
    langLabel: "Lingua",
    groups: { services: "Servizi", studio: "Studio" },
    tryLive: "Aprire la demo",
    signIn: "Accedere",
    cta: "Prenoti un colloquio gratuito",
    request: "Richiedere il servizio",
    askAgent: "Chiedere all’agente sulla mappa Be[X]",
    footerPlace: "4XOR, Aesch, Svizzera",
    mapLink: "Mappa Be[X]",
    landing: {
      eyebrow: "4XOR Studio",
      title: "La sua attività continua mentre lei si occupa dei clienti.",
      sub: "Due servizi IA pronti all’uso, configurati e gestiti da 4XOR. Il suo spazio Studio mostra cosa fanno per lei, e lei approva ciò che esce.",
      steps: "Operativo in 30 giorni",
      stepNames: ["Capire", "Prototipo", "Sviluppo", "Messa in funzione"],
    },
    products: {
      workflow: {
        lead: "Il lavoro di routine si fa da solo, e il suo team approva ciò che conta.",
        outcomes: [
          "Le nuove richieste ricevono risposta in pochi minuti",
          "Le prenotazioni finiscono nel suo calendario",
          "E-mail e report partono puntuali",
          "I suoi strumenti si passano i dati, senza copia e incolla",
        ],
        note: "Inizi con un processo e aggiunga il successivo appena conviene.",
      },
      social: {
        lead: "I suoi canali restano attivi ogni settimana mentre lei si occupa dei clienti.",
        outcomes: [
          "Un solo caricamento diventa un post per ogni canale",
          "Testi e hashtag scritti con il suo tono",
          "Post programmati al momento giusto",
          "Nulla esce senza la sua approvazione",
        ],
        note: "Instagram, TikTok, YouTube, Facebook e WhatsApp.",
      },
    },
    try: {
      eyebrow: "Provare dal vivo",
      titles: { workflow: "Una nuova richiesta, gestita e prenotata", social: "Un caricamento, un post per ogni canale" },
      steps: {
        workflow: ["Arriva la richiesta", "L’IA la capisce", "Risposta scritta", "Appuntamento proposto", "CRM e promemoria"],
        social: ["Lei carica", "Con il suo marchio", "Post scritti", "Una sola approvazione", "Programmato"],
      },
      watch: (product, minutes) => [`Guardi ${product} fare in pochi secondi ciò che di solito richiede a una persona `, `${minutes} minuti`, ". Poi lo avvii una volta per la sua attività."],
      example: "Esempio: ",
      liveFor: "Prova dal vivo per ",
      replay: "Riproduci",
      newMessage: "Nuovo messaggio · ora",
      reply: "Risposta",
      urgency: "Urgenza",
      urgencyLevels: { low: "bassa", medium: "media", high: "alta" },
      offered: "Orari proposti:",
      crm: "CRM",
      followUp: "Promemoria",
      approveAll: (n) => `Approvare per tutti i ${n} canali`,
      done: (minutes) => ["Fatto in meno di un minuto. A mano servono circa ", `${minutes} minuti`, ", ogni volta."],
      yourTurn: "Tocca a lei",
      yourTurnText: "Una prova dal vivo gratuita al giorno per ogni servizio, scritta dall’IA per la sua attività. Acceda con il suo account 4XOR.",
      signInPrompt: (product) => `Acceda una volta, poi avvii ${product} per la sua attività.`,
      signInToRun: "Accedere e avviare",
      used: "Ha già usato la prova gratuita di oggi. La prossima è pronta domani. Vuole che funzioni ogni giorno per la sua attività?",
      soon: "La prova dal vivo con la sua attività arriva presto. Nel frattempo chieda a noi o all’agente sulla mappa cosa farebbe per lei.",
      liveDone: "Questa era la sua prova gratuita di oggi. Dopo la prenotazione funziona ogni giorno con i suoi account, e lei approva nel suo spazio Studio.",
      business: "La sua attività",
      hints: {
        workflow: { business: "p. es. studio di fisioterapia a Lugano", detailLabel: "Un messaggio che un nuovo cliente potrebbe inviarle", detail: "p. es. Buongiorno, ha tempo questa settimana per…" },
        social: { business: "p. es. panetteria di famiglia a Bellinzona", detailLabel: "Cosa mostra la sua foto o il suo video", detail: "p. es. Cornetti appena sfornati" },
      },
      signedInAs: (name) => `Accesso come ${name || "lei"} · 1 prova gratuita`,
      run: "Avviare dal vivo",
      running: "In corso…",
      error: "Qualcosa è andato storto. Riprovi.",
      unreachable: "La demo non ha risposto in tempo. Riprovi tra un minuto.",
    },
    ws: {
      overview: "Panoramica",
      social: "Social media",
      workflows: "Workflow degli agenti",
      workflowsShort: "Workflow",
      title: "Il suo spazio",
      sub: "Tutto ciò che i suoi servizi 4XOR fanno per lei, in un unico posto.",
      leads: {
        social: "Un solo caricamento. I post per ogni canale vengono scritti, programmati e attendono il suo OK.",
        workflow: "Il suo team IA si occupa ogni giorno del lavoro di routine e pianifica la settimana successiva in base ai risultati.",
      },
      tabs: { create: "Creare", approve: "Approvare", schedule: "Pianificare", results: "Risultati", team: "Il suo team IA", goals: "Obiettivi e piano settimanale" },
      actions: {
        create: ["Creare post", "Caricare foto o video"],
        approve: ["Approvare i post", "Decide lei cosa esce"],
        schedule: ["Piano di pubblicazione", "Quanto spesso per canale"],
        results: ["Risultati", "Copertura e interazioni"],
        team: ["Il suo team IA", "Chi fa cosa, adesso"],
        goals: ["Obiettivi e piano settimanale", "Fissi un obiettivo, riceva un piano"],
      },
      teamSub: "Ognuno ha un compito, lavora giorno e notte e riferisce cosa ha fatto.",
      weekPlan: "Vedere il piano della settimana",
    },
  },
};

export { PRODUCT };
