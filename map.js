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
  "1ft": L.tileLayer("http://127.0.0.1:5500/tiles/Flood1Ft/{z}/{x}/{y}.png", {
    attribution: "Flood 1ft",
    minZoom: 1,
    maxZoom: 11,
  }),
  "2ft": L.tileLayer("http://127.0.0.1:5500/tiles/Flood2Ft/{z}/{x}/{y}.png", {
    attribution: "Flood 2ft",
    minZoom: 1,
    maxZoom: 11,
  }),
  "3ft": L.tileLayer("http://127.0.0.1:5500/tiles/Flood3Ft/{z}/{x}/{y}.png", {
    attribution: "Flood 3ft",
    minZoom: 1,
    maxZoom: 11,
  }),
  "4ft": L.tileLayer("http://127.0.0.1:5500/tiles/Flood4Ft/{z}/{x}/{y}.png", {
    attribution: "Flood 4ft",
    minZoom: 1,
    maxZoom: 11,
  }),
  "5ft": L.tileLayer("http://127.0.0.1:5500/tiles/Flood5Ft/{z}/{x}/{y}.png", {
    attribution: "Flood 5ft",
    minZoom: 1,
    maxZoom: 11,
  }),
  "6ft": L.tileLayer("http://127.0.0.1:5500/tiles/Flood6Ft/{z}/{x}/{y}.png", {
    attribution: "Flood 6ft",
    minZoom: 1,
    maxZoom: 11,
  }),
  "7ft": L.tileLayer("http://127.0.0.1:5500/tiles/Flood7Ft/{z}/{x}/{y}.png", {
    attribution: "Flood 7ft",
    minZoom: 1,
    maxZoom: 11,
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

  test_7ft : L.tileLayer(
    "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_7_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
    {
      attribution: "FGDL 7 Foot Flood Layer",
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

// Dropdown layer switcher
const layerSelect = document.getElementById("layerSelect");
const mapInfo = document.getElementById("mapInfo");

layerSelect.addEventListener("change", function () {
  if (map.hasLayer(currentFloodLayer)) {
    map.removeLayer(currentFloodLayer);
  }
  currentFloodLayer = floodLayers[layerSelect.value];
  currentFloodLayer.addTo(map);
  labelsOnly.addTo(map);

  mapInfo.innerHTML = `<p>This map shows areas in Florida potentially affected by a <strong>${layerSelect.value}-foot sea-level rise</strong>.</p>`;
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
    console.log(legendid);
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
    console.log(legendid);
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
