// Example runs the demo plays before anyone signs in, in the same shape the
// live API returns, so the animation is identical for both.
export const SAMPLE_INPUT = {
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

export const SAMPLE_RESULT = {
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
