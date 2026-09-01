/* Imdadkhani Baj (Etawah Gharana) — imports its musicians. */

import vilayatKhan from './vilayat-khan.js';
import imratKhan from './imrat-khan.js';
import shahidParvezKhan from './shahid-parvez-khan.js';

export default {
  name: "Imdadkhani Baj (Etawah Gharana)",
  expanded: false,
  description: "A sitar-and-surbahar baj founded by Ustad Imdad Khan, known for its gayaki ang: phrasing that imitates vocal kheyal style, with meend (glides) and subtle ornamentation over speed.",
  children: [ vilayatKhan, imratKhan, shahidParvezKhan ]
};
