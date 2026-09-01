/* Agra Gharana — imports its musicians. */

import faiyazKhan from './faiyaz-khan.js';
import lalithRao from './lalith-rao.js';
import vilayatHussainKhan from './vilayat-hussain-khan.js';
import dinkarKaikini from './dinkar-kaikini.js';

export default {
  name: "Agra Gharana",
  expanded: false,
  description: "Traces its lineage to the dhrupad-influenced nom-tom singing of the Nauhar bani, giving it a firm, declamatory style with strong laykari (rhythmic play) alongside kheyal's melodic freedom.",
  children: [ faiyazKhan, lalithRao, vilayatHussainKhan, dinkarKaikini ]
};
