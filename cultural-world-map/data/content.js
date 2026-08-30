// Cultural content, keyed by ISO 3166-1 alpha-2 country code.
// Add a new entry to add a new country's content — the map will
// automatically make that country interactive if it has an entry here.
//
// images: each image is { caption, color } as a placeholder swatch.
// Replace with { caption, src: "images/your-file.jpg" } once you have
// real photos — the renderer checks for `src` first.

const CONTENT = {
  JP: {
    name: "Japan",
    description:
      "An archipelago where centuries-old ritual sits beside the newest technology. Seasons shape daily life — from cherry blossoms in spring to maple leaves in autumn — and that attentiveness to small, passing things runs through its food, craft, and architecture.",
    images: [
      { caption: "Torii gate at dusk", color: "#c9a86a" },
      { caption: "Tea ceremony bowl", color: "#8a8577" },
      { caption: "Autumn maple, Kyoto", color: "#b7724e" }
    ],
    cities: [
      {
        name: "Kyoto",
        coords: [135.7681, 35.0116],
        description:
          "Japan's former capital for over a thousand years, home to more than a thousand temples and shrines, and the spiritual center of traditional arts like tea ceremony, kaiseki cuisine, and geisha culture in the Gion district.",
        images: [
          { caption: "Fushimi Inari torii path", color: "#c9a86a" },
          { caption: "Kinkaku-ji, the Golden Pavilion", color: "#d4b483" },
          { caption: "Gion at evening", color: "#6f6a5e" }
        ]
      },
      {
        name: "Tokyo",
        coords: [139.6917, 35.6895],
        description:
          "A city of dense contrasts: quiet Shinto shrines tucked between skyscrapers, centuries-old markets beside neon-lit crossings, and neighborhoods that each hold their own distinct character and pace.",
        images: [
          { caption: "Shibuya crossing", color: "#7a7a7a" },
          { caption: "Senso-ji Temple, Asakusa", color: "#b7724e" },
          { caption: "Yanaka backstreets", color: "#9a9282" }
        ]
      }
    ]
  },

  FR: {
    name: "France",
    description:
      "A country that has long treated everyday pleasures — a meal, a glass of wine, a conversation at a café table — as things worth doing properly. Its regions each keep distinct dialects, dishes, and traditions beneath a shared national culture.",
    images: [
      { caption: "Café terrace, Paris", color: "#a89f91" },
      { caption: "Lavender fields, Provence", color: "#8d84a6" },
      { caption: "Vineyard, Bordeaux", color: "#7d8f6b" }
    ],
    cities: [
      {
        name: "Paris",
        coords: [2.3522, 48.8566],
        description:
          "The capital's identity was built as much by its cafés, salons, and ateliers as by its monuments — a city that turned conversation, fashion, and art into civic institutions.",
        images: [
          { caption: "Seine at golden hour", color: "#9a8f77" },
          { caption: "Montmartre stairways", color: "#8a8577" },
          { caption: "Palais Garnier interior", color: "#b09a6a" }
        ]
      },
      {
        name: "Lyon",
        coords: [4.8357, 45.764],
        description:
          "Widely considered the culinary capital of France, where the bouchon tradition of hearty, unpretentious cooking has been passed down through generations of family-run kitchens.",
        images: [
          { caption: "Traboules of Vieux Lyon", color: "#8f8a7c" },
          { caption: "Bouchon table setting", color: "#a67c52" },
          { caption: "Basilique de Fourvière", color: "#9c9384" }
        ]
      }
    ]
  },

  IN: {
    name: "India",
    description:
      "A subcontinent of extraordinary linguistic and religious diversity, where more than twenty officially recognized languages and multiple major world religions have coexisted and cross-pollinated for millennia, producing distinct regional cultures within one nation.",
    images: [
      { caption: "Holi color powder", color: "#c9556b" },
      { caption: "Rajasthani textile", color: "#d68c3e" },
      { caption: "Ganges at dawn, Varanasi", color: "#8592a3" }
    ],
    cities: [
      {
        name: "Varanasi",
        coords: [83.0, 25.3176],
        description:
          "One of the oldest continuously inhabited cities in the world, where daily rituals along the Ganges' ghats have continued largely unchanged for centuries.",
        images: [
          { caption: "Ghats at sunrise", color: "#8592a3" },
          { caption: "Evening aarti ceremony", color: "#c98a3e" },
          { caption: "Old city lanes", color: "#a08b6f" }
        ]
      },
      {
        name: "Jaipur",
        coords: [75.7873, 26.9124],
        description:
          "The 'Pink City,' known for its planned 18th-century architecture, block-printed textiles, and a jewelry and gemstone trade that has run through its bazaars for generations.",
        images: [
          { caption: "Hawa Mahal facade", color: "#c9756b" },
          { caption: "Block-print textile stall", color: "#d68c3e" },
          { caption: "City Palace courtyard", color: "#b89b6a" }
        ]
      }
    ]
  },

  BR: {
    name: "Brazil",
    description:
      "A country whose culture was forged from Indigenous, African, and European roots, most visible in its music and festivals — from samba's origins in Afro-Brazilian communities to Carnival's role as a yearly release valve for the whole country.",
    images: [
      { caption: "Carnival costume detail", color: "#c9a13e" },
      { caption: "Amazon canopy", color: "#4e7a4e" },
      { caption: "Copacabana at dusk", color: "#8592a3" }
    ],
    cities: [
      {
        name: "Salvador",
        coords: [-38.5011, -12.9714],
        description:
          "The heart of Afro-Brazilian culture, where capoeira, candomblé religious traditions, and the sound of the berimbau trace a direct line back to West African heritage.",
        images: [
          { caption: "Pelourinho colonial streets", color: "#c9756b" },
          { caption: "Capoeira circle", color: "#a08b6f" },
          { caption: "Candomblé offering", color: "#8a8577" }
        ]
      },
      {
        name: "Rio de Janeiro",
        coords: [-43.1729, -22.9068],
        description:
          "Home to Carnival's largest parades and the samba schools that spend all year preparing them — a city where music and public celebration are treated as civic infrastructure.",
        images: [
          { caption: "Sambadrome parade", color: "#c9a13e" },
          { caption: "Santa Teresa tram", color: "#9c9384" },
          { caption: "Ipanema at sunset", color: "#d68c3e" }
        ]
      }
    ]
  },

  EG: {
    name: "Egypt",
    description:
      "Home to one of the world's oldest continuous civilizations, where ancient monuments share the landscape with a living culture shaped by the Nile, Islamic tradition, and centuries as a crossroads between Africa, the Middle East, and the Mediterranean.",
    images: [
      { caption: "Pyramids of Giza", color: "#c9a86a" },
      { caption: "Nile felucca sail", color: "#7d97a3" },
      { caption: "Khan el-Khalili lanterns", color: "#c98a3e" }
    ],
    cities: [
      {
        name: "Cairo",
        coords: [31.2357, 30.0444],
        description:
          "One of the largest cities in Africa and the Middle East, where medieval Islamic architecture, Coptic Christian quarters, and modern life sit within a few streets of each other.",
        images: [
          { caption: "Khan el-Khalili bazaar", color: "#c98a3e" },
          { caption: "Al-Azhar Mosque", color: "#8a9c8a" },
          { caption: "Nile corniche at night", color: "#5f7a8c" }
        ]
      },
      {
        name: "Luxor",
        coords: [32.6396, 25.6872],
        description:
          "Built on the site of ancient Thebes, often called the world's largest open-air museum for the density of temples and tombs still standing along the Nile's banks.",
        images: [
          { caption: "Karnak Temple columns", color: "#c9a86a" },
          { caption: "Valley of the Kings", color: "#b7955f" },
          { caption: "Nile at sunrise", color: "#8592a3" }
        ]
      }
    ]
  }
};
