/* Instrumental — imports its gharanas/instruments. */

import sitar from './sitar/index.js';
import sarod from './sarod/index.js';
import santoor from './santoor/index.js';
import bansuriFlute from './bansuri-flute/index.js';
import sarangi from './sarangi/index.js';

export default {
  name: "Instrumental",
  expanded: false,
  description: "The instrumental branch of Hindustani classical music, where the melodic vocabulary of kheyal and dhrupad is adapted to plucked, bowed and blown instruments, each with its own idiomatic techniques and repertoire.",
  children: [ sitar, sarod, santoor, bansuriFlute, sarangi ]
};
