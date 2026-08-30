import country from "./country.js";
import kyoto from "./cities/kyoto.js";
import tokyo from "./cities/tokyo.js";

export default { ...country, cities: [kyoto, tokyo] };
