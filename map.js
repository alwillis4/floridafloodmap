// Initialize the map and set view to Florida
var map = L.map("map").setView([28.48, -81.4], 6);

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Popup on map click
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);

// Define flood layers
const flood7ft = L.tileLayer(
  "http://127.0.0.1:5500/tiles/Flood7Ft/{z}/{x}/{y}.png",
  {
    attribution: "Flood 7ft",
    minZoom: 1,
    maxZoom: 11,
  }
);

const flood1ft = L.tileLayer(
  "http://127.0.0.1:5500/tiles/Flood1Ft/{z}/{x}/{y}.png",
  {
    attribution: "Flood 1ft",
    minZoom: 1,
    maxZoom: 11,
  }
);

const flood2ft = L.tileLayer(
  "http://127.0.0.1:5500/tiles/Flood2Ft/{z}/{x}/{y}.png",
  {
    attribution: "Flood 2ft",
    minZoom: 1,
    maxZoom: 11,
  }
);

const flood3ft = L.tileLayer(
  "http://127.0.0.1:5500/tiles/Flood3Ft/{z}/{x}/{y}.png",
  {
    attribution: "Flood 3ft",
    minZoom: 1,
    maxZoom: 11,
  }
);

// Labels layer
const labelsOnly = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }
);

// Add initial layers
let currentFloodLayer = flood7ft;
currentFloodLayer.addTo(map);
labelsOnly.addTo(map);

// Dropdown layer switcher
const layerSelect = document.getElementById("layerSelect");
const mapInfo = document.getElementById("mapInfo");

layerSelect.addEventListener("change", function () {
  if (map.hasLayer(currentFloodLayer)) {
    map.removeLayer(currentFloodLayer);
  }

  if (layerSelect.value === "1ft") {
    currentFloodLayer = flood1ft;
    mapInfo.innerHTML = `
      <p>
        This map shows areas in Florida potentially affected by a <strong>1-foot sea-level rise</strong>.
        Use the dropdown to switch flood layers. The color legend helps interpret flood depths.
      </p>
    `;
  } else if (layerSelect.value === "2ft") {
    currentFloodLayer = flood2ft;
    mapInfo.innerHTML = `
      <p>
        This map shows areas in Florida potentially affected by a <strong>2-foot sea-level rise</strong>.
        Use the dropdown to switch flood layers. The color legend helps interpret flood depths.
      </p>
    `;
  } else if (layerSelect.value === "3ft") {
    currentFloodLayer = flood3ft;
    mapInfo.innerHTML = `
      <p>
        This map shows areas in Florida potentially affected by a <strong>3-foot sea-level rise</strong>.
        Use the dropdown to switch flood layers. The color legend helps interpret flood depths.
      </p>
    `;
  } else {
    currentFloodLayer = flood7ft;
    mapInfo.innerHTML = `
      <p>
        This map shows areas in Florida potentially affected by a <strong>7-foot sea-level rise</strong>.
        Use the dropdown to switch flood layers. The color legend helps interpret flood depths.
      </p>
    `;
  }

  currentFloodLayer.addTo(map);
  labelsOnly.addTo(map);
});
// Legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  var grades = [
    { label: "0 to 5 inches", color: "limegreen" },
    { label: "6 to 11 inches", color: "lightpink" },
    { label: "12 to 17 inches", color: "hotpink" },
    { label: "18 to 23 inches", color: "violet" },
    { label: "2 to 3 feet", color: "skyblue" },
    { label: "3 to 4 feet", color: "orange" },
    { label: "4 to 5 feet", color: "gold" },
    { label: "5 to 6 feet", color: "orangered" },
    { label: "6 to 7 feet", color: "crimson" },
    { label: "7 to 8 feet", color: "mediumvioletred" },
    { label: "8 to 9 feet", color: "darkmagenta" },
    { label: "9 to 10 feet", color: "darkslateblue" },
    { label: "10 to 11 feet", color: "teal" },
    { label: "11 to 12 feet", color: "saddlebrown" },
  ];

  div.innerHTML = "<h4>Flood Depth</h4>";
  grades.forEach(function (range) {
    div.innerHTML +=
      '<i style="background:' + range.color + '"></i> ' + range.label + "<br>";
  });

  return div;
};

legend.addTo(map);
