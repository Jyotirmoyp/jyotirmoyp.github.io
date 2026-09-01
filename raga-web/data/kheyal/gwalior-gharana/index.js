/* Gwalior Gharana — imports its musicians. */

import hadduKhanHassuKhan from './haddu-khan-hassu-khan.js';
import krishnaraoShankarPandit from './krishnarao-shankar-pandit.js';
import omkarnathThakur from './omkarnath-thakur.js';
import veenaSahasrabuddhe from './veena-sahasrabuddhe.js';

export default {
  name: "Gwalior Gharana",
  expanded: false,
  description: "The oldest of the kheyal gharanas, considered the wellspring from which Agra, Jaipur-Atrauli and others branched; balanced between melody and rhythm, with clear, direct bol-bandish (text-based composition) singing.",
  children: [ hadduKhanHassuKhan, krishnaraoShankarPandit, omkarnathThakur, veenaSahasrabuddhe ]
};
