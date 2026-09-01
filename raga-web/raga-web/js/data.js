/* The whole mind map lives here as one nested object.
   Add branches by adding to a "children" array; add a
   relationship by adding to a "relations" array (see the
   Dagar / Maihar / Kirana clusters below for examples). */

const data = {
  name: "Hindustani classical music",
  description: "The North Indian classical tradition, built around raga (melodic framework) and tala (rhythmic cycle). This map traces its four broad performance streams: the vocal genres kheyal and dhrupad, the instrumental tradition, and baj, the distinct playing styles that grew up around plucked strings like the sitar and sarod.",
  expanded: true,
  children: [
    {
      name: "Kheyal", expanded: false,
      description: "The dominant vocal genre of North Indian classical music since the 18th century. Kheyal favours melodic improvisation and ornamentation over the austerity of dhrupad, built around a slow bada kheyal and a faster chota kheyal in the same raga. Its lineages are organised into gharanas, family or regional schools with a distinct approach to tone, ornament and repertoire.",
      children: [
        { name: "Agra Gharana", expanded:false,
          description: "Traces its lineage to the dhrupad-influenced nom-tom singing of the Nauhar bani, giving it a firm, declamatory style with strong laykari (rhythmic play) alongside kheyal's melodic freedom.",
          children: [
            { name:"Faiyaz Khan", description:"Ustad Faiyaz Khan (1886-1950) is regarded as the architect of the modern Agra gharana, prized for a majestic voice and his fusion of dhrupad's rhythmic rigour with kheyal's lyricism. He was also an accomplished thumri and tarana singer." },
            { name:"Lalith Rao", description:"A leading contemporary voice of the Agra gharana, trained under Dinkar Kaikini, known for a disciplined, bandish-centred style that keeps the gharana's dhrupad-rooted gravity alive on the concert stage." },
            { name:"Vilayat Hussain Khan", description:"A key early-20th-century Agra vocalist and one of the gharana's chroniclers, whose writing helped document its history and repertoire alongside his own performing career." },
            { name:"Dinkar Kaikini", description:"A major 20th-century Agra gharana teacher and musicologist based in Mumbai, whose disciples carried the gharana's rhythmic, bandish-focused approach into the present generation." }
          ]
        },
        { name: "Jaipur-Atrauli Gharana", expanded:false,
          description: "Founded in the early 20th century, known for dense, intricate raga elaboration, rare and complex ragas, and a taans-and-boltaans vocabulary built more on melodic complexity than on volume or ornament for its own sake.",
          children: [
            { name:"Alladiya Khan", description:"Ustad Alladiya Khan (1855-1946) founded the Jaipur-Atrauli gharana, prized for reviving rare ragas and for a vocal technique built on intricate, khatka-laden melodic patterns rather than sheer power." },
            { name:"Kesarbai Kerkar", description:"One of the gharana's most celebrated 20th-century voices, famed for a commanding, precise style; her recordings remain reference points for Jaipur-Atrauli gayaki." },
            { name:"Kishori Amonkar", description:"A hugely influential vocalist who extended the Jaipur-Atrauli style with her own emotive, exploratory approach to raga, becoming one of the most celebrated Hindustani singers of the later 20th century." },
            { name:"Mogubai Kurdikar", description:"A senior direct disciple of Alladiya Khan and mother of Kishori Amonkar, central to carrying the gharana's rigorous training methods forward." }
          ]
        },
        { name: "Kirana Gharana", expanded:false,
          description: "Centred on sustained, meditative note-by-note raga development (a slow, minimal-ornament akar-based style), with less emphasis on rhythmic play than Agra or Jaipur-Atrauli.",
          children: [
            { name:"Abdul Karim Khan", id:"abdulkarimkhan",
              description:"Ustad Abdul Karim Khan (1872-1937) founded the Kirana gharana, known for his sustained, deeply emotive akar and for popularising the raga Yaman Kalyan-style meditative approach across North and South India.",
              relations:[ {type:"disciple", targetId:"sawaigandharva"} ] },
            { name:"Sawai Gandharva", id:"sawaigandharva",
              description:"A disciple of Abdul Karim Khan who became the gharana's key transmitter to the next generation, training the two vocalists who carried Kirana singing to a national audience.",
              relations:[ {type:"guru", targetId:"abdulkarimkhan"}, {type:"disciple", targetId:"bhimsenjoshi"}, {type:"disciple", targetId:"gangubaihangal"} ] },
            { name:"Bhimsen Joshi", id:"bhimsenjoshi",
              description:"Perhaps the most widely known 20th-century Kirana vocalist, celebrated for a powerful, sustained voice and for bringing Hindustani classical music to a mass Indian audience.",
              relations:[ {type:"guru", targetId:"sawaigandharva"} ] },
            { name:"Gangubai Hangal", id:"gangubaihangal",
              description:"A major Kirana gharana vocalist known for her deep, resonant, almost masculine-timbred voice and her long, unhurried raga expositions.",
              relations:[ {type:"guru", targetId:"sawaigandharva"} ] },
            { name:"Prabha Atre", description:"A leading Kirana gharana vocalist, musicologist and teacher who also expanded the gharana's repertoire into thumri, tappa and other lighter classical forms." }
          ]
        },
        { name: "Gwalior Gharana", expanded:false,
          description: "The oldest of the kheyal gharanas, considered the wellspring from which Agra, Jaipur-Atrauli and others branched; balanced between melody and rhythm, with clear, direct bol-bandish (text-based composition) singing.",
          children: [
            { name:"Haddu Khan & Hassu Khan", description:"Brothers credited with consolidating the Gwalior gharana's kheyal style in the 19th century, giving it the balanced, all-round approach that later gharanas branched from." },
            { name:"Krishnarao Shankar Pandit", description:"A leading 20th-century torchbearer of the Gwalior gharana, known for a robust, clearly enunciated style and for training generations of students in its foundational repertoire." },
            { name:"Omkarnath Thakur", description:"A major Gwalior-trained vocalist, scholar and educator who helped shape institutional music education in India in the 20th century, alongside a powerful, devotionally inflected singing style." },
            { name:"Veena Sahasrabuddhe", description:"A prominent later-generation Gwalior gharana vocalist known for combining the gharana's clarity with warmth and for her extensive teaching." }
          ]
        },
        { name: "Patiala Gharana", expanded:false,
          description: "Known for a bravura, ornament-rich style with fast, intricate taans, strongly influenced by both kheyal and the lighter thumri-tappa tradition of Punjab.",
          children: [
            { name:"Bade Ghulam Ali Khan", description:"Ustad Bade Ghulam Ali Khan (1902-1968) is the gharana's most celebrated figure, famed for a rich, ornament-heavy voice and for popularising Patiala gayaki across concert stages in India and Pakistan." },
            { name:"Ajoy Chakrabarty", description:"A leading contemporary Patiala-trained vocalist known for combining the gharana's virtuosic ornamentation with a wide-ranging, eclectic repertoire and prolific teaching." }
          ]
        },
        { name: "Rampur-Sahaswan Gharana", expanded:false,
          description: "Known for a sweet, unhurried style balancing dhrupad-like sobriety with kheyal's lyricism, developed under the patronage of the Rampur court.",
          children: [
            { name:"Inayat Hussain Khan", description:"A founding figure of the Rampur-Sahaswan gharana, whose style blended dhrupad's discipline with kheyal's melodic freedom under Rampur court patronage." },
            { name:"Mushtaq Hussain Khan", description:"A leading early-20th-century exponent of the gharana, celebrated for his refined, unhurried raga development and pure intonation." },
            { name:"Rashid Khan", description:"One of the most prominent kheyal vocalists of the last few decades, trained in the Rampur-Sahaswan tradition, known for a rich voice and wide popular appeal." }
          ]
        }
      ]
    },
    {
      name: "Dhrupad", expanded: false,
      description: "The oldest surviving form of Hindustani classical singing, dating to the medieval period and closely tied to the Mughal and Rajput courts. Dhrupad favours a slow, meditative, unornamented raga exposition (alap) built on syllables like ta, na and re, followed by a composition set to pakhawaj accompaniment. Its lineages are called banis or gharanas.",
      children: [
        { name:"Dagarvani (Dagar Bani)", expanded:false,
          description:"The best-known dhrupad lineage of the 20th century, carried by the Dagar family across many generations, known for long, deeply contemplative alap and a spiritual, restrained aesthetic.",
          children:[
            { name:"Zia Mohiuddin Dagar", id:"zmdagar",
              description:"A rudra veena maestro of the Dagar family, celebrated for extending dhrupad's slow, meditative alap tradition onto the instrument with extraordinary depth.",
              relations:[ {type:"son", targetId:"bahauddindagar"}, {type:"disciple", targetId:"nancylesh"} ] },
            { name:"Bahauddin Dagar", id:"bahauddindagar",
              description:"Son and principal disciple of Zia Mohiuddin Dagar, and today's leading rudra veena player in the family lineage, carrying its slow-alap aesthetic into the current generation.",
              relations:[ {type:"father", targetId:"zmdagar"} ] },
            { name:"Nancy Lesh", id:"nancylesh",
              description:"A rudra veena disciple of Zia Mohiuddin Dagar, among the first Western musicians to train seriously in the Dagarvani tradition and carry it into teaching abroad.",
              relations:[ {type:"guru", targetId:"zmdagar"} ] },
            { name:"Zia Fariduddin Dagar", description:"A leading vocal exponent of the Dagar family's dhrupad tradition, known for his teaching as much as his own austere, deliberate singing." },
            { name:"Rahim Fahimuddin Dagar", description:"A senior dhrupad vocalist from a parallel branch of the Dagar lineage, known for a powerful voice and rigorous adherence to dhrupad's traditional structure." },
            { name:"Gundecha Brothers", description:"Umakant and Ramakant Gundecha, prominent contemporary dhrupad vocalists trained in the Dagar tradition, widely credited with popularising dhrupad for newer audiences through performance and teaching." }
          ]
        },
        { name:"Darbhanga Gharana", expanded:false,
          description:"A dhrupad lineage from the Darbhanga court in Bihar, known for a livelier, more ornamented approach than the Dagarvani, with greater use of gamak (oscillating ornamentation).",
          children:[
            { name:"Ram Chatur Mallick", description:"A major 20th-century torchbearer of the Darbhanga dhrupad gharana, known for a robust voice and the gharana's characteristic gamak-rich style." },
            { name:"Vidur Mallick", description:"A senior Darbhanga gharana dhrupad vocalist and teacher, central to keeping the lineage's repertoire and technique alive through the later 20th century." }
          ]
        },
        { name:"Bettiah Gharana", expanded:false,
          description:"A dhrupad lineage associated with the Bettiah court in Bihar, one of the less widely documented banis, maintained today by a small number of practicing families.",
          children:[]
        }
      ]
    },
    {
      name:"Instrumental", expanded:false,
      description:"The instrumental branch of Hindustani classical music, where the melodic vocabulary of kheyal and dhrupad is adapted to plucked, bowed and blown instruments, each with its own idiomatic techniques and repertoire.",
      children:[
        { name:"Sitar", expanded:false,
          description:"A long-necked plucked lute with movable frets and sympathetic strings, the best-known North Indian instrument internationally, capable of both dhrupad-style alap and kheyal-derived gat compositions.",
          children:[
            { name:"Ravi Shankar", description:"The most internationally recognised sitarist of the 20th century, a Senia Maihar gharana musician who did more than anyone to bring Hindustani classical music to global audiences." },
            { name:"Vilayat Khan", description:"Founder of the modern Imdadkhani (Etawah) sitar baj, celebrated for a gayaki ang style that made the sitar sing with vocal-like phrasing and ornamentation." },
            { name:"Nikhil Banerjee", description:"A revered Maihar gharana sitarist known for a deeply meditative, technically refined style, widely admired among fellow musicians." }
          ]
        },
        { name:"Sarod", expanded:false,
          description:"A fretless plucked instrument played with a metal plectrum, valued for its deep, resonant tone and its capacity for fast, fluid melodic runs.",
          children:[
            { name:"Ali Akbar Khan", description:"Founder of the modern Maihar gharana sarod style, son of Allauddin Khan, regarded as one of the greatest instrumentalists of 20th-century Hindustani music." },
            { name:"Amjad Ali Khan", description:"A leading contemporary sarod player from the Senia Bangash lineage, known for a lyrical, singing tone and for expanding the sarod's international audience." }
          ]
        },
        { name:"Santoor", expanded:false,
          description:"A hammered trapezoidal zither adapted from Kashmiri folk music into the Hindustani classical concert repertoire in the mid-20th century.",
          children:[
            { name:"Shivkumar Sharma", description:"Pioneered the santoor's adaptation into Hindustani classical concert music, developing playing techniques that allowed it to sustain notes and ornaments in ways the folk instrument previously could not." }
          ]
        },
        { name:"Bansuri (flute)", expanded:false,
          description:"The bamboo transverse flute, established as a solo classical concert instrument in the 20th century, prized for a breathy, vocal-like tone well suited to raga alap.",
          children:[
            { name:"Hariprasad Chaurasia", description:"The most prominent figure in establishing the bansuri as a mainstream Hindustani classical solo instrument, known for a warm, meditative tone." }
          ]
        },
        { name:"Sarangi", expanded:false,
          description:"A bowed, fretless instrument traditionally used to accompany vocalists (able to closely mimic the human voice), later also developed as a solo concert instrument.",
          children:[
            { name:"Ram Narayan", description:"Established the sarangi as a solo concert instrument independent of its traditional accompanying role, through decades of performance and advocacy." }
          ]
        }
      ]
    },
    {
      name:"Baj", expanded:false,
      description:"Baj refers to the distinct playing styles, or schools, that developed around Hindustani plucked string instruments, particularly the sitar and sarod, each with its own approach to stroke pattern, ornamentation and repertoire.",
      children:[
        { name:"Imdadkhani Baj (Etawah Gharana)", expanded:false,
          description:"A sitar-and-surbahar baj founded by Ustad Imdad Khan, known for its gayaki ang: phrasing that imitates vocal kheyal style, with meend (glides) and subtle ornamentation over speed.",
          children:[
            { name:"Vilayat Khan", description:"The best-known modern exponent of the Imdadkhani baj, whose gayaki-ang playing became the defining sound of 20th-century sitar." },
            { name:"Imrat Khan", description:"Younger brother of Vilayat Khan and a master of both sitar and surbahar in the Imdadkhani baj, known for his surbahar playing in particular." },
            { name:"Shahid Parvez Khan", description:"A leading contemporary sitarist in the Imdadkhani baj lineage, carrying forward its vocal-style phrasing and ornamentation." }
          ]
        },
        { name:"Senia Maihar Baj", expanded:false,
          description:"A baj founded by Ustad Allauddin Khan at Maihar, blending elements of dhrupad's structural rigour with kheyal-derived melody, applied across sitar, sarod and other instruments.",
          children:[
            { name:"Allauddin Khan", id:"allauddinkhan",
              description:"Founder of the Maihar baj, and one of the most influential teachers in 20th-century Hindustani music, training his children and disciples at his home in Maihar, Madhya Pradesh.",
              relations:[ {type:"disciple", targetId:"ravishankar_baj"}, {type:"son", targetId:"aliakbarkhan_baj"}, {type:"daughter", targetId:"annapurnadevi_baj"} ] },
            { name:"Ravi Shankar", id:"ravishankar_baj",
              description:"A principal disciple of Allauddin Khan, who carried the Maihar baj's sitar style to worldwide audiences.",
              relations:[ {type:"guru", targetId:"allauddinkhan"}, {type:"married 1941\u201382", targetId:"annapurnadevi_baj"} ] },
            { name:"Ali Akbar Khan", id:"aliakbarkhan_baj",
              description:"Allauddin Khan's son, who developed the Maihar baj's sarod style into its most widely recognised modern form.",
              relations:[ {type:"father", targetId:"allauddinkhan"}, {type:"sister", targetId:"annapurnadevi_baj"} ] },
            { name:"Annapurna Devi", id:"annapurnadevi_baj",
              description:"Allauddin Khan's daughter and a surbahar virtuoso in the Maihar baj, renowned among musicians though she rarely performed publicly.",
              relations:[ {type:"father", targetId:"allauddinkhan"}, {type:"brother", targetId:"aliakbarkhan_baj"}, {type:"married 1941\u201382", targetId:"ravishankar_baj"} ] }
          ]
        },
        { name:"Senia Gharana", expanded:false,
          description:"The root lineage traced back to Mian Tansen at the Mughal court, from which many later instrumental banis and bajs, including Maihar and Shahjahanpur, claim descent.",
          children:[]
        }
      ]
    }
  ]
};;
