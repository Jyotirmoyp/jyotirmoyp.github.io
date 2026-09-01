/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "bhimsenjoshi",
  name: "Bhimsen Joshi",
  description: "Perhaps the most widely known 20th-century Kirana vocalist, celebrated for a powerful, sustained voice and for bringing Hindustani classical music to a mass Indian audience.",
  relations: [ { type: "guru", targetId: "sawaigandharva" } ],
};
