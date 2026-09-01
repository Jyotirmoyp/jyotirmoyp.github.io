/* Sarod — imports its musicians. */

import aliAkbarKhan from './ali-akbar-khan.js';
import amjadAliKhan from './amjad-ali-khan.js';

export default {
  name: "Sarod",
  expanded: false,
  description: "A fretless plucked instrument played with a metal plectrum, valued for its deep, resonant tone and its capacity for fast, fluid melodic runs.",
  children: [ aliAkbarKhan, amjadAliKhan ]
};
