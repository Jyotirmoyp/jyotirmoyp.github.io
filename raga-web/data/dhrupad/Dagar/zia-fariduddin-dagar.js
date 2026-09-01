/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "zfdagar",
  name: "Zia Fariduddin Dagar",
  description: "A leading vocal exponent of the Dagar family's dhrupad tradition, known for his teaching as much as his own austere, deliberate singing.",
  relations: [ { type: "brother", targetId: "zmdagar" }, { type: "disciple", targetId: "nancylesh" } ],

};
