// Example runs the demo plays before anyone signs in, in the same shape the
// live API returns, so the animation is identical for both.
const EN_INPUT = {
  social: {
    business: "Alpine Bakery, a family bakery in Basel",
    detail: "Photo of fresh croissants coming out of the oven at 6 am",
  },
  workflow: {
    business: "Keller Physio, a physiotherapy practice in Zurich",
    detail:
      "Hi, I'm Laura. I hurt my knee skiing last weekend and it's still swollen. Do you have an appointment this week? I work until 5 pm. Thanks, Laura Meier",
  },
};

const EN_RESULT = {
  social: {
    posts: [
      {
        channel: "Instagram",
        caption: "6:00 am and the first tray is out 🥐 Golden, flaky and still warm. Who's stopping by before work?",
        hashtags: ["#Basel", "#Bakery", "#Croissant", "#FreshBaked", "#GoodMorning"],
        bestTime: "Tue 07:15",
      },
      {
        channel: "Facebook",
        caption: "Every morning at 6 our croissants come out of the oven, made the same way since 1987. Come early, they go fast!",
        hashtags: ["#AlpineBakery", "#Basel", "#Croissants"],
        bestTime: "Tue 08:00",
      },
      {
        channel: "LinkedIn",
        caption: "Behind every croissant is a 4 am start. Proud of our early team keeping a Basel tradition alive, one tray at a time.",
        hashtags: ["#SmallBusiness", "#Craft", "#Basel"],
        bestTime: "Wed 08:30",
      },
      {
        channel: "TikTok",
        caption: "POV: you're the first one in the bakery at 6 am 🥐✨ listen to that crunch",
        hashtags: ["#bakery", "#croissant", "#asmr", "#basel"],
        bestTime: "Thu 18:30",
      },
    ],
    minutesSaved: 45,
  },
  workflow: {
    lead: { name: "Laura Meier", need: "Knee injury from skiing, appointment this week after 5 pm", urgency: "high" },
    reply: {
      subject: "Your knee: appointment this week",
      body:
        "Hi Laura,\n\nSorry to hear about your knee. Swelling a week after a fall should be looked at soon, so we'd like to see you this week. We have evening slots after 5 pm, see below. Until then: rest, ice for 15 minutes a few times a day, and keep the leg up.\n\nJust pick a time and we'll confirm right away.\n\nBest regards,\nKeller Physio",
    },
    slots: ["Tue 17:30", "Wed 18:00", "Thu 17:15"],
    crmNote: "New patient · knee injury (skiing) · urgent · prefers after 17:00",
    followUp: "Thu 09:00: friendly reminder if no slot is picked",
    minutesSaved: 25,
  },
};

