/* Baj — imports its gharanas/instruments. */

import imdadkhaniBajEtawahGharana from './imdadkhani-baj-etawah-gharana/index.js';
import seniaMaiharBaj from './senia-maihar-baj/index.js';
import seniaGharana from './senia-gharana/index.js';

export default {
  name: "Baj",
  expanded: false,
  description: "Baj refers to the distinct playing styles, or schools, that developed around Hindustani plucked string instruments, particularly the sitar and sarod, each with its own approach to stroke pattern, ornamentation and repertoire.",
  children: [ imdadkhaniBajEtawahGharana, seniaMaiharBaj, seniaGharana ]
};
