import country from "./country.js";
import varanasi from "./cities/varanasi.js";
import jaipur from "./cities/jaipur.js";

export default { ...country, cities: [varanasi, jaipur] };
