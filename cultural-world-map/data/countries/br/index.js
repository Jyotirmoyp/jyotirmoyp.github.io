import country from "./country.js";
import salvador from "./cities/salvador.js";
import rio from "./cities/rio.js";

export default { ...country, cities: [salvador, rio] };
