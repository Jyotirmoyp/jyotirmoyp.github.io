/* Kheyal — imports its gharanas/instruments. */

import agraGharana from './agra-gharana/index.js';
import jaipurAtrauliGharana from './jaipur-atrauli-gharana/index.js';
import kiranaGharana from './kirana-gharana/index.js';
import gwaliorGharana from './gwalior-gharana/index.js';
import patialaGharana from './patiala-gharana/index.js';
import rampurSahaswanGharana from './rampur-sahaswan-gharana/index.js';

export default {
  name: "Kheyal",
  expanded: false,
  description: "The dominant vocal genre of North Indian classical music since the 18th century. Kheyal favours melodic improvisation and ornamentation over the austerity of dhrupad, built around a slow bada kheyal and a faster chota kheyal in the same raga. Its lineages are organised into gharanas, family or regional schools with a distinct approach to tone, ornament and repertoire.",
  children: [ agraGharana, jaipurAtrauliGharana, kiranaGharana, gwaliorGharana, patialaGharana, rampurSahaswanGharana ]
};
