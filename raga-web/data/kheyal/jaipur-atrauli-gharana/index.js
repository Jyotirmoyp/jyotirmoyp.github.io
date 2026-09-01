/* Jaipur-Atrauli Gharana — imports its musicians. */

import alladiyaKhan from './alladiya-khan.js';
import kesarbaiKerkar from './kesarbai-kerkar.js';
import kishoriAmonkar from './kishori-amonkar.js';
import mogubaiKurdikar from './mogubai-kurdikar.js';

export default {
  name: "Jaipur-Atrauli Gharana",
  expanded: false,
  description: "Founded in the early 20th century, known for dense, intricate raga elaboration, rare and complex ragas, and a taans-and-boltaans vocabulary built more on melodic complexity than on volume or ornament for its own sake.",
  children: [ alladiyaKhan, kesarbaiKerkar, kishoriAmonkar, mogubaiKurdikar ]
};
