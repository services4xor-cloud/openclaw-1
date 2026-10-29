// The words of the workspace pages (create, approve, schedule, results, goals, AI
// team) in every Studio language. One row per text, in the order of LANGS:
// English, German, French, Italian, Spanish, Chinese, Hindi, Arabic. {name} is filled in.
import { LANGS, useLang } from "./i18n.jsx";

const ROWS = {
  // Create posts
  "up.title": ["Create posts", "Beiträge erstellen", "Créer des publications", "Crea post", "Crear publicaciones", "创建帖子", "पोस्ट बनाएँ", "إنشاء منشورات"],
  "up.sub": [
    "Upload photos or videos. You get ready-to-approve posts for every channel.",
    "Laden Sie Fotos oder Videos hoch. Sie erhalten freigabebereite Beiträge für jeden Kanal.",
    "Importez des photos ou des vidéos. Vous recevez des publications prêtes à approuver pour chaque canal.",
    "Carica foto o video. Ricevi post pronti da approvare per ogni canale.",
    "Suba fotos o vídeos. Recibirá publicaciones listas para aprobar en cada canal.",
    "上传照片或视频，即可获得适合每个渠道、待您审批的帖子。",
    "फ़ोटो या वीडियो अपलोड करें। आपको हर चैनल के लिए मंज़ूरी के लिए तैयार पोस्ट मिलती हैं।",
    "ارفع صورًا أو مقاطع فيديو. تحصل على منشورات جاهزة للاعتماد لكل قناة.",
  ],
  "up.step0": ["Brand kit received", "Brand-Kit erhalten", "Kit de marque reçu", "Kit del marchio ricevuto", "Kit de marca recibido", "已收到品牌素材", "ब्रांड किट मिल गई", "استُلمت حزمة الهوية"],
  "up.step1": ["Media uploaded", "Medien hochgeladen", "Médias importés", "Contenuti caricati", "Archivos subidos", "媒体已上传", "मीडिया अपलोड हुआ", "رُفعت الوسائط"],
  "up.step2": ["AI writes a post for every channel", "KI schreibt einen Beitrag für jeden Kanal", "L’IA rédige une publication pour chaque canal", "L’IA scrive un post per ogni canale", "La IA redacta una publicación para cada canal", "AI 为每个渠道撰写帖子", "AI हर चैनल के लिए पोस्ट लिखता है", "الذكاء الاصطناعي يكتب منشورًا لكل قناة"],
  "up.step3": ["Best posting times planned", "Beste Zeitpunkte eingeplant", "Meilleurs horaires planifiés", "Orari migliori pianificati", "Mejores horarios planificados", "已规划最佳发布时间", "पोस्ट के सबसे अच्छे समय तय हुए", "خُطّطت أفضل أوقات النشر"],
  "up.step4": ["Ready for your approval", "Bereit für Ihre Freigabe", "Prêt pour votre approbation", "Pronto per la tua approvazione", "Listo para su aprobación", "等待您审批", "आपकी मंज़ूरी के लिए तैयार", "جاهز لاعتمادك"],
  "up.err404": ["The service didn't answer (404).", "Der Dienst hat nicht geantwortet (404).", "Le service n’a pas répondu (404).", "Il servizio non ha risposto (404).", "El servicio no respondió (404).", "服务未响应（404）。", "सेवा ने जवाब नहीं दिया (404)।", "لم تستجب الخدمة (404)."],
  "up.errStatus": ["The service answered {status}.", "Der Dienst antwortete mit {status}.", "Le service a répondu {status}.", "Il servizio ha risposto {status}.", "El servicio respondió {status}.", "服务返回 {status}。", "सेवा ने {status} लौटाया।", "أجابت الخدمة بالرمز {status}."],
  "up.failed": [
    "This step didn't finish. {message} Nothing was posted.",
    "Dieser Schritt wurde nicht abgeschlossen. {message} Es wurde nichts veröffentlicht.",
    "Cette étape n’a pas abouti. {message} Rien n’a été publié.",
    "Questo passaggio non è stato completato. {message} Non è stato pubblicato nulla.",
    "Este paso no terminó. {message} No se publicó nada.",
    "此步骤未完成。{message} 未发布任何内容。",
    "यह चरण पूरा नहीं हुआ। {message} कुछ भी पोस्ट नहीं हुआ।",
    "لم تكتمل هذه الخطوة. {message} لم يُنشر أي شيء.",
  ],
  "up.retry": ["Try again", "Erneut versuchen", "Réessayer", "Riprova", "Intentar de nuevo", "重试", "फिर से कोशिश करें", "حاول مرة أخرى"],
  "up.back": ["Back to the form", "Zurück zum Formular", "Retour au formulaire", "Torna al modulo", "Volver al formulario", "返回表单", "फ़ॉर्म पर वापस", "العودة إلى النموذج"],
  "up.drop": ["Tap to select or drop files", "Tippen zum Auswählen oder Dateien hierher ziehen", "Touchez pour choisir ou déposez des fichiers", "Tocca per scegliere o trascina qui i file", "Toque para elegir o arrastre archivos aquí", "点按选择或拖放文件", "चुनने के लिए टैप करें या फ़ाइलें यहाँ छोड़ें", "اضغط للاختيار أو اسحب الملفات إلى هنا"],
  "up.dropHint": ["Images and videos, up to 500 MB each", "Bilder und Videos, je bis 500 MB", "Images et vidéos, jusqu’à 500 Mo chacune", "Immagini e video, fino a 500 MB ciascuno", "Imágenes y vídeos, hasta 500 MB cada uno", "图片和视频，每个最大 500 MB", "चित्र और वीडियो, हर एक 500 MB तक", "صور ومقاطع فيديو، حتى 500 MB لكل ملف"],
  "up.selected": ["Files selected: {n}", "Ausgewählte Dateien: {n}", "Fichiers choisis : {n}", "File selezionati: {n}", "Archivos elegidos: {n}", "已选文件：{n}", "चुनी गई फ़ाइलें: {n}", "الملفات المختارة: {n}"],
  "up.clear": ["Clear all", "Alle entfernen", "Tout retirer", "Rimuovi tutti", "Quitar todos", "全部清除", "सब हटाएँ", "إزالة الكل"],
  "up.watermark": ["Watermark", "Wasserzeichen", "Filigrane", "Filigrana", "Marca de agua", "水印", "वॉटरमार्क", "العلامة المائية"],
  "up.remove": ["Remove", "Entfernen", "Retirer", "Rimuovi", "Quitar", "移除", "हटाएँ", "إزالة"],
  "up.addWatermark": ["Upload a watermark image (PNG recommended)", "Wasserzeichen-Bild hochladen (PNG empfohlen)", "Importer une image de filigrane (PNG recommandé)", "Carica un’immagine per la filigrana (consigliato PNG)", "Subir una imagen de marca de agua (se recomienda PNG)", "上传水印图片（建议 PNG）", "वॉटरमार्क की छवि अपलोड करें (PNG बेहतर है)", "ارفع صورة للعلامة المائية (يُفضَّل PNG)"],
  "up.direction": ["Content direction", "Inhaltliche Richtung", "Orientation du contenu", "Direzione dei contenuti", "Orientación del contenido", "内容方向", "कंटेंट की दिशा", "توجّه المحتوى"],
  "up.themePh": [
    "Describe the theme or direction, e.g. summer fitness campaign, energetic, beach look",
    "Beschreiben Sie Thema oder Richtung, z. B. Sommer-Fitness-Kampagne, energiegeladen, Strand-Look",
    "Décrivez le thème ou l’orientation, p. ex. campagne fitness d’été, énergique, ambiance plage",
    "Descrivi il tema o la direzione, p. es. campagna fitness estiva, energica, stile spiaggia",
    "Describa el tema o la orientación, p. ej. campaña de fitness de verano, enérgica, estilo playa",
    "描述主题或方向，例如：夏季健身活动，充满活力，海滩风格",
    "विषय या दिशा बताएँ, जैसे गर्मियों का फ़िटनेस अभियान, ऊर्जा से भरा, समुद्र तट जैसा लुक",
    "صِف الموضوع أو التوجّه، مثل: حملة لياقة صيفية، حيوية، بأجواء الشاطئ",
  ],
  "up.voicePh": [
    "Brand voice, e.g. casual but professional, few emoji, always a call to action",
    "Tonalität, z. B. locker, aber professionell, wenige Emojis, immer mit Handlungsaufruf",
    "Ton de la marque, p. ex. détendu mais professionnel, peu d’emoji, toujours un appel à l’action",
    "Tono del marchio, p. es. informale ma professionale, poche emoji, sempre un invito all’azione",
    "Tono de marca, p. ej. cercano pero profesional, pocos emojis, siempre una llamada a la acción",
    "品牌语气，例如：轻松但专业，少用表情，始终附上行动号召",
    "ब्रांड की आवाज़, जैसे सहज पर पेशेवर, कम इमोजी, हमेशा एक कॉल टू एक्शन",
    "أسلوب العلامة التجارية، مثل: ودّي لكن احترافي، رموز تعبيرية قليلة، ودائمًا دعوة إلى إجراء",
  ],
  "up.generate": ["Generate posts", "Beiträge erstellen", "Générer les publications", "Genera i post", "Generar publicaciones", "生成帖子", "पोस्ट बनाएँ", "إنشاء المنشورات"],

  // Posting schedule
  "cp.title": ["Posting schedule", "Veröffentlichungsplan", "Calendrier de publication", "Piano di pubblicazione", "Calendario de publicación", "发布计划", "पोस्टिंग शेड्यूल", "جدول النشر"],
  "cp.sub": [
    "Choose how often each channel gets a new post. Scheduling happens automatically.",
    "Wählen Sie, wie oft jeder Kanal einen neuen Beitrag erhält. Die Planung läuft automatisch.",
    "Choisissez la fréquence des publications pour chaque canal. La planification est automatique.",
    "Scegli quanto spesso ogni canale riceve un nuovo post. La pianificazione è automatica.",
    "Elija con qué frecuencia recibe cada canal una publicación nueva. La programación es automática.",
    "选择每个渠道的发帖频率，排期自动完成。",
    "चुनें कि हर चैनल पर कितनी बार नई पोस्ट जाए। शेड्यूलिंग अपने-आप होती है।",
    "اختر كم مرة تحصل كل قناة على منشور جديد. تتم الجدولة تلقائيًا.",
  ],
  "cp.perDay": ["Posts per day", "Beiträge pro Tag", "Publications par jour", "Post al giorno", "Publicaciones al día", "每天帖子数", "प्रति दिन पोस्ट", "منشورات يوميًا"],
  "cp.interval": ["Interval", "Abstand", "Intervalle", "Intervallo", "Intervalo", "间隔", "अंतराल", "الفاصل الزمني"],
  "cp.every": ["Every {h}", "Alle {h}", "Toutes les {h}", "Ogni {h}", "Cada {h}", "每 {h}", "हर {h}", "كل {h}"],
  "cp.times": ["Preferred times", "Bevorzugte Zeiten", "Horaires préférés", "Orari preferiti", "Horarios preferidos", "首选时间", "पसंदीदा समय", "الأوقات المفضّلة"],
  "cp.toggle": ["Turn {channel} on or off", "{channel} ein- oder ausschalten", "Activer ou désactiver {channel}", "Attiva o disattiva {channel}", "Activar o desactivar {channel}", "开启或关闭 {channel}", "{channel} चालू या बंद करें", "تشغيل {channel} أو إيقافه"],
  "cp.saving": ["Saving…", "Wird gespeichert…", "Enregistrement…", "Salvataggio…", "Guardando…", "正在保存…", "सहेजा जा रहा है…", "جارٍ الحفظ…"],
  "cp.save": ["Save schedule", "Plan speichern", "Enregistrer le calendrier", "Salva il piano", "Guardar calendario", "保存计划", "शेड्यूल सहेजें", "حفظ الجدول"],

  // Approve posts
  "q.title": ["Approve posts", "Beiträge freigeben", "Approuver les publications", "Approva i post", "Aprobar publicaciones", "审批帖子", "पोस्ट मंज़ूर करें", "اعتماد المنشورات"],
  "q.sub": [
    "One approval sends a post to every channel, scheduled for you.",
    "Eine Freigabe schickt einen Beitrag an jeden Kanal, für Sie eingeplant.",
    "Une seule approbation envoie la publication sur chaque canal, planifiée pour vous.",
    "Una sola approvazione invia il post a ogni canale, già pianificato.",
    "Una sola aprobación envía la publicación a cada canal, programada para usted.",
    "一次审批，即可将帖子发送到每个渠道，并自动排期。",
    "एक मंज़ूरी से पोस्ट हर चैनल पर जाती है, आपके लिए शेड्यूल होकर।",
    "اعتماد واحد يرسل المنشور إلى كل قناة، مجدولًا لك.",
  ],
  "q.runsOut": [
    "Posts run out today. Approve more to keep your channels active.",
    "Heute gehen die Beiträge aus. Geben Sie weitere frei, damit Ihre Kanäle aktiv bleiben.",
    "Les publications s’épuisent aujourd’hui. Approuvez-en d’autres pour garder vos canaux actifs.",
    "Oggi i post finiscono. Approvane altri per mantenere attivi i tuoi canali.",
    "Hoy se acaban las publicaciones. Apruebe más para mantener sus canales activos.",
    "帖子今天就会发完。请审批更多帖子，保持渠道活跃。",
    "आज पोस्ट ख़त्म हो जाएँगी। अपने चैनल सक्रिय रखने के लिए और मंज़ूर करें।",
    "تنفد المنشورات اليوم. اعتمد المزيد لتبقى قنواتك نشطة.",
  ],
  "q.left": ["Posts left for about {d}", "Beiträge für etwa {d}", "Publications pour environ {d}", "Post per circa {d}", "Publicaciones para unos {d}", "剩余帖子约够 {d}", "लगभग {d} की पोस्ट बची हैं", "تبقّت منشورات لنحو {d}"],
  "q.ready": ["Posts ready", "Bereite Beiträge", "Publications prêtes", "Post pronti", "Publicaciones listas", "待发帖子", "तैयार पोस्ट", "منشورات جاهزة"],
  "q.perChannel": ["days left per channel", "verbleibende Tage pro Kanal", "jours restants par canal", "giorni rimasti per canale", "días restantes por canal", "各渠道剩余天数", "हर चैनल के बचे दिन", "أيام متبقية لكل قناة"],
  "q.tab.stash": ["To approve", "Zur Freigabe", "À approuver", "Da approvare", "Por aprobar", "待审批", "मंज़ूरी बाकी", "بانتظار الاعتماد"],
  "q.tab.approved": ["Scheduled", "Eingeplant", "Planifiées", "Pianificati", "Programadas", "已排期", "शेड्यूल", "مجدولة"],
  "q.tab.published": ["Published", "Veröffentlicht", "Publiées", "Pubblicati", "Publicadas", "已发布", "प्रकाशित", "منشورة"],
  "q.refresh": ["Refresh", "Aktualisieren", "Actualiser", "Aggiorna", "Actualizar", "刷新", "रीफ़्रेश", "تحديث"],
  "q.approveAll": ["Approve all ({n})", "Alle freigeben ({n})", "Tout approuver ({n})", "Approva tutti ({n})", "Aprobar todas ({n})", "全部批准（{n}）", "सभी मंज़ूर करें ({n})", "اعتماد الكل ({n})"],
  "q.approve": ["Approve", "Freigeben", "Approuver", "Approva", "Aprobar", "批准", "मंज़ूर करें", "اعتماد"],
  "q.approveTitle": ["Approve for every channel", "Für jeden Kanal freigeben", "Approuver pour chaque canal", "Approva per ogni canale", "Aprobar para cada canal", "批准发布到每个渠道", "हर चैनल के लिए मंज़ूर करें", "اعتماد لكل القنوات"],
  "q.discard": ["Discard", "Verwerfen", "Écarter", "Scarta", "Descartar", "舍弃", "हटाएँ", "تجاهل"],
  "q.show": ["Show all {n} channel versions", "Alle {n} Kanalversionen anzeigen", "Voir les {n} versions par canal", "Mostra tutte le {n} versioni per canale", "Ver las {n} versiones por canal", "查看全部 {n} 个渠道版本", "सभी {n} चैनल संस्करण दिखाएँ", "عرض نسخ القنوات ({n})"],
  "q.hide": ["Hide the {n} channel versions", "Die {n} Kanalversionen ausblenden", "Masquer les {n} versions par canal", "Nascondi le {n} versioni per canale", "Ocultar las {n} versiones por canal", "收起 {n} 个渠道版本", "{n} चैनल संस्करण छिपाएँ", "إخفاء نسخ القنوات ({n})"],
  "q.approvedOn": ["Approved {date}, being scheduled", "Freigegeben am {date}, wird eingeplant", "Approuvée le {date}, en cours de planification", "Approvato il {date}, in pianificazione", "Aprobada el {date}, en programación", "{date} 已批准，正在排期", "{date} को मंज़ूर, शेड्यूल हो रही है", "اعتُمد في {date}، قيد الجدولة"],
  "q.publishedOn": ["Published {date}", "Veröffentlicht am {date}", "Publiée le {date}", "Pubblicato il {date}", "Publicada el {date}", "{date} 已发布", "{date} को प्रकाशित", "نُشر في {date}"],
  "q.addedOn": ["Added {date}", "Hinzugefügt am {date}", "Ajoutée le {date}", "Aggiunto il {date}", "Añadida el {date}", "{date} 添加", "{date} को जोड़ी गई", "أُضيف في {date}"],
  "q.content": ["Content", "Inhalt", "Contenu", "Contenuto", "Contenido", "内容", "कंटेंट", "المحتوى"],
  "q.empty.stash": [
    "Nothing to approve yet. Upload photos or videos to get new posts.",
    "Noch nichts freizugeben. Laden Sie Fotos oder Videos hoch, um neue Beiträge zu erhalten.",
    "Rien à approuver pour l’instant. Importez des photos ou des vidéos pour obtenir de nouvelles publications.",
    "Ancora nulla da approvare. Carica foto o video per ricevere nuovi post.",
    "Aún no hay nada que aprobar. Suba fotos o vídeos para recibir publicaciones nuevas.",
    "暂无待审批内容。上传照片或视频即可获得新帖子。",
    "अभी मंज़ूर करने को कुछ नहीं। नई पोस्ट के लिए फ़ोटो या वीडियो अपलोड करें।",
    "لا شيء بانتظار الاعتماد بعد. ارفع صورًا أو مقاطع فيديو للحصول على منشورات جديدة.",
  ],
  "q.empty.approved": [
    "Nothing scheduled yet. Approve posts to fill the schedule.",
    "Noch nichts eingeplant. Geben Sie Beiträge frei, um den Plan zu füllen.",
    "Rien de planifié pour l’instant. Approuvez des publications pour remplir le calendrier.",
    "Ancora nulla di pianificato. Approva dei post per riempire il piano.",
    "Aún no hay nada programado. Apruebe publicaciones para llenar el calendario.",
    "暂无排期。审批帖子即可填满计划。",
    "अभी कुछ शेड्यूल नहीं। शेड्यूल भरने के लिए पोस्ट मंज़ूर करें।",
    "لا شيء مجدول بعد. اعتمد منشورات لملء الجدول.",
  ],
  "q.empty.published": ["No posts published yet.", "Noch keine Beiträge veröffentlicht.", "Aucune publication pour l’instant.", "Ancora nessun post pubblicato.", "Aún no hay publicaciones.", "暂无已发布的帖子。", "अभी कोई पोस्ट प्रकाशित नहीं हुई।", "لم تُنشر أي منشورات بعد."],

  // Goals and weekly plan
  "g.title": ["Goals and weekly plan", "Ziele und Wochenplan", "Objectifs et plan de la semaine", "Obiettivi e piano settimanale", "Objetivos y plan semanal", "目标与周计划", "लक्ष्य और साप्ताहिक योजना", "الأهداف والخطة الأسبوعية"],
  "g.sub": [
    "You set the targets. Your AI team plans the week and does the work.",
    "Sie setzen die Ziele. Ihr KI-Team plant die Woche und erledigt die Arbeit.",
    "Vous fixez les objectifs. Votre équipe IA planifie la semaine et fait le travail.",
    "Tu fissi gli obiettivi. Il tuo team IA pianifica la settimana e svolge il lavoro.",
    "Usted fija los objetivos. Su equipo de IA planifica la semana y hace el trabajo.",
    "目标由您设定，AI 团队负责规划本周并完成工作。",
    "लक्ष्य आप तय करते हैं। आपकी AI टीम हफ़्ते की योजना बनाती है और काम करती है।",
    "أنت تحدد الأهداف. ويخطط فريق الذكاء الاصطناعي لديك للأسبوع وينجز العمل.",
  ],
  "g.week": ["This week's plan, week {n}", "Plan dieser Woche, KW {n}", "Plan de la semaine, semaine {n}", "Piano della settimana, settimana {n}", "Plan de esta semana, semana {n}", "本周计划（第 {n} 周）", "इस हफ़्ते की योजना, सप्ताह {n}", "خطة هذا الأسبوع، الأسبوع {n}"],
  "g.weekSub": [
    "Planned from last week's results. Updated every Monday.",
    "Geplant aus den Ergebnissen der Vorwoche. Jeden Montag aktualisiert.",
    "Établi à partir des résultats de la semaine dernière. Mis à jour chaque lundi.",
    "Pianificato dai risultati della settimana scorsa. Aggiornato ogni lunedì.",
    "Planificado según los resultados de la semana pasada. Se actualiza cada lunes.",
    "根据上周结果制定，每周一更新。",
    "पिछले हफ़्ते के नतीजों से बनी। हर सोमवार अपडेट होती है।",
    "مخطّطة بناءً على نتائج الأسبوع الماضي. تُحدَّث كل يوم اثنين.",
  ],
  "g.todo": ["To do", "Offen", "À faire", "Da fare", "Pendiente", "待办", "बाकी", "للتنفيذ"],
  "g.active": ["In progress", "In Arbeit", "En cours", "In corso", "En curso", "进行中", "जारी", "قيد التنفيذ"],
  "g.done": ["Done", "Erledigt", "Terminé", "Fatto", "Hecho", "已完成", "पूरा", "منجز"],
  "g.goals": ["Goals", "Ziele", "Objectifs", "Obiettivi", "Objetivos", "目标", "लक्ष्य", "الأهداف"],
  "g.add": ["Add goal", "Ziel hinzufügen", "Ajouter un objectif", "Aggiungi un obiettivo", "Añadir objetivo", "添加目标", "लक्ष्य जोड़ें", "إضافة هدف"],
  "g.type.growth_kpi": ["Growth KPI", "Wachstums-KPI", "KPI de croissance", "KPI di crescita", "KPI de crecimiento", "增长指标", "ग्रोथ KPI", "مؤشر نمو"],
  "g.type.business": ["Business", "Geschäft", "Activité", "Attività", "Negocio", "业务", "कारोबार", "أعمال"],
  "g.type.custom": ["Custom", "Eigenes", "Personnalisé", "Personalizzato", "Personalizado", "自定义", "अपना", "مخصّص"],
  "g.titlePh": ["Goal title…", "Titel des Ziels…", "Intitulé de l’objectif…", "Titolo dell’obiettivo…", "Título del objetivo…", "目标名称…", "लक्ष्य का शीर्षक…", "عنوان الهدف…"],
  "g.targetPh": ["Target number", "Zielwert", "Valeur cible", "Valore obiettivo", "Valor objetivo", "目标数值", "लक्ष्य संख्या", "الرقم المستهدف"],
  "g.addBtn": ["Add", "Hinzufügen", "Ajouter", "Aggiungi", "Añadir", "添加", "जोड़ें", "إضافة"],
  "g.tasks": ["This week's tasks", "Aufgaben dieser Woche", "Tâches de la semaine", "Attività della settimana", "Tareas de esta semana", "本周任务", "इस हफ़्ते के काम", "مهام هذا الأسبوع"],
  "g.tasksBy": ["Planned by your AI team", "Geplant von Ihrem KI-Team", "Planifiées par votre équipe IA", "Pianificate dal tuo team IA", "Planificadas por su equipo de IA", "由您的 AI 团队规划", "आपकी AI टीम द्वारा तय", "خطّطها فريق الذكاء الاصطناعي لديك"],
  "g.prio.high": ["high", "hoch", "haute", "alta", "alta", "高", "ज़्यादा", "عالية"],
  "g.prio.medium": ["medium", "mittel", "moyenne", "media", "media", "中", "मध्यम", "متوسطة"],
  "g.prio.low": ["low", "tief", "basse", "bassa", "baja", "低", "कम", "منخفضة"],
  "g.mock.1": ["Instagram: 10K followers", "Instagram: 10'000 Follower", "Instagram : 10 000 abonnés", "Instagram: 10.000 follower", "Instagram: 10 000 seguidores", "Instagram：1 万粉丝", "Instagram: 10K फ़ॉलोअर", "إنستغرام: 10 آلاف متابع"],
  "g.mock.2": ["TikTok: 50K views a week", "TikTok: 50'000 Aufrufe pro Woche", "TikTok : 50 000 vues par semaine", "TikTok: 50.000 visualizzazioni a settimana", "TikTok: 50 000 visualizaciones por semana", "TikTok：每周 5 万次观看", "TikTok: हर हफ़्ते 50K व्यूज़", "تيك توك: 50 ألف مشاهدة أسبوعيًا"],
  "g.mock.3": ["Website clicks: 500 a month", "Website-Klicks: 500 pro Monat", "Clics vers le site : 500 par mois", "Clic sul sito: 500 al mese", "Clics en la web: 500 al mes", "网站点击：每月 500 次", "वेबसाइट क्लिक: हर महीने 500", "نقرات الموقع: 500 شهريًا"],
  "g.mock.4": ["Posting streak: 30 days", "Serie ohne Pause: 30 Tage", "Publication régulière : 30 jours", "Pubblicazione costante: 30 giorni", "Racha de publicación: 30 días", "连续发布：30 天", "लगातार पोस्टिंग: 30 दिन", "النشر المتواصل: 30 يومًا"],
  "g.task.1": ["Create 5 Reels with product demos", "5 Reels mit Produktdemos erstellen", "Créer 5 Reels de démonstration produit", "Creare 5 Reel con demo del prodotto", "Crear 5 Reels con demos del producto", "制作 5 条产品演示 Reels", "प्रोडक्ट डेमो वाली 5 Reels बनाएँ", "إنشاء 5 مقاطع Reels بعروض للمنتج"],
  "g.task.2": ["Post 3 behind-the-scenes TikToks", "3 Blick-hinter-die-Kulissen-TikToks posten", "Publier 3 TikToks en coulisses", "Pubblicare 3 TikTok dietro le quinte", "Publicar 3 TikToks entre bastidores", "发布 3 条幕后花絮 TikTok", "पर्दे के पीछे की 3 TikTok पोस्ट करें", "نشر 3 مقاطع TikTok من الكواليس"],
  "g.task.3": ["Sharpen the hashtag strategy for reach", "Hashtag-Strategie für mehr Reichweite schärfen", "Affiner la stratégie de hashtags pour la portée", "Affinare la strategia di hashtag per la copertura", "Afinar la estrategia de hashtags para ganar alcance", "优化话题标签策略以扩大覆盖", "पहुँच बढ़ाने के लिए हैशटैग रणनीति सुधारें", "تحسين استراتيجية الوسوم لزيادة الوصول"],
  "g.task.4": ["A/B test caption styles on Facebook", "Textstile auf Facebook im A/B-Test vergleichen", "Tester en A/B les styles de légende sur Facebook", "Test A/B degli stili di testo su Facebook", "Prueba A/B de estilos de texto en Facebook", "在 Facebook 上 A/B 测试文案风格", "Facebook पर कैप्शन शैलियों का A/B टेस्ट", "اختبار A/B لأساليب التعليقات على فيسبوك"],

  // Results
  "a.title": ["Results", "Ergebnisse", "Résultats", "Risultati", "Resultados", "效果", "नतीजे", "النتائج"],
  "a.sub": [
    "Reach and engagement per channel. Your AI team uses them to plan next week.",
    "Reichweite und Interaktion pro Kanal. Ihr KI-Team plant damit die nächste Woche.",
    "Portée et engagement par canal. Votre équipe IA s’en sert pour planifier la semaine suivante.",
    "Copertura e interazioni per canale. Il tuo team IA le usa per pianificare la prossima settimana.",
    "Alcance e interacción por canal. Su equipo de IA los usa para planificar la próxima semana.",
    "各渠道的覆盖与互动数据，AI 团队据此规划下一周。",
    "हर चैनल की पहुँच और जुड़ाव। आपकी AI टीम इन्हीं से अगले हफ़्ते की योजना बनाती है।",
    "الوصول والتفاعل لكل قناة. يستخدمها فريق الذكاء الاصطناعي لديك للتخطيط للأسبوع القادم.",
  ],
  "a.followers": ["Followers", "Follower", "Abonnés", "Follower", "Seguidores", "粉丝", "फ़ॉलोअर", "المتابعون"],
  "a.views": ["Views", "Aufrufe", "Vues", "Visualizzazioni", "Visualizaciones", "观看", "व्यूज़", "المشاهدات"],
  "a.likes": ["Likes", "Likes", "J’aime", "Mi piace", "Me gusta", "点赞", "लाइक", "الإعجابات"],
  "a.shares": ["Shares", "Geteilt", "Partages", "Condivisioni", "Compartidos", "分享", "शेयर", "المشاركات"],
  "a.comments": ["Comments", "Kommentare", "Commentaires", "Commenti", "Comentarios", "评论", "टिप्पणियाँ", "التعليقات"],
  "a.week": ["{n} this week", "{n} diese Woche", "{n} cette semaine", "{n} questa settimana", "{n} esta semana", "本周 {n}", "इस हफ़्ते {n}", "{n} هذا الأسبوع"],
  "a.top": ["Top: {post}", "Top: {post}", "Top : {post}", "Top: {post}", "Lo mejor: {post}", "最佳：{post}", "सबसे अच्छी: {post}", "الأفضل: {post}"],
  "a.top.instagram": ["Morning routine Reel, 8.2K views", "Reel Morgenroutine, 8200 Aufrufe", "Reel routine du matin, 8 200 vues", "Reel routine mattutina, 8.200 visualizzazioni", "Reel rutina matinal, 8200 visualizaciones", "晨间习惯 Reel，8,200 次观看", "सुबह की दिनचर्या Reel, 8.2K व्यूज़", "Reel روتين الصباح، 8,200 مشاهدة"],
  "a.top.tiktok": ["POV morning routine, 22K views", "POV Morgenroutine, 22'000 Aufrufe", "POV routine du matin, 22 000 vues", "POV routine mattutina, 22.000 visualizzazioni", "POV rutina matinal, 22 000 visualizaciones", "第一视角晨间习惯，22,000 次观看", "POV सुबह की दिनचर्या, 22K व्यूज़", "POV روتين الصباح، 22,000 مشاهدة"],
  "a.top.youtube": ["5 morning habits Short, 4.1K views", "Short «5 Morgengewohnheiten», 4100 Aufrufe", "Short « 5 habitudes du matin », 4 100 vues", "Short «5 abitudini del mattino», 4.100 visualizzazioni", "Short «5 hábitos matinales», 4100 visualizaciones", "“5 个晨间习惯” Short，4,100 次观看", "“सुबह की 5 आदतें” Short, 4.1K व्यूज़", "Short «5 عادات صباحية»، 4,100 مشاهدة"],
  "a.top.facebook": ["Morning habits post, 2.1K reach", "Beitrag Morgengewohnheiten, 2100 erreicht", "Publication habitudes du matin, portée 2 100", "Post abitudini del mattino, copertura 2.100", "Publicación hábitos matinales, alcance 2100", "晨间习惯帖子，覆盖 2,100 人", "सुबह की आदतों वाली पोस्ट, 2.1K पहुँच", "منشور العادات الصباحية، وصول 2,100"],
  "a.top.whatsapp": ["Status seen by 98 contacts", "Status von 98 Kontakten gesehen", "Statut vu par 98 contacts", "Stato visto da 98 contatti", "Estado visto por 98 contactos", "状态被 98 位联系人查看", "स्टेटस 98 संपर्कों ने देखा", "شاهد الحالة 98 جهة اتصال"],

  // Your AI team
  "tr.working4u": ["Working for you", "Arbeitet für Sie", "Travaille pour vous", "Lavora per te", "Trabajando para usted", "正在为您工作", "आपके लिए काम कर रहे हैं", "يعملون لأجلك"],
  "tr.members": ["{n} workers", "{n} Mitarbeitende", "{n} membres", "{n} membri", "{n} miembros", "{n} 名成员", "{n} सदस्य", "{n} أعضاء"],
  "tr.refresh": ["Refresh team status", "Teamstatus aktualisieren", "Actualiser l’état de l’équipe", "Aggiorna lo stato del team", "Actualizar el estado del equipo", "刷新团队状态", "टीम की स्थिति रीफ़्रेश करें", "تحديث حالة الفريق"],
  "tr.count.working": ["{n} working", "{n} am Arbeiten", "{n} au travail", "{n} al lavoro", "{n} trabajando", "{n} 个工作中", "{n} काम पर", "{n} يعملون"],
  "tr.count.idle": ["{n} ready", "{n} bereit", "{n} prêts", "{n} pronti", "{n} listos", "{n} 个就绪", "{n} तैयार", "{n} جاهزون"],
  "tr.count.sleeping": ["{n} sleeping", "{n} im Ruhemodus", "{n} en veille", "{n} in pausa", "{n} en reposo", "{n} 个休眠", "{n} आराम में", "{n} في وضع السكون"],
  "tr.count.down": ["{n} down", "{n} gestört", "{n} hors service", "{n} non attivi", "{n} sin servicio", "{n} 个故障", "{n} बंद", "{n} متوقفون"],
  "tr.status.working": ["Working", "Arbeitet", "Au travail", "Al lavoro", "Trabajando", "工作中", "काम पर", "يعمل"],
  "tr.status.idle": ["Ready", "Bereit", "Prêt", "Pronto", "Listo", "就绪", "तैयार", "جاهز"],
  "tr.status.sleeping": ["Sleeping", "Ruhemodus", "En veille", "In pausa", "En reposo", "休眠", "आराम में", "في وضع السكون"],
  "tr.status.error": ["Error", "Fehler", "Erreur", "Errore", "Error", "错误", "त्रुटि", "خطأ"],
  "tr.status.offline": ["Offline", "Offline", "Hors ligne", "Offline", "Sin conexión", "离线", "ऑफ़लाइन", "غير متصل"],
  "tr.noDetails": ["No detailed figures yet", "Noch keine detaillierten Kennzahlen", "Pas encore de chiffres détaillés", "Ancora nessun dato dettagliato", "Aún no hay cifras detalladas", "暂无详细数据", "अभी कोई विस्तृत आँकड़े नहीं", "لا توجد أرقام مفصّلة بعد"],
  "tr.name.caption": ["Caption Writer", "Texterin", "Rédactrice", "Copywriter", "Redactora", "文案撰写", "कैप्शन लेखक", "كاتب التعليقات"],
  "tr.role.caption": ["Writes captions and hashtags for each channel", "Schreibt Texte und Hashtags für jeden Kanal", "Rédige légendes et hashtags pour chaque canal", "Scrive testi e hashtag per ogni canale", "Redacta textos y hashtags para cada canal", "为每个渠道撰写文案和话题标签", "हर चैनल के लिए कैप्शन और हैशटैग लिखता है", "يكتب التعليقات والوسوم لكل قناة"],
  "tr.name.media": ["Media Processor", "Medienbearbeitung", "Traitement des médias", "Elaborazione media", "Procesador de medios", "媒体处理", "मीडिया प्रोसेसर", "معالج الوسائط"],
  "tr.role.media": ["Watermarks, resizes and creates slideshows", "Setzt Wasserzeichen, passt Formate an, erstellt Slideshows", "Ajoute le filigrane, redimensionne, crée des diaporamas", "Applica la filigrana, ridimensiona, crea slideshow", "Pone marca de agua, ajusta tamaños y crea presentaciones", "添加水印、调整尺寸并制作幻灯片", "वॉटरमार्क, साइज़ बदलना और स्लाइडशो बनाना", "يضع العلامة المائية ويغيّر المقاسات وينشئ عروض الشرائح"],
  "tr.name.planner": ["Weekly Planner", "Wochenplanung", "Planificateur", "Pianificatore", "Planificador semanal", "周计划", "साप्ताहिक योजनाकार", "المخطِّط الأسبوعي"],
  "tr.role.planner": ["Reads the results and plans next week", "Liest die Ergebnisse und plant die nächste Woche", "Lit les résultats et planifie la semaine suivante", "Legge i risultati e pianifica la prossima settimana", "Lee los resultados y planifica la próxima semana", "分析效果并规划下一周", "नतीजे पढ़कर अगले हफ़्ते की योजना बनाता है", "يقرأ النتائج ويخطط للأسبوع القادم"],
  "tr.name.scheduler": ["Auto-Scheduler", "Auto-Planer", "Planification auto", "Pianificazione auto", "Programador automático", "自动排期", "ऑटो-शेड्यूलर", "المجدول التلقائي"],
  "tr.role.scheduler": ["Gives approved posts their publishing time", "Gibt freigegebenen Beiträgen ihren Zeitpunkt", "Attribue un horaire aux publications approuvées", "Assegna l’orario ai post approvati", "Asigna la hora de publicación a lo aprobado", "为已批准的帖子安排发布时间", "मंज़ूर पोस्ट को प्रकाशन का समय देता है", "يحدد وقت النشر للمنشورات المعتمدة"],
  "tr.name.publisher": ["Publisher", "Veröffentlichung", "Publication", "Pubblicazione", "Publicador", "发布", "प्रकाशक", "الناشر"],
  "tr.role.publisher": ["Posts to Instagram, TikTok, YouTube and Facebook", "Postet auf Instagram, TikTok, YouTube und Facebook", "Publie sur Instagram, TikTok, YouTube et Facebook", "Pubblica su Instagram, TikTok, YouTube e Facebook", "Publica en Instagram, TikTok, YouTube y Facebook", "发布到 Instagram、TikTok、YouTube 和 Facebook", "Instagram, TikTok, YouTube और Facebook पर पोस्ट करता है", "ينشر على إنستغرام وتيك توك ويوتيوب وفيسبوك"],
};

