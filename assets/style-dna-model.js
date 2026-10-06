/** A design preference game, not a psychological assessment. Two questions per dimension. */
export const questions = [
  {
    axis: 0,
    image: "assets/project-tropical.jpg",
    en: "What makes a room feel like home?",
    id: "Apa yang membuat ruang terasa seperti rumah?",
    options: [
      {
        en: [
          "Sun-warmed textures",
          "Oak, linen, clay, and gentle earth tones.",
        ],
        id: ["Tekstur hangat", "Kayu oak, linen, tanah liat, dan warna bumi."],
      },
      {
        en: [
          "A crisp, cool palette",
          "Stone, steel, and quiet shades of blue or grey.",
        ],
        id: [
          "Palet sejuk dan bersih",
          "Batu, baja, dan nuansa biru atau abu-abu.",
        ],
      },
    ],
  },
  {
    axis: 1,
    image: "assets/archive-minimalist-living.jpg",
    en: "Choose your ideal sofa silhouette.",
    id: "Pilih siluet sofa ideal Anda.",
    options: [
      {
        en: [
          "Soft and inviting",
          "Rounded edges, generous cushions, a place to sink in.",
        ],
        id: [
          "Lembut dan mengundang",
          "Sudut melengkung dan bantalan yang nyaman.",
        ],
      },
      {
        en: [
          "Clean and architectural",
          "Straight lines, tailored proportions, a precise outline.",
        ],
        id: ["Rapi dan arsitektural", "Garis lurus dan proporsi yang tegas."],
      },
    ],
  },
  {
    axis: 2,
    image: "assets/archive-luxury-suite.jpg",
    en: "How do you finish a room?",
    id: "Bagaimana Anda melengkapi ruang?",
    options: [
      {
        en: [
          "Leave room to breathe",
          "A few considered pieces, each with a purpose.",
        ],
        id: [
          "Beri ruang untuk bernapas",
          "Sedikit furnitur pilihan, semuanya berguna.",
        ],
      },
      {
        en: [
          "Build a personal collection",
          "Books, art, textiles, and objects with a story.",
        ],
        id: [
          "Bangun koleksi personal",
          "Buku, seni, tekstil, dan benda penuh cerita.",
        ],
      },
    ],
  },
  {
    axis: 3,
    image: "assets/hero-luxury.jpg",
    en: "Your perfect evening at home?",
    id: "Malam ideal Anda di rumah?",
    options: [
      {
        en: [
          "A quiet recharge",
          "A reading chair, soft light, and a little peace.",
        ],
        id: [
          "Mengisi energi dengan tenang",
          "Kursi baca, cahaya lembut, dan ketenangan.",
        ],
      },
      {
        en: [
          "Everyone is welcome",
          "A flexible sofa and a table made for gathering.",
        ],
        id: [
          "Semua orang disambut",
          "Sofa fleksibel dan meja untuk berkumpul.",
        ],
      },
    ],
  },
  {
    axis: 0,
    image: "assets/project-minimalist.jpg",
    en: "Which material would you reach for?",
    id: "Material mana yang menarik perhatian Anda?",
    options: [
      {
        en: [
          "Natural and tactile",
          "Timber grain, woven fibres, and warm finishes.",
        ],
        id: [
          "Alami dan bertekstur",
          "Serat kayu, anyaman, dan sentuhan hangat.",
        ],
      },
      {
        en: ["Smooth and refined", "Polished stone, glass, and brushed metal."],
        id: ["Halus dan elegan", "Batu poles, kaca, dan logam brushed."],
      },
    ],
  },
  {
    axis: 1,
    image: "assets/project-luxury.jpg",
    en: "What should your furniture feel like?",
    id: "Seperti apa karakter furnitur Anda?",
    options: [
      {
        en: [
          "Relaxed and cocooning",
          "Comfortable curves and forgiving proportions.",
        ],
        id: [
          "Santai dan menenangkan",
          "Lengkungan nyaman dan proporsi lembut.",
        ],
      },
      {
        en: [
          "Focused and intentional",
          "Sculptural lines and an ordered layout.",
        ],
        id: ["Tegas dan terarah", "Garis skulptural dan tata ruang teratur."],
      },
    ],
  },
  {
    axis: 2,
    image: "assets/archive-tropical-suite.jpg",
    en: "Your favourite shelf looks like…",
    id: "Rak favorit Anda terlihat seperti…",
    options: [
      {
        en: [
          "An edited gallery",
          "One beautiful object, and plenty of negative space.",
        ],
        id: ["Galeri pilihan", "Satu objek indah dengan banyak ruang kosong."],
      },
      {
        en: [
          "A living story",
          "Keepsakes, plants, books, and changing discoveries.",
        ],
        id: [
          "Cerita yang hidup",
          "Kenangan, tanaman, buku, dan penemuan baru.",
        ],
      },
    ],
  },
  {
    axis: 3,
    image: "assets/project-tropical.jpg",
    en: "What matters most in your layout?",
    id: "Apa yang paling penting dalam tata ruang?",
    options: [
      {
        en: ["My own sanctuary", "A comfortable corner and spaces to unwind."],
        id: [
          "Tempat berlindung pribadi",
          "Sudut nyaman dan ruang untuk bersantai.",
        ],
      },
      {
        en: ["Room to connect", "Moveable pieces and easy conversation."],
        id: [
          "Ruang untuk terhubung",
          "Furnitur mudah dipindah dan percakapan lancar.",
        ],
      },
    ],
  },
];
const axes = [
  { codes: ["W", "C"], en: ["Warm", "Cool"], id: ["Hangat", "Sejuk"] },
  {
    codes: ["S", "A"],
    en: ["Soft", "Architectural"],
    id: ["Lembut", "Arsitektural"],
  },
  {
    codes: ["M", "L"],
    en: ["Minimal", "Layered"],
    id: ["Minimal", "Berlapis"],
  },
  { codes: ["Q", "G"], en: ["Retreat", "Gather"], id: ["Tenang", "Berkumpul"] },
];
const names = {
  WSMQ: ["The Cozy Minimalist", "Si Minimalis Nyaman"],
  WSMG: ["The Warm Host", "Si Tuan Rumah Hangat"],
  WSLQ: ["The Comfort Collector", "Si Kolektor Kenyamanan"],
  WSLG: ["The Welcoming Storyteller", "Si Pencerita Ramah"],
  WAMQ: ["The Natural Architect", "Si Arsitek Alami"],
  WAMG: ["The Considered Host", "Si Tuan Rumah Terarah"],
  WALQ: ["The Earthy Curator", "Si Kurator Alami"],
  WALG: ["The Social Curator", "Si Kurator Sosial"],
  CSMQ: ["The Quiet Modernist", "Si Modernis Tenang"],
  CSMG: ["The Relaxed Modernist", "Si Modernis Santai"],
  CSLQ: ["The Soft Collector", "Si Kolektor Lembut"],
  CSLG: ["The Playful Connector", "Si Penghubung Ceria"],
  CAMQ: ["The Refined Minimalist", "Si Minimalis Elegan"],
  CAMG: ["The Modern Host", "Si Tuan Rumah Modern"],
  CALQ: ["The Gallery Curator", "Si Kurator Galeri"],
  CALG: ["The Statement Host", "Si Tuan Rumah Ekspresif"],
};
const recommendations = [
  {
    en: [
      "Warm oak, linen, and earth-toned accents.",
      "Stone, brushed metal, and a cool neutral palette.",
    ],
    id: [
      "Oak hangat, linen, dan aksen warna bumi.",
      "Batu, logam brushed, dan palet netral sejuk.",
    ],
  },
  {
    en: [
      "A rounded modular sofa and a soft upholstered chair.",
      "A tailored sofa and a table with crisp geometric lines.",
    ],
    id: [
      "Sofa modular melengkung dan kursi berlapis lembut.",
      "Sofa rapi dan meja dengan garis geometris.",
    ],
  },
  {
    en: [
      "Closed storage and a few deliberate statement pieces.",
      "Open shelving, layered textiles, and personal objects.",
    ],
    id: [
      "Penyimpanan tertutup dan sedikit furnitur pilihan.",
      "Rak terbuka, tekstil berlapis, dan benda personal.",
    ],
  },
  {
    en: [
      "A reading nook and warm, dimmable task lighting.",
      "Flexible seating and a coffee table designed for company.",
    ],
    id: [
      "Sudut baca dan lampu hangat yang dapat diredupkan.",
      "Tempat duduk fleksibel dan meja untuk berkumpul.",
    ],
  },
];
export function styleProfile(answers, language = "en") {
  if (
    !Array.isArray(answers) ||
    answers.length !== questions.length ||
    answers.some((a) => a !== 0 && a !== 1)
  )
    throw new RangeError("Complete all eight preferences");
  const lang = language === "id" ? "id" : "en";
  const dimensions = axes.map((axis, i) => {
    const picks = questions.flatMap((q, index) =>
      q.axis === i ? [answers[index]] : [],
    );
    const choice = picks[0];
    return {
      code: axis.codes[choice],
      label: axis[lang][choice],
      balanced: picks[0] !== picks[1],
      recommendation: recommendations[i][lang][choice],
    };
  });
  const code = dimensions.map((d) => d.code).join("");
  return { code, name: names[code][lang === "id" ? 1 : 0], dimensions };
}
export function styleLeadPayload(
  { name, phone, location, consent },
  answers,
  language = "en",
) {
  if (
    !consent ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    typeof location !== "string" ||
    location.trim().length < 2 ||
    typeof phone !== "string" ||
    !/^\+?[\d\s().-]+$/.test(phone) ||
    phone.replace(/\D/g, "").length < 7 ||
    phone.replace(/\D/g, "").length > 16
  )
    throw new RangeError("Valid contact details and consent required");
  const profile = styleProfile(answers, language);
  return {
    source: "secha_style_dna",
    name: name.trim(),
    phone: phone.trim(),
    location: location.trim(),
    consent: true,
    language: language === "id" ? "id" : "en",
    styleCode: profile.code,
    styleName: profile.name,
    answers: [...answers],
    preferences: profile.dimensions.map((d) => ({
      label: d.label,
      balanced: d.balanced,
    })),
    recommendations: profile.dimensions.map((d) => d.recommendation),
  };
}
