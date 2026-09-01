/* Sitar — imports its musicians. */

import raviShankar from './ravi-shankar.js';
import vilayatKhan from './vilayat-khan.js';
import nikhilBanerjee from './nikhil-banerjee.js';

export default {
  name: "Sitar",
  expanded: false,
  description: "A long-necked plucked lute with movable frets and sympathetic strings, the best-known North Indian instrument internationally, capable of both dhrupad-style alap and kheyal-derived gat compositions.",
  children: [ raviShankar, vilayatKhan, nikhilBanerjee ]
};
