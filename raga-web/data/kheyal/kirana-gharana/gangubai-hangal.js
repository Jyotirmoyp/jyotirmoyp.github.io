/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "gangubaihangal",
  name: "Gangubai Hangal",
  description: "A major Kirana gharana vocalist known for her deep, resonant, almost masculine-timbred voice and her long, unhurried raga expositions.",
  relations: [ { type: "guru", targetId: "sawaigandharva" } ],
};
