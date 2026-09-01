/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "aliakbarkhan_baj",
  name: "Ali Akbar Khan",
  description: "Allauddin Khan's son, who developed the Maihar baj's sarod style into its most widely recognised modern form.",
  relations: [ { type: "father", targetId: "allauddinkhan" }, { type: "sister", targetId: "annapurnadevi_baj" } ],
};