const DE_INPUT = {
  social: { business: "Alpen-Bäckerei, eine Familienbäckerei in Basel", detail: "Foto von frischen Gipfeli, die um 6 Uhr aus dem Ofen kommen" },
  workflow: {
    business: "Keller Physio, eine Physiotherapie-Praxis in Zürich",
    detail: "Grüezi, ich bin Laura. Ich habe mir letztes Wochenende beim Skifahren das Knie verletzt und es ist immer noch geschwollen. Haben Sie diese Woche einen Termin frei? Ich arbeite bis 17 Uhr. Danke, Laura Meier",
  },
};
const DE_RESULT = {
  social: {
    posts: [
      { channel: "Instagram", caption: "6 Uhr früh und das erste Blech ist draussen 🥐 Goldig, blättrig und noch warm. Wer kommt vor der Arbeit vorbei?", hashtags: ["#Basel", "#Bäckerei", "#Gipfeli", "#FrischGebacken", "#GutenMorgen"], bestTime: "Di 07:15" },
      { channel: "Facebook", caption: "Jeden Morgen um 6 kommen unsere Gipfeli aus dem Ofen, gebacken wie seit 1987. Kommen Sie früh, sie sind schnell weg!", hashtags: ["#AlpenBäckerei", "#Basel", "#Gipfeli"], bestTime: "Di 08:00" },
      { channel: "LinkedIn", caption: "Hinter jedem Gipfeli steckt ein Start um 4 Uhr. Stolz auf unser Frühteam, das eine Basler Tradition lebendig hält, Blech für Blech.", hashtags: ["#KMU", "#Handwerk", "#Basel"], bestTime: "Mi 08:30" },
      { channel: "TikTok", caption: "POV: Du bist um 6 Uhr als Erste in der Bäckerei 🥐✨ hör dir dieses Knuspern an", hashtags: ["#bäckerei", "#gipfeli", "#asmr", "#basel"], bestTime: "Do 18:30" },
    ],
    minutesSaved: 45,
  },
  workflow: {
    lead: { name: "Laura Meier", need: "Knieverletzung vom Skifahren, Termin diese Woche nach 17 Uhr", urgency: "high" },
    reply: {
      subject: "Ihr Knie: Termin diese Woche",
      body: "Grüezi Frau Meier\n\nDas mit Ihrem Knie tut uns leid. Eine Schwellung eine Woche nach einem Sturz sollte bald angeschaut werden, deshalb möchten wir Sie diese Woche sehen. Wir haben Abendtermine nach 17 Uhr, siehe unten. Bis dahin: schonen, mehrmals täglich 15 Minuten kühlen und das Bein hochlagern.\n\nWählen Sie einfach einen Termin, wir bestätigen sofort.\n\nFreundliche Grüsse\nKeller Physio",
    },
    slots: ["Di 17:30", "Mi 18:00", "Do 17:15"],
    crmNote: "Neue Patientin · Knieverletzung (Ski) · dringend · bevorzugt nach 17 Uhr",
    followUp: "Do 09:00: freundliche Erinnerung, falls kein Termin gewählt",
    minutesSaved: 25,
  },
};

const FR_INPUT = {
  social: { business: "Boulangerie des Alpes, une boulangerie familiale à Lausanne", detail: "Photo de croissants tout juste sortis du four à 6 h" },
  workflow: {
    business: "Keller Physio, un cabinet de physiothérapie à Genève",
    detail: "Bonjour, je suis Laura. Je me suis blessée au genou au ski le week-end dernier et il est toujours enflé. Avez-vous un rendez-vous cette semaine ? Je travaille jusqu’à 17 h. Merci, Laura Meier",
  },
};
const FR_RESULT = {
  social: {
    posts: [
      { channel: "Instagram", caption: "6 h du matin et la première plaque est sortie 🥐 Dorés, feuilletés et encore chauds. Qui passe avant le travail ?", hashtags: ["#Lausanne", "#Boulangerie", "#Croissant", "#FaitMaison", "#Bonjour"], bestTime: "mar. 07:15" },
      { channel: "Facebook", caption: "Chaque matin à 6 h, nos croissants sortent du four, faits comme depuis 1987. Venez tôt, ils partent vite !", hashtags: ["#BoulangerieDesAlpes", "#Lausanne", "#Croissants"], bestTime: "mar. 08:00" },
      { channel: "LinkedIn", caption: "Derrière chaque croissant, un réveil à 4 h. Fiers de notre équipe du matin qui fait vivre une tradition, plaque après plaque.", hashtags: ["#PME", "#Artisanat", "#Lausanne"], bestTime: "mer. 08:30" },
      { channel: "TikTok", caption: "POV : tu es le premier à la boulangerie à 6 h 🥐✨ écoute ce croustillant", hashtags: ["#boulangerie", "#croissant", "#asmr", "#lausanne"], bestTime: "jeu. 18:30" },
    ],
    minutesSaved: 45,
  },
  workflow: {
    lead: { name: "Laura Meier", need: "Blessure au genou (ski), rendez-vous cette semaine après 17 h", urgency: "high" },
    reply: {
      subject: "Votre genou : rendez-vous cette semaine",
      body: "Bonjour Madame Meier,\n\nNous sommes désolés pour votre genou. Un gonflement une semaine après une chute doit être examiné rapidement, nous aimerions donc vous voir cette semaine. Nous avons des créneaux en soirée après 17 h, voir ci-dessous. D’ici là : repos, glace 15 minutes plusieurs fois par jour et jambe surélevée.\n\nChoisissez simplement un créneau, nous confirmons tout de suite.\n\nMeilleures salutations,\nKeller Physio",
    },
    slots: ["mar. 17:30", "mer. 18:00", "jeu. 17:15"],
    crmNote: "Nouvelle patiente · genou (ski) · urgent · préfère après 17 h",
    followUp: "jeu. 09:00 : rappel aimable si aucun créneau choisi",
    minutesSaved: 25,
  },
};

