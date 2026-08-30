import country from "./country.js";
import cairo from "./cities/cairo.js";
import luxor from "./cities/luxor.js";

export default { ...country, cities: [cairo, luxor] };
