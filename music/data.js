// This is where all your content lives
// You can easily add more styles, gharanas, and artists by following the same format

const musicData = {
    styles: [
        {
            id: "dhrupad",
            name: "Dhrupad",
            description: "Dhrupad is the oldest surviving form of Indian Classical music and traces its origin to the chanting of vedic hymns and mantras.",
            history: "Dhrupad evolved from the older chanting style called Prabandha and was formalized in the 15th century by Raja Man Singh Tomar of Gwalior.",
            characteristics: "Characterized by its solemn, meditative quality, Dhrupad is performed with a tanpura and pakhawaj. It has a strict formal structure with alap, jor, jhala, and composition sections.",
            image: "images/dhrupad.jpg",
            gharanas: ["dagar", "bishnupur"],
            links: [
                { title: "Learn more about Dhrupad", url: "https://en.wikipedia.org/wiki/Dhrupad" }
            ]
        },
        {
            id: "khayal",
            name: "Khayal",
            description: "Khayal is the most popular form of Hindustani classical music today, meaning 'imagination' in Persian.",
            history: "Khayal developed in the 18th century, influenced by Persian musical practices and older Indian forms like Dhrupad.",
            characteristics: "More flexible than Dhrupad, Khayal allows for greater improvisation and emotional expression. It typically consists of a slow (vilambit) and fast (drut) section.",
            image: "images/khayal.jpg",
            gharanas: ["gwalior", "kirana", "jaipur", "agra", "patiala"],
            links: [
                { title: "Khayal on Wikipedia", url: "https://en.wikipedia.org/wiki/Khyal" }
            ]
        },
        {
            id: "thumri",
            name: "Thumri",
            description: "Thumri is a semi-classical vocal form that is more lyrical and romantic in nature compared to Dhrupad or Khayal.",
            history: "Originating in the 19th century in the courts of Lucknow, Thumri was influenced by folk music and dance.",
            characteristics: "Thumri is characterized by its sensual lyrics, romantic themes, and flexible rhythmic structure. It often uses lighter ragas and focuses on bhava (emotional expression).",
            image: "images/thumri.jpg",
            gharanas: ["banaras", "lucknow"],
            links: [
                { title: "About Thumri", url: "https://en.wikipedia.org/wiki/Thumri" }
            ]
        }
    ],
    
    gharanas: [
        {
            id: "dagar",
            name: "Dagar Vani",
            description: "The Dagar gharana is the foremost proponent of the Dhrupad style of singing, known for its purity and spiritual approach.",
            founder: "Brahmanand Swami (16th century)",
            origin: "Originally from Rajasthan, later based in Delhi and other parts of North India",
            characteristics: "Emphasis on alap, precise intonation, and meditative development of ragas. Uses the 'Dagar vani' style which focuses on the deeper aspects of sound.",
            image: "images/dagar_gharana.jpg",
            artists: ["moinuddin_dagar", "zia_dagar"],
            links: [
                { title: "Dagar Tradition", url: "https://en.wikipedia.org/wiki/Dagar_family" }
            ]
        },
        {
            id: "gwalior",
            name: "Gwalior Gharana",
            description: "The oldest and most orthodox of the Khayal gharanas, known for its simplicity and emphasis on voice culture.",
            founder: "Nathan Pir Baksh (18th century)",
            origin: "Gwalior, Madhya Pradesh",
            characteristics: "Clear pronunciation of lyrics, balanced emphasis on melody and rhythm, and systematic presentation of ragas. Known for its 'behlaava' style of taans.",
            image: "images/gwalior_gharana.jpg",
            artists: ["kumar_gandharva", "dv_parluskar"],
            links: [
                { title: "Gwalior Gharana", url: "https://en.wikipedia.org/wiki/Gwalior_gharana" }
            ]
        },
        {
            id: "kirana",
            name: "Kirana Gharana",
            description: "Known for its meditative, expansive alap and emotional depth in raga presentation.",
            founder: "Abdul Karim Khan (early 20th century)",
            origin: "Kirana (now in Uttar Pradesh)",
            characteristics: "Slow, contemplative development of ragas, emphasis on perfect intonation, and use of meend (glides between notes). Known for its 'gayaki' (singing) style.",
            image: "images/kirana_gharana.jpg",
            artists: ["bhimsen_joshi", "gangubai_hangal"],
            links: [
                { title: "Kirana Gharana", url: "https://en.wikipedia.org/wiki/Kirana_gharana" }
            ]
        }
    ],
    
    artists: [
        {
            id: "moinuddin_dagar",
            name: "Ustad Moinuddin Dagar",
            description: "One of the most revered Dhrupad singers of the 20th century, known for his deep, resonant voice and spiritual approach to music.",
            birth: "1920",
            death: "1966",
            contribution: "He was instrumental in keeping the Dagar tradition alive during difficult times and trained many disciples including his younger brother Zia Moinuddin Dagar.",
            image: "images/moinuddin_dagar.jpg",
            links: [
                { title: "Biography", url: "https://en.wikipedia.org/wiki/Moinuddin_Dagar" },
                { title: "Recordings", url: "https://www.youtube.com/results?search_query=Moinuddin+Dagar" }
            ]
        },
        {
            id: "bhimsen_joshi",
            name: "Pandit Bhimsen Joshi",
            description: "One of the most celebrated Indian vocalists of the Kirana gharana, known for his powerful voice and mastery over khayal singing.",
            birth: "February 4, 1922",
            death: "January 24, 2011",
            contribution: "Popularized Hindustani classical music among masses while maintaining its purity. Known for his renditions of ragas like Miyan ki Todi, Puriya Kalyan, and Multani.",
            image: "images/bhimsen_joshi.jpg",
            links: [
                { title: "Official Website", url: "http://www.bhimsenjoshi.org/" },
                { title: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bhimsen_Joshi" }
            ]
        },
        {
            id: "kumar_gandharva",
            name: "Pandit Kumar Gandharva",
            description: "A revolutionary figure in Hindustani classical music who broke away from tradition to create his own distinctive style.",
            birth: "April 8, 1924",
            death: "January 12, 1992",
            contribution: "Known for his unconventional approach to ragas, unique voice, and innovative compositions. He created new ragas and revived many obscure ones.",
            image: "images/kumar_gandharva.jpg",
            links: [
                { title: "Biography", url: "https://en.wikipedia.org/wiki/Kumar_Gandharva" },
                { title: "Musical Legacy", url: "https://www.thehindu.com/features/friday-review/music/The-Gandmark-of-Gandharva/article15413363.ece" }
            ]
        }
    ]
};