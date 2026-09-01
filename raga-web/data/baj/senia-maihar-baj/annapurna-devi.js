/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "annapurnadevi_baj",
  name: "Annapurna Devi",
  description: "Allauddin Khan's daughter and a surbahar virtuoso in the Maihar baj, renowned among musicians though she rarely performed publicly.",
  relations: [ { type: "father", targetId: "allauddinkhan" }, { type: "brother", targetId: "aliakbarkhan_baj" }, { type: "married 1941\u201382", targetId: "ravishankar_baj" } ],
};
