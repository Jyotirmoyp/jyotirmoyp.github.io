/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "zmdagar",
  name: "Zia Mohiuddin Dagar",
  description: "A rudra veena maestro of the Dagar family, celebrated for extending dhrupad's slow, meditative alap tradition onto the instrument with extraordinary depth.",
  relations: [ { type: "son", targetId: "bahauddindagar" }, { type: "disciple", targetId: "nancylesh" } ],
};
