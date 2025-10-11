// Initialize the map and set view to Florida
var map = L.map("map").setView([28.48, -81.4], 6);

map.on("tileerror", function (err) {
  console.error("Tile failed to load", err.tile.src);
});

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Add geocoder control to the map
L.Control.geocoder({
  defaultMarkGeocode: true,
  placeholder: "Search for location...",
  errorMessage: "Location not found.",
  showResultIcons: true,
}).addTo(map);

// Popup on map click
var popup = L.popup();
map.on("click", function (e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
});

// Flood layers
const floodLayers = {
  "1ft": L.tileLayer("http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_1_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 1ft",
    minZoom: 1,
    maxZoom: 20,
  }),
  "2ft": L.tileLayer("http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_2_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 2ft",
    minZoom: 1,
    maxZoom: 20,
  }),
  "3ft": L.tileLayer("http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_3_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 3ft",
    minZoom: 1,
    maxZoom: 20,
  }),
  "4ft": L.tileLayer("http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_4_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 4ft",
    minZoom: 1,
    maxZoom: 20,
  }),
  "5ft": L.tileLayer("http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_5_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 5ft",
    minZoom: 1,
    maxZoom: 20,
  }),
  "6ft": L.tileLayer("http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_6_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 6ft",
    minZoom: 1,
    maxZoom: 20,
  }),
  "7ft": L.tileLayer("http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_7_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 7ft",
    minZoom: 1,
    maxZoom: 20,
  }),

  geoserver: L.tileLayer(
    "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:world/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
    {
      attribution: "Geoserver",
      minZoom: 1,
      maxZoom: 20,
    }
  ),
  disputed: L.tileLayer(
    "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:disputed_areas/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
    {
      attribution: "Disputed Areas",
      minZoom: 1,
      maxZoom: 3,
    }
  ),

  test_7ft: L.tileLayer(
    "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_7_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
    {
      attribution: "FGDL 7 Foot Flood Layer",
      minZoom: 1,
      maxZoom: 20,
    }
  ),
  test_6ft: L.tileLayer(
    "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_6_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
    {
      attribution: "FGDL 6 Foot Flood Layer",
      minZoom: 1,
      maxZoom: 20,
    }
  ),
};

// Labels layer
const labelsOnly = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }
);

// County Lines layer
const countyLines = L.tileLayer(
  "http://127.0.0.1:5500/tiles/CountyLine/{z}/{x}/{y}.png",
  {
    attribution: "County Lines",
    minZoom: 1,
    maxZoom: 11,
  }
);

const hundredyearFloodplain = L.tileLayer(
  "http://127.0.0.1:5500/tiles/100yearFloodplain/{z}/{x}/{y}.png",
  {
    attribution: "100yearFloodplain",
    minZoom: 1,
    maxZoom: 11,
  }
);

const fivehundredyearFloodplain = L.tileLayer(
  "http://127.0.0.1:5500/tiles/500yearFloodplain/{z}/{x}/{y}.png",
  {
    attribution: "500yearFloodplain",
    minZoom: 1,
    maxZoom: 11,
  }
);

// Initial setup
let currentFloodLayer = floodLayers["7ft"];
currentFloodLayer.addTo(map);
labelsOnly.addTo(map);

// Dropdown and info section
const layerSelect = document.getElementById("layerSelect");
const mapInfo = document.getElementById("mapInfo");

// Detailed flood level descriptions
const floodDescriptions = {
  "1ft": `The 1 foot flood inundation (also known as flooding) depth map is used to show a projected 1 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 1 foot storm surge can happen whenever a strong storm makes landfall in the state.`,

  "2ft": `The 2 feet flood inundation (also known as flooding) depth map is used to show a projected 2 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 2 feet storm surge can happen whenever a strong storm makes landfall and can occur yearly all year round.`,

  "3ft": `The 3 feet flood inundation (also known as flooding) depth map is used to show a projected 3 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 3 feet storm surge can happen whenever a strong storm makes landfall and can occur yearly all year round.`,

  "4ft": `The 4 feet flood inundation (also known as flooding) depth map is used to show a projected 4 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 4 feet storm surge is less likely to occur and occur during tropical storm and categories 1 and 2 hurricanes.`,

  "5ft": `The 5 feet flood inundation (also known as flooding) depth map is used to show a projected 5 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 5 feet storm surge is less likely to occur and can occur during stronger tropical storms and category 2 hurricanes.`,

  "6ft": `The 6 feet flood inundation (also known as flooding) depth map is used to show a projected 6 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 6 feet storm surge is less likely to occur and occur during tropical storm and categories 1 and 2 hurricanes.`,

  "7ft": `The 7 feet flood inundation (also known as flooding) depth map is used to show a projected 7 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 7 feet storm surge is less likely to occur and occur in categories 3 and above hurricanes. These major hurricanes can occur in about three to five years in the state though the panhandle is variable and can suffer from major hurricanes and storms more often than the rest of the state.`
};

