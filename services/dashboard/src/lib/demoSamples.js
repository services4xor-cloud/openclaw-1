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

const ES_INPUT = {
  social: { business: "Panadería Alpina, una panadería familiar en Basilea", detail: "Foto de cruasanes recién salidos del horno a las 6 de la mañana" },
  workflow: {
    business: "Keller Physio, una consulta de fisioterapia en Zúrich",
    detail: "Hola, soy Laura. El fin de semana pasado me lastimé la rodilla esquiando y sigue hinchada. ¿Tienen una cita libre esta semana? Trabajo hasta las 17:00. Gracias, Laura Meier",
  },
};
const ES_RESULT = {
  social: {
    posts: [
      { channel: "Instagram", caption: "Son las 6 de la mañana y sale la primera bandeja 🥐 Dorados, hojaldrados y todavía calientes. ¿Quién se pasa antes del trabajo?", hashtags: ["#Basilea", "#Panadería", "#Cruasán", "#RecienHecho", "#BuenosDías"], bestTime: "mar 07:15" },
      { channel: "Facebook", caption: "Cada mañana a las 6 nuestros cruasanes salen del horno, hechos igual que desde 1987. ¡Venga temprano, vuelan!", hashtags: ["#PanaderíaAlpina", "#Basilea", "#Cruasanes"], bestTime: "mar 08:00" },
      { channel: "LinkedIn", caption: "Detrás de cada cruasán hay un despertador a las 4. Orgullosos de nuestro equipo de madrugada, que mantiene viva una tradición de Basilea, bandeja a bandeja.", hashtags: ["#Pymes", "#Artesanía", "#Basilea"], bestTime: "mié 08:30" },
      { channel: "TikTok", caption: "POV: eres el primero en la panadería a las 6 🥐✨ escucha ese crujido", hashtags: ["#panadería", "#cruasán", "#asmr", "#basilea"], bestTime: "jue 18:30" },
    ],
    minutesSaved: 45,
  },
  workflow: {
    lead: { name: "Laura Meier", need: "Lesión de rodilla esquiando, cita esta semana después de las 17:00", urgency: "high" },
    reply: {
      subject: "Su rodilla: cita esta semana",
      body: "Estimada Sra. Meier:\n\nLamentamos lo de su rodilla. Una hinchazón una semana después de una caída conviene revisarla pronto, así que nos gustaría verla esta semana. Tenemos citas por la tarde después de las 17:00, vea abajo. Hasta entonces: reposo, hielo 15 minutos varias veces al día y la pierna en alto.\n\nElija un horario y se lo confirmamos enseguida.\n\nUn cordial saludo,\nKeller Physio",
    },
    slots: ["mar 17:30", "mié 18:00", "jue 17:15"],
    crmNote: "Paciente nueva · rodilla (esquí) · urgente · prefiere después de las 17:00",
    followUp: "jue 09:00: recordatorio amable si no elige horario",
    minutesSaved: 25,
  },
};

const ZH_INPUT = {
  social: { business: "阿尔卑斯面包坊，巴塞尔的一家家庭面包店", detail: "清晨 6 点刚出炉的牛角包照片" },
  workflow: {
    business: "Keller Physio，苏黎世的一家理疗诊所",
    detail: "您好，我是 Laura。上周末滑雪时伤了膝盖，现在还肿着。请问这周还有空的预约吗？我工作到下午 5 点。谢谢，Laura Meier",
  },
};
const ZH_RESULT = {
  social: {
    posts: [
      { channel: "Instagram", caption: "早上 6 点，第一盘出炉了 🥐 金黄酥脆，还冒着热气。上班前谁来尝一个？", hashtags: ["#巴塞尔", "#面包店", "#牛角包", "#现烤", "#早安"], bestTime: "周二 07:15" },
      { channel: "Facebook", caption: "每天早上 6 点，我们的牛角包准时出炉，做法自 1987 年从未改变。早点来，卖得很快哦！", hashtags: ["#阿尔卑斯面包坊", "#巴塞尔", "#牛角包"], bestTime: "周二 08:00" },
      { channel: "LinkedIn", caption: "每一个牛角包背后，都是凌晨 4 点的起床。为我们的早班团队骄傲，他们一盘一盘地延续着巴塞尔的传统。", hashtags: ["#中小企业", "#手艺", "#巴塞尔"], bestTime: "周三 08:30" },
      { channel: "TikTok", caption: "第一视角：早上 6 点第一个走进面包店 🥐✨ 听听这酥脆的声音", hashtags: ["#面包店", "#牛角包", "#asmr", "#巴塞尔"], bestTime: "周四 18:30" },
    ],
    minutesSaved: 45,
  },
  workflow: {
    lead: { name: "Laura Meier", need: "滑雪导致膝盖受伤，希望本周下午 5 点后预约", urgency: "high" },
    reply: {
      subject: "关于您的膝盖：本周预约",
      body: "Meier 女士，您好：\n\n得知您膝盖受伤，我们深表关切。摔伤一周后仍有肿胀，建议尽快检查，因此我们希望本周为您安排就诊。我们在下午 5 点后有晚间时段，见下方。在此之前，请注意休息，每天多次冰敷 15 分钟，并抬高腿部。\n\n请直接选择一个时间，我们会立即确认。\n\n此致\nKeller Physio",
    },
    slots: ["周二 17:30", "周三 18:00", "周四 17:15"],
    crmNote: "新患者 · 膝盖（滑雪）· 紧急 · 希望 17:00 以后",
    followUp: "周四 09:00：如未选择时间，发送友好提醒",
    minutesSaved: 25,
  },
};

