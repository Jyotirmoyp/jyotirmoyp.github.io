/* Darbhanga Gharana — imports its musicians. */

import ramChaturMallick from './ram-chatur-mallick.js';
import vidurMallick from './vidur-mallick.js';

export default {
  name: "Darbhanga Gharana",
  expanded: false,
  description: "A dhrupad lineage from the Darbhanga court in Bihar, known for a livelier, more ornamented approach than the Dagarvani, with greater use of gamak (oscillating ornamentation).",
  children: [ ramChaturMallick, vidurMallick ]
};