// Dropdown layer switcher with new descriptions
layerSelect.addEventListener("change", function () {
  if (map.hasLayer(currentFloodLayer)) {
    map.removeLayer(currentFloodLayer);
  }
  currentFloodLayer = floodLayers[layerSelect.value];
  currentFloodLayer.addTo(map);
  labelsOnly.addTo(map);

  const selectedValue = layerSelect.value;
  if (floodDescriptions[selectedValue]) {
    mapInfo.innerHTML = `<p>${floodDescriptions[selectedValue]}</p>`;
  } else {
    mapInfo.innerHTML = `<p>Selected layer: <strong>${selectedValue}</strong></p>`;
  }
});

// Legend with tabs
var legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");

  div.innerHTML = `
    <div class="tab-header">
      <button class="tab-button active" data-tab="legendTab">Legend</button>
      <button class="tab-button" data-tab="layersTab">Other Layers</button>
    </div>

    <div id="legendTab" class="tab-content active">
      <h4>Flood Depth</h4>
      <div class="flood-legend">
        <i style="background:limegreen"></i> 0 to 5 inches<br>
        <i style="background:lightpink"></i> 6 to 11 inches<br>
        <i style="background:hotpink"></i> 12 to 17 inches<br>
        <i style="background:violet"></i> 18 to 23 inches<br>
        <i style="background:skyblue"></i> 2 to 3 feet<br>
        <i style="background:orange"></i> 3 to 4 feet<br>
        <i style="background:gold"></i> 4 to 5 feet<br>
        <i style="background:orangered"></i> 5 to 6 feet<br>
        <i style="background:crimson"></i> 6 to 7 feet<br>
        <i style="background:mediumvioletred"></i> 7 to 8 feet<br>
        <i style="background:darkmagenta"></i> 8 to 9 feet<br>
        <i style="background:darkslateblue"></i> 9 to 10 feet<br>
        <i style="background:teal"></i> 10 to 11 feet<br>
        <i style="background:saddlebrown"></i> >11  feet<br>
      </div>
    </div>

    <div id="layersTab" class="tab-content">
      <h4>Other Layers</h4>
      <div class="other-layers">
        <input type="checkbox" id="insuranceRates" /> <label for="insuranceRates">Insurance Rates</label><br>
        <input type="checkbox" id="hazardZones" /> <label for="hazardZones">Hazard Zones</label><br>
        <input type="checkbox" id="vulnerabilityIndex" /> <label for="vulnerabilityIndex">Vulnerability Index</label><br>
        <input type="checkbox" id="parcels" /> <label for="parcels">Parcels</label><br>
        <input type="checkbox" id="countyLines" /> <label for="countyLines">County Lines</label><br>
        <input type="checkbox" id="hundredyearFloodplain" legend="100yearlegend" /> <label for="100yearFloodplain">100 Year Floodplain</label>
        <div class="flood-legend hidden" id="100yearlegend">
        <i style="background:limegreen"></i> In 100 Year Floodplain<br>
        </div> <br>
        <input type="checkbox" id="fivehundredyearFloodplain" legend="500yearlegend" /> <label for="500yearFloodplain">500 Year Floodplain</label>
        <div class="flood-legend hidden" id="500yearlegend">
        <i style="background:purple"></i> In 500 Year Floodplain<br>
        </div>
      </div>
    </div>
  `;

  return div;
};

legend.addTo(map);

// Tab switching logic
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("tab-button")) {
    const tab = e.target.getAttribute("data-tab");

    document
      .querySelectorAll(".tab-button")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    document
      .querySelectorAll(".tab-content")
      .forEach((tc) => tc.classList.remove("active"));
    document.getElementById(tab).classList.add("active");
  }
});

// Checkbox interactivity
document.addEventListener("change", function (e) {
  if (e.target.id === "countyLines") {
    if (e.target.checked) {
      map.addLayer(countyLines);
    } else {
      map.removeLayer(countyLines);
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "hundredyearFloodplain") {
    const legendid = e.target.getAttribute("legend");
    const legendelement = document.getElementById(legendid);
    if (e.target.checked) {
      map.addLayer(hundredyearFloodplain);
      legendelement.classList.remove("hidden");
    } else {
      map.removeLayer(hundredyearFloodplain);
      legendelement.classList.add("hidden");
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "fivehundredyearFloodplain") {
    const legendid = e.target.getAttribute("legend");
    const legendelement = document.getElementById(legendid);
    if (e.target.checked) {
      map.addLayer(fivehundredyearFloodplain);
      legendelement.classList.remove("hidden");
    } else {
      map.removeLayer(fivehundredyearFloodplain);
      legendelement.classList.add("hidden");
    }
  }
});
