/* Rampur-Sahaswan Gharana — imports its musicians. */

import inayatHussainKhan from './inayat-hussain-khan.js';
import mushtaqHussainKhan from './mushtaq-hussain-khan.js';
import rashidKhan from './rashid-khan.js';

export default {
  name: "Rampur-Sahaswan Gharana",
  expanded: false,
  description: "Known for a sweet, unhurried style balancing dhrupad-like sobriety with kheyal's lyricism, developed under the patronage of the Rampur court.",
  children: [ inayatHussainKhan, mushtaqHussainKhan, rashidKhan ]
};