const HI_INPUT = {
  social: { business: "अल्पाइन बेकरी, बाज़ल की एक पारिवारिक बेकरी", detail: "सुबह 6 बजे ओवन से निकले ताज़ा क्रोसाँ की फ़ोटो" },
  workflow: {
    business: "Keller Physio, ज़्यूरिख़ का एक फ़िज़ियोथेरेपी क्लिनिक",
    detail: "नमस्ते, मैं Laura हूँ। पिछले हफ़्ते के अंत में स्कीइंग करते समय मेरे घुटने में चोट लग गई और उसमें अब भी सूजन है। क्या इस हफ़्ते कोई अपॉइंटमेंट खाली है? मैं शाम 5 बजे तक काम करती हूँ। धन्यवाद, Laura Meier",
  },
};
const HI_RESULT = {
  social: {
    posts: [
      { channel: "Instagram", caption: "सुबह के 6 बजे और पहली ट्रे बाहर 🥐 सुनहरे, परतदार और अभी भी गरम। काम से पहले कौन आ रहा है?", hashtags: ["#Basel", "#बेकरी", "#क्रोसाँ", "#ताज़ा", "#सुप्रभात"], bestTime: "मंगल 07:15" },
      { channel: "Facebook", caption: "हर सुबह 6 बजे हमारे क्रोसाँ ओवन से निकलते हैं, 1987 से उसी तरीके से बने। जल्दी आइए, ये जल्दी ख़त्म हो जाते हैं!", hashtags: ["#अल्पाइनबेकरी", "#Basel", "#क्रोसाँ"], bestTime: "मंगल 08:00" },
      { channel: "LinkedIn", caption: "हर क्रोसाँ के पीछे सुबह 4 बजे की शुरुआत है। हमें अपनी सुबह की टीम पर गर्व है, जो एक-एक ट्रे के साथ बाज़ल की परंपरा को ज़िंदा रखती है।", hashtags: ["#छोटाकारोबार", "#कारीगरी", "#Basel"], bestTime: "बुध 08:30" },
      { channel: "TikTok", caption: "POV: सुबह 6 बजे बेकरी में सबसे पहले आप 🥐✨ यह कुरकुराहट सुनिए", hashtags: ["#बेकरी", "#क्रोसाँ", "#asmr", "#basel"], bestTime: "गुरु 18:30" },
    ],
    minutesSaved: 45,
  },
  workflow: {
    lead: { name: "Laura Meier", need: "स्कीइंग में घुटने की चोट, इस हफ़्ते शाम 5 बजे के बाद अपॉइंटमेंट", urgency: "high" },
    reply: {
      subject: "आपका घुटना: इस हफ़्ते अपॉइंटमेंट",
      body: "प्रिय Meier जी,\n\nआपके घुटने के बारे में जानकर हमें खेद है। गिरने के एक हफ़्ते बाद भी सूजन हो तो उसे जल्दी दिखाना चाहिए, इसलिए हम आपको इसी हफ़्ते देखना चाहेंगे। हमारे पास शाम 5 बजे के बाद के समय हैं, नीचे देखें। तब तक: आराम करें, दिन में कई बार 15 मिनट बर्फ़ लगाएँ और पैर ऊपर रखें।\n\nबस एक समय चुनें, हम तुरंत पुष्टि कर देंगे।\n\nसादर,\nKeller Physio",
    },
    slots: ["मंगल 17:30", "बुध 18:00", "गुरु 17:15"],
    crmNote: "नई मरीज़ · घुटना (स्कीइंग) · अत्यावश्यक · 17:00 के बाद पसंद",
    followUp: "गुरु 09:00: कोई समय न चुनने पर विनम्र रिमाइंडर",
    minutesSaved: 25,
  },
};

export const SAMPLE_INPUT = { en: EN_INPUT, de: DE_INPUT, fr: FR_INPUT, it: IT_INPUT, es: ES_INPUT, zh: ZH_INPUT, hi: HI_INPUT };
export const SAMPLE_RESULT = { en: EN_RESULT, de: DE_RESULT, fr: FR_RESULT, it: IT_RESULT, es: ES_RESULT, zh: ZH_RESULT, hi: HI_RESULT };
