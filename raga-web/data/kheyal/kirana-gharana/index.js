/* Kirana Gharana — imports its musicians. */

import abdulKarimKhan from './abdul-karim-khan.js';
import sawaiGandharva from './sawai-gandharva.js';
import bhimsenJoshi from './bhimsen-joshi.js';
import gangubaiHangal from './gangubai-hangal.js';
import prabhaAtre from './prabha-atre.js';

export default {
  name: "Kirana Gharana",
  expanded: false,
  description: "Centred on sustained, meditative note-by-note raga development (a slow, minimal-ornament akar-based style), with less emphasis on rhythmic play than Agra or Jaipur-Atrauli.",
  children: [ abdulKarimKhan, sawaiGandharva, bhimsenJoshi, gangubaiHangal, prabhaAtre ]
};
