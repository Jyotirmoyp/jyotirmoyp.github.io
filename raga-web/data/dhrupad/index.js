/* Dhrupad — imports its gharanas/instruments. */

import dagarvaniDagarBani from './dagarvani-dagar-bani/index.js';
import darbhangaGharana from './darbhanga-gharana/index.js';
import bettiahGharana from './bettiah-gharana/index.js';

export default {
  name: "Dhrupad",
  expanded: false,
  description: "The oldest surviving form of Hindustani classical singing, dating to the medieval period and closely tied to the Mughal and Rajput courts. Dhrupad favours a slow, meditative, unornamented raga exposition (alap) built on syllables like ta, na and re, followed by a composition set to pakhawaj accompaniment. Its lineages are called banis or gharanas.",
  children: [ dagarvaniDagarBani, darbhangaGharana, bettiahGharana ]
};
