// Initialize the map and set view to a specific location (London)
var map = L.map("map").setView([28.48, -81.4], 6);

// Add OpenStreetMap tile layer
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   maxZoom: 19,
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// }).addTo(map);

// var Stadia_AlidadeSmooth = L.tileLayer(
//   "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}",
//   {
//     minZoom: 0,
//     maxZoom: 20,
//     attribution:
//       '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     ext: "png",
//   }
// ).addTo(map);

var Stadia_AlidadeSatellite = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}",
  {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: "jpg",
  }
).addTo(map);





// Popup on map click
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);

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

const labelsOnly = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }
);

// Add the 7ft layer by default
let currentFloodLayer = flood7ft;
currentFloodLayer.addTo(map);
labelsOnly.addTo(map);

// Toggle button logic
const toggleBtn = document.getElementById("toggleBtn");
const mapInfo = document.getElementById("mapInfo");

toggleBtn.addEventListener("click", function () {
  if (map.hasLayer(flood7ft)) {
    map.removeLayer(flood7ft);
    flood1ft.addTo(map);
    currentFloodLayer = flood1ft;
    toggleBtn.textContent = "Switch to 7ft Flood Layer";

    // Update info text
    mapInfo.innerHTML = `
      <p>
        This map shows areas in Florida potentially affected by a <strong>1-foot sea-level rise</strong>.
        Use the button to toggle back to the 7ft flood layer. The color legend helps interpret flood depths.
      </p>
    `;
  } else {
    map.removeLayer(flood1ft);
    flood7ft.addTo(map);
    currentFloodLayer = flood7ft;
    toggleBtn.textContent = "Switch to 1ft Flood Layer";

    // Update info text
    mapInfo.innerHTML = `
      <p>
        This map shows areas in Florida potentially affected by a <strong>7-foot sea-level rise</strong>.
        Use the button to toggle to the 1ft flood layer. The color legend helps interpret flood depths.
      </p>
    `;
  }

  // Re-add labels to ensure they're visible
  labelsOnly.addTo(map);
});

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  var grades = [
    { label: "0 to 5 inches", color: "limegreen" },
    { label: "6 to 11 inches", color: "lightpink" },
    { label: "12 to 17 inches", color: "hotpink" },
    { label: "18 to 23 inches", color: "violet" },
    { label: "2 to 3 feet", color: "skyblue", colorName: "Sky Blue" },
    { label: "3 to 4 feet", color: "orange", colorName: "Orange" },
    { label: "4 to 5 feet", color: "gold", colorName: "Gold" },
    { label: "5 to 6 feet", color: "orangered", colorName: "Orange Red" },
    { label: "6 to 7 feet", color: "crimson", colorName: "Crimson" },
    {
      label: "7 to 8 feet",
      color: "mediumvioletred",
      colorName: "Medium Violet Red",
    },
    { label: "8 to 9 feet", color: "darkmagenta", colorName: "Dark Magenta" },
    {
      label: "9 to 10 feet",
      color: "darkslateblue",
      colorName: "Dark Slate Blue",
    },
    { label: "10 to 11 feet", color: "teal", colorName: "Teal" },
    { label: "11 to 12 feet", color: "saddlebrown", colorName: "Saddle Brown" },
  ];

  div.innerHTML = "<h4>Flood Depth</h4>";
  grades.forEach(function (range) {
    div.innerHTML +=
      '<i style="background:' + range.color + '"></i> ' + range.label + "<br>";
  });

  return div;
};

legend.addTo(map);
