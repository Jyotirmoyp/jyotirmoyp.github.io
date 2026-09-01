/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "sawaigandharva",
  name: "Sawai Gandharva",
  description: "A disciple of Abdul Karim Khan who became the gharana's key transmitter to the next generation, training the two vocalists who carried Kirana singing to a national audience.",
  relations: [ { type: "guru", targetId: "abdulkarimkhan" }, { type: "disciple", targetId: "bhimsenjoshi" }, { type: "disciple", targetId: "gangubaihangal" } ],
};
