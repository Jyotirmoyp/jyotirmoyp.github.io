// Top-level content manifest.
// Each country lives in its own folder: data/countries/<iso-code>/
//   country.js        -> country-level name/description/images
//   cities/<city>.js   -> one file per city (overview, travel plan,
//                         cultural aspects, folk culture, music, images)
//   index.js           -> combines the two into one object
//
// To add a new country: create the folder + files following the same
// shape, then add one import + one line below.

import jp from "./countries/jp/index.js";
import fr from "./countries/fr/index.js";
import inCountry from "./countries/in/index.js";
import br from "./countries/br/index.js";
import eg from "./countries/eg/index.js";

const CONTENT = {
  JP: jp,
  FR: fr,
  IN: inCountry,
  BR: br,
  EG: eg
};

export default CONTENT;
