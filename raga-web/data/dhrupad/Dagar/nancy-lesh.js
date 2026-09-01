/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "nancylesh",
  name: "Nancy Lesh",
  description: "A rudra veena disciple of Zia Mohiuddin Dagar, among the first Western musicians to train seriously in the Dagarvani tradition and carry it into teaching abroad.",
  relations: [ { type: "guru", targetId: "zmdagar" } ],
};
