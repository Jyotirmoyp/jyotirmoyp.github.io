(function () {
  const svg = d3.select("#map");
  const g = svg.append("g");
  const countriesLayer = g.append("g").attr("class", "countries-layer");
  const citiesLayer = g.append("g").attr("class", "cities-layer");

  const resetBtn = document.getElementById("resetBtn");
  const mapHint = document.getElementById("mapHint");

  const sidebarEmpty = document.getElementById("sidebarEmpty");
  const sidebarContent = document.getElementById("sidebarContent");
  const sidebarEyebrow = document.getElementById("sidebarEyebrow");
  const sidebarTitle = document.getElementById("sidebarTitle");
  const sidebarDesc = document.getElementById("sidebarDesc");
  const sidebarImages = document.getElementById("sidebarImages");
  const sidebarCities = document.getElementById("sidebarCities");
  const cityList = document.getElementById("cityList");

  const projection = d3.geoNaturalEarth1();
  const path = d3.geoPath(projection);

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
      g.attr("stroke-width", 0.75 / event.transform.k);
    });

  svg.call(zoom);

  let width = 0, height = 0;
  let activeCountry = null;

  function size() {
    const rect = document.getElementById("mapPane").getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    svg.attr("viewBox", [0, 0, width, height]);
    projection.fitSize([width, height], { type: "Sphere" });
  }

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

  function showCountry(entry, iso) {
    sidebarEmpty.hidden = true;
    sidebarContent.hidden = false;

    sidebarEyebrow.textContent = "Country";
    sidebarTitle.textContent = entry.name;
    sidebarDesc.textContent = entry.description;
    renderImages(sidebarImages, entry.images);

    if (entry.cities && entry.cities.length) {
      sidebarCities.hidden = false;
      cityList.innerHTML = "";
      entry.cities.forEach((city) => {
        const btn = document.createElement("button");
        btn.className = "city-btn";
        btn.type = "button";
        btn.textContent = city.name;
        btn.addEventListener("click", () => {
          cityList.querySelectorAll(".city-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          citiesLayer.selectAll(".city-dot").classed("active", (d) => d.name === city.name);
          showCity(city, entry.name);
        });
        cityList.appendChild(btn);
      });
    } else {
      sidebarCities.hidden = true;
    }

    drawCityDots(entry, iso);
  }

  function showCity(city, countryName) {
    sidebarEyebrow.textContent = countryName;
    sidebarTitle.textContent = city.name;
    sidebarDesc.textContent = city.description;
    renderImages(sidebarImages, city.images);
  }

  function drawCityDots(entry, iso) {
    citiesLayer.selectAll("*").remove();
    if (!entry.cities) return;

    const dots = citiesLayer.selectAll(".city-dot")
      .data(entry.cities, (d) => d.name)
      .enter()
      .append("circle")
      .attr("class", "city-dot")
      .attr("r", 4.5)
      .attr("cx", (d) => projection(d.coords)[0])
      .attr("cy", (d) => projection(d.coords)[1])
      .on("click", (event, d) => {
        event.stopPropagation();
        citiesLayer.selectAll(".city-dot").classed("active", (dd) => dd.name === d.name);
        cityList.querySelectorAll(".city-btn").forEach((b) => {
          b.classList.toggle("active", b.textContent === d.name);
        });
        showCity(d, entry.name);
      });

    citiesLayer.selectAll(".city-label")
      .data(entry.cities, (d) => d.name)
      .enter()
      .append("text")
      .attr("class", "city-label")
      .attr("x", (d) => projection(d.coords)[0] + 7)
      .attr("y", (d) => projection(d.coords)[1] + 4)
      .text((d) => d.name);
  }

  function clearSidebar() {
    sidebarEmpty.hidden = false;
    sidebarContent.hidden = true;
    citiesLayer.selectAll("*").remove();
  }

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

  function onCountryClick(event, feature) {
    const iso = feature.properties.iso_a2;
    const entry = iso ? CONTENT[iso] : null;

    countriesLayer.selectAll(".country").classed("active", (d) => d === feature);
    activeCountry = feature;
    resetBtn.hidden = false;
    mapHint.hidden = true;

    zoomToFeature(feature);

    if (entry) {
      showCountry(entry, iso);
    } else {
      sidebarEmpty.hidden = true;
      sidebarContent.hidden = false;
      sidebarEyebrow.textContent = "Country";
      sidebarTitle.textContent = feature.properties.name || "Unknown";
      sidebarDesc.textContent = "No cultural notes added for this country yet.";
      sidebarImages.innerHTML = "";
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
        if (activeCountry) {
          citiesLayer.selectAll(".city-dot")
            .attr("cx", (d) => projection(d.coords)[0])
            .attr("cy", (d) => projection(d.coords)[1]);
          citiesLayer.selectAll(".city-label")
            .attr("x", (d) => projection(d.coords)[0] + 7)
            .attr("y", (d) => projection(d.coords)[1] + 4);
        }
      });
    })
    .catch((err) => {
      mapHint.textContent = "Could not load map data.";
      console.error(err);
    });
})();
