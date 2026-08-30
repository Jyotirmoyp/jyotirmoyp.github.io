import country from "./country.js";
import paris from "./cities/paris.js";
import lyon from "./cities/lyon.js";

export default { ...country, cities: [paris, lyon] };
