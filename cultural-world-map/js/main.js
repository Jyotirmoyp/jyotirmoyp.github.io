import CONTENT from "../data/index.js";

const svg = d3.select("#map");
const g = svg.append("g"); // countries only — this group is what zoom transforms
const countriesLayer = g.append("g").attr("class", "countries-layer");
const citiesLayer = svg.append("g").attr("class", "cities-layer"); // sibling of g, positioned manually so markers/labels never scale with zoom

const resetBtn = document.getElementById("resetBtn");
const mapHint = document.getElementById("mapHint");

const sidebarEmpty = document.getElementById("sidebarEmpty");
const sidebarContent = document.getElementById("sidebarContent");
const sidebarEyebrow = document.getElementById("sidebarEyebrow");
const sidebarTitle = document.getElementById("sidebarTitle");
const sidebarDesc = document.getElementById("sidebarDesc");
const sidebarImages = document.getElementById("sidebarImages");
const sidebarSections = document.getElementById("sidebarSections");
const sidebarCities = document.getElementById("sidebarCities");
const cityList = document.getElementById("cityList");

const projection = d3.geoNaturalEarth1();
const path = d3.geoPath(projection);

let currentTransform = d3.zoomIdentity;
let width = 0, height = 0;
let activeCountry = null;

const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", (event) => {
    currentTransform = event.transform;
    g.attr("transform", currentTransform);
    g.attr("stroke-width", 0.75 / currentTransform.k);
    updateCityPositions();
  });

svg.call(zoom);

function size() {
  const rect = document.getElementById("mapPane").getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  svg.attr("viewBox", [0, 0, width, height]);
  projection.fitSize([width, height], { type: "Sphere" });
}

function projectedPoint(coords) {
  const p = projection(coords);
  return currentTransform.apply(p);
}

// ---------- sidebar rendering ----------

function renderImages(container, images) {
  container.innerHTML = "";
  (images || []).forEach((img) => {
    const fig = document.createElement("figure");
    const swatch = document.createElement("div");
    swatch.className = "img-swatch";
    if (img.src) {
      swatch.style.background = `center / cover no-repeat url(${img.src})`;
    } else {
      swatch.style.background = img.color || "#e4e4de";
    }
    const cap = document.createElement("figcaption");
    cap.textContent = img.caption || "";
    fig.appendChild(swatch);
    fig.appendChild(cap);
    container.appendChild(fig);
  });
}

function renderSections(sections) {
  sidebarSections.innerHTML = "";
  const visible = sections.filter((s) => s.value && (!Array.isArray(s.value) || s.value.length));
  sidebarSections.hidden = visible.length === 0;

  visible.forEach((sec) => {
    const wrap = document.createElement("div");
    wrap.className = "sidebar-section";

    const h3 = document.createElement("h3");
    h3.textContent = sec.label;
    wrap.appendChild(h3);

    if (Array.isArray(sec.value)) {
      const list = document.createElement("div");
      list.className = "travel-plan";
      sec.value.forEach((item) => {
        const row = document.createElement("div");
        row.className = "travel-day";
        const label = document.createElement("span");
        label.className = "travel-day-label";
        label.textContent = item.day;
        const plan = document.createElement("p");
        plan.className = "travel-day-plan";
        plan.textContent = item.plan;
        row.appendChild(label);
        row.appendChild(plan);
        list.appendChild(row);
      });
      wrap.appendChild(list);
    } else {
      const p = document.createElement("p");
      p.className = "sidebar-section-text";
      p.textContent = sec.value;
      wrap.appendChild(p);
    }

    sidebarSections.appendChild(wrap);
  });
}

function showCountry(entry) {
  sidebarEmpty.hidden = true;
  sidebarContent.hidden = false;

  sidebarEyebrow.textContent = "Country";
  sidebarTitle.textContent = entry.name;
  sidebarDesc.textContent = entry.description;
  renderImages(sidebarImages, entry.images);
  renderSections([]); // country view has no travel/city sections

  if (entry.cities && entry.cities.length) {
    sidebarCities.hidden = false;
    cityList.innerHTML = "";
    entry.cities.forEach((city) => {
      const btn = document.createElement("button");
      btn.className = "city-btn";
      btn.type = "button";
      btn.textContent = city.name;
      btn.addEventListener("click", () => selectCity(city, entry.name));
      cityList.appendChild(btn);
    });
  } else {
    sidebarCities.hidden = true;
  }

  drawCityDots(entry);
}

