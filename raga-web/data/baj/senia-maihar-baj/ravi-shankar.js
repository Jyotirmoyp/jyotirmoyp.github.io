/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "ravishankar_baj",
  name: "Ravi Shankar",
  description: "A principal disciple of Allauddin Khan, who carried the Maihar baj's sitar style to worldwide audiences.",
  relations: [ { type: "guru", targetId: "allauddinkhan" }, { type: "married 1941\u201382", targetId: "annapurnadevi_baj" } ],
};
