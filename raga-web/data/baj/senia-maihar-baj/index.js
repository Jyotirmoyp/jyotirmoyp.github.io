/* Senia Maihar Baj — imports its musicians. */

import allauddinKhan from './allauddin-khan.js';
import raviShankar from './ravi-shankar.js';
import aliAkbarKhan from './ali-akbar-khan.js';
import annapurnaDevi from './annapurna-devi.js';

export default {
  name: "Senia Maihar Baj",
  expanded: false,
  description: "A baj founded by Ustad Allauddin Khan at Maihar, blending elements of dhrupad's structural rigour with kheyal-derived melody, applied across sitar, sarod and other instruments.",
  children: [ allauddinKhan, raviShankar, aliAkbarKhan, annapurnaDevi ]
};