function showCity(city, countryName) {
  sidebarEyebrow.textContent = countryName;
  sidebarTitle.textContent = city.name;
  sidebarDesc.textContent = city.overview;
  renderImages(sidebarImages, city.images);
  renderSections([
    { label: "Travel plan", value: city.travelPlan },
    { label: "Cultural aspects", value: city.culturalAspects },
    { label: "Folk culture", value: city.folkCulture },
    { label: "Music", value: city.music }
  ]);
}

function selectCity(city, countryName) {
  citiesLayer.selectAll(".city-dot").classed("active", (d) => d.name === city.name);
  cityList.querySelectorAll(".city-btn").forEach((b) => {
    b.classList.toggle("active", b.textContent === city.name);
  });
  showCity(city, countryName);
}

function clearSidebar() {
  sidebarEmpty.hidden = false;
  sidebarContent.hidden = true;
  citiesLayer.selectAll("*").remove();
}

// ---------- city markers (fixed pixel size, independent of zoom) ----------

function drawCityDots(entry) {
  citiesLayer.selectAll("*").remove();
  if (!entry.cities) return;

  citiesLayer.selectAll(".city-dot")
    .data(entry.cities, (d) => d.name)
    .enter()
    .append("circle")
    .attr("class", "city-dot")
    .attr("r", 4)
    .on("click", (event, d) => {
      event.stopPropagation();
      selectCity(d, entry.name);
    });

  citiesLayer.selectAll(".city-label")
    .data(entry.cities, (d) => d.name)
    .enter()
    .append("text")
    .attr("class", "city-label")
    .text((d) => d.name);

  updateCityPositions();
}

function updateCityPositions() {
  citiesLayer.selectAll(".city-dot")
    .attr("cx", (d) => projectedPoint(d.coords)[0])
    .attr("cy", (d) => projectedPoint(d.coords)[1]);

  citiesLayer.selectAll(".city-label")
    .attr("x", (d) => projectedPoint(d.coords)[0] + 8)
    .attr("y", (d) => projectedPoint(d.coords)[1] + 3);
}

// ---------- zoom ----------

function zoomToFeature(feature) {
  const [[x0, y0], [x1, y1]] = path.bounds(feature);
  const dx = x1 - x0, dy = y1 - y0;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const scale = Math.max(1, Math.min(8, 0.85 / Math.max(dx / width, dy / height)));
  const translate = [width / 2 - scale * cx, height / 2 - scale * cy];

  svg.transition().duration(700)
    .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
}

function zoomToWorld() {
  svg.transition().duration(700).call(zoom.transform, d3.zoomIdentity);
}

// ---------- events ----------

function onCountryClick(event, feature) {
  const iso = feature.properties.iso_a2;
  const entry = iso ? CONTENT[iso] : null;

  countriesLayer.selectAll(".country").classed("active", (d) => d === feature);
  activeCountry = feature;
  resetBtn.hidden = false;
  mapHint.hidden = true;

  zoomToFeature(feature);

  if (entry) {
    showCountry(entry);
  } else {
    sidebarEmpty.hidden = true;
    sidebarContent.hidden = false;
    sidebarEyebrow.textContent = "Country";
    sidebarTitle.textContent = feature.properties.name || "Unknown";
    sidebarDesc.textContent = "No cultural notes added for this country yet.";
    sidebarImages.innerHTML = "";
    renderSections([]);
    sidebarCities.hidden = true;
    citiesLayer.selectAll("*").remove();
  }
}

function reset() {
  countriesLayer.selectAll(".country").classed("active", false);
  activeCountry = null;
  resetBtn.hidden = true;
  mapHint.hidden = false;
  clearSidebar();
  zoomToWorld();
}

resetBtn.addEventListener("click", reset);
svg.on("click", (event) => {
  if (event.target === svg.node()) reset();
});

fetch("data/countries.geo.json")
  .then((r) => r.json())
  .then((geo) => {
    size();

    countriesLayer.selectAll(".country")
      .data(geo.features)
      .enter()
      .append("path")
      .attr("class", "country hoverable")
      .attr("d", path)
      .on("click", onCountryClick);

    window.addEventListener("resize", () => {
      size();
      countriesLayer.selectAll(".country").attr("d", path);
      if (activeCountry) updateCityPositions();
    });
  })
  .catch((err) => {
    mapHint.textContent = "Could not load map data.";
    console.error(err);
  });
