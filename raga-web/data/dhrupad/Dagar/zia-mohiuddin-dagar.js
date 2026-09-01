/* A single musician. Add a `relations` array here to
   connect them to other people anywhere in the tree. */

export default {
  id: "zmdagar",
    image: "https://klofmag.com/wp-content/uploads/2018/07/zia-mohiuddin-dagar.jpg",
  name: "Zia Mohiuddin Dagar",
  description: "A rudra veena maestro of the Dagar family, celebrated for extending dhrupad's slow, meditative alap tradition onto the instrument with extraordinary depth.",
  relations: [ { type: "son", targetId: "bahauddindagar" }, 
    { type: "brother", targetId: "zfdagar" },
    { type: "disciple", targetId: "nancylesh" } ],
    links: [
    { label: "Raga Yaman — rudra veena", url: "https://www.youtube.com/watch?v=aWSHYi8fs6Y" },
    { label: "Raga Yama: Live in Sweeden", url: "https://www.youtube.com/watch?v=q5trNs7M3MU"},
    { label: "Biography — Wikipedia", url: "https://en.wikipedia.org/wiki/Zia_Mohiuddin_Dagar" }
  ],
};
