// Countries listed here get a different base color on the map even before
// anyone hovers or clicks — a quick visual index of "these are worth a
// look." List is independent of data/index.js, so you can highlight a
// country before you've written its content, or highlight some countries
// without giving every one of them a profile yet.
//
// code:  ISO 3166-1 alpha-2 code (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
// color: any CSS color. Omit it to fall back to the shared default below.

const DEFAULT_COLOR = "#c9a86a"; // muted gold — matches the hover/active accent

const HIGHLIGHTED_COUNTRIES = [
  { code: "JP" },
  { code: "FR", color: "#a8b98a" },
  { code: "IN", color: "#a8b98a" },
  { code: "BR" },
  { code: "EG" }
  // { code: "DE", color: "#a8b98a" }  <- example of a per-country override
];

export default HIGHLIGHTED_COUNTRIES.map((c) => ({
  code: c.code,
  color: c.color || DEFAULT_COLOR
}));
