/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "abdulkarimkhan",
  name: "Abdul Karim Khan",
  description: "Ustad Abdul Karim Khan (1872-1937) founded the Kirana gharana, known for his sustained, deeply emotive akar and for popularising the raga Yaman Kalyan-style meditative approach across North and South India.",
  relations: [ { type: "disciple", targetId: "sawaigandharva" } ],
};