const IT_INPUT = {
  social: { business: "Panetteria Alpina, una panetteria di famiglia a Bellinzona", detail: "Foto di cornetti appena sfornati alle 6 del mattino" },
  workflow: {
    business: "Keller Physio, uno studio di fisioterapia a Lugano",
    detail: "Buongiorno, sono Laura. Lo scorso fine settimana mi sono fatta male al ginocchio sciando ed è ancora gonfio. Avete un appuntamento questa settimana? Lavoro fino alle 17. Grazie, Laura Meier",
  },
};
const IT_RESULT = {
  social: {
    posts: [
      { channel: "Instagram", caption: "Le 6 del mattino e la prima teglia è pronta 🥐 Dorati, friabili e ancora caldi. Chi passa prima del lavoro?", hashtags: ["#Bellinzona", "#Panetteria", "#Cornetti", "#Sfornati", "#Buongiorno"], bestTime: "mar 07:15" },
      { channel: "Facebook", caption: "Ogni mattina alle 6 i nostri cornetti escono dal forno, fatti come dal 1987. Venite presto, finiscono in fretta!", hashtags: ["#PanetteriaAlpina", "#Bellinzona", "#Cornetti"], bestTime: "mar 08:00" },
      { channel: "LinkedIn", caption: "Dietro ogni cornetto c’è una sveglia alle 4. Orgogliosi del nostro team del mattino che tiene viva una tradizione, teglia dopo teglia.", hashtags: ["#PMI", "#Artigianato", "#Ticino"], bestTime: "mer 08:30" },
      { channel: "TikTok", caption: "POV: sei il primo in panetteria alle 6 🥐✨ ascolta questa croccantezza", hashtags: ["#panetteria", "#cornetti", "#asmr", "#ticino"], bestTime: "gio 18:30" },
    ],
    minutesSaved: 45,
  },
  workflow: {
    lead: { name: "Laura Meier", need: "Infortunio al ginocchio (sci), appuntamento questa settimana dopo le 17", urgency: "high" },
    reply: {
      subject: "Il suo ginocchio: appuntamento questa settimana",
      body: "Buongiorno signora Meier,\n\nci dispiace per il suo ginocchio. Un gonfiore una settimana dopo una caduta va controllato presto, per questo vorremmo vederla questa settimana. Abbiamo orari serali dopo le 17, vedi sotto. Nel frattempo: riposo, ghiaccio per 15 minuti più volte al giorno e gamba sollevata.\n\nScelga un orario, confermiamo subito.\n\nCordiali saluti,\nKeller Physio",
    },
    slots: ["mar 17:30", "mer 18:00", "gio 17:15"],
    crmNote: "Nuova paziente · ginocchio (sci) · urgente · preferisce dopo le 17",
    followUp: "gio 09:00: promemoria cortese se nessun orario scelto",
    minutesSaved: 25,
  },
};

export const SAMPLE_INPUT = { en: EN_INPUT, de: DE_INPUT, fr: FR_INPUT, it: IT_INPUT };
export const SAMPLE_RESULT = { en: EN_RESULT, de: DE_RESULT, fr: FR_RESULT, it: IT_RESULT };