// Arabic with Western digits, as on 4xor.de and the map
const LOCALE = { en: "en-GB", de: "de-CH", fr: "fr-CH", it: "it-CH", es: "es", zh: "zh-Hans", hi: "hi", ar: "ar-u-nu-latn" };

/** The site language's own number and date formats */
export const localeOf = (lang) => LOCALE[lang] ?? "en-GB";

/** `t("q.show", { n: 5 })` in the current Studio language, plus the locale for numbers and dates */
export function useText() {
  const { lang } = useLang();
  const i = Math.max(0, LANGS.indexOf(lang));
  const t = (key, vars = {}) =>
    (ROWS[key]?.[i] ?? ROWS[key]?.[0] ?? key).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  return { t, lang, locale: localeOf(lang) };
}

/** "3 days", "3 Tage", "3天": a duration in the site language */
export const unit = (locale, value, u, style = "long", digits = 0) =>
  new Intl.NumberFormat(locale, { style: "unit", unit: u, unitDisplay: style, maximumFractionDigits: digits }).format(value);

/** "5 min ago", "vor 5 Min.", "5分钟前" */
export function timeAgo(locale, ts) {
  if (!ts) return "";
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" });
  const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (mins < 60) return rtf.format(-mins, "minute");
  const hours = Math.floor(mins / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  return rtf.format(-Math.floor(hours / 24), "day");
}

/** For a check that every text exists in every language */
export const WORKSPACE_ROWS = ROWS;
