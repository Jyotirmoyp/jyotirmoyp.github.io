/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "allauddinkhan",
  name: "Allauddin Khan",
  description: "Founder of the Maihar baj, and one of the most influential teachers in 20th-century Hindustani music, training his children and disciples at his home in Maihar, Madhya Pradesh.",
  relations: [ { type: "disciple", targetId: "ravishankar_baj" }, { type: "son", targetId: "aliakbarkhan_baj" }, { type: "daughter", targetId: "annapurnadevi_baj" } ],
};
