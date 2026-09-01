/* Root of the tree. Imports the four top-level genres
   and assembles the full map. */

import kheyal from './kheyal/index.js';
import dhrupad from './dhrupad/index.js';
import instrumental from './instrumental/index.js';
import baj from './baj/index.js';

export const data = {
  name: "Hindustani classical music",
  expanded: true,
  description: "The North Indian classical tradition, built around raga (melodic framework) and tala (rhythmic cycle). This map traces its four broad performance streams: the vocal genres kheyal and dhrupad, the instrumental tradition, and baj, the distinct playing styles that grew up around plucked strings like the sitar and sarod.",
  children: [ kheyal, dhrupad, instrumental, baj ]
};
