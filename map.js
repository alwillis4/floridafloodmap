// Initialize the map and set view to Florida
var map = L.map("map").setView([28.48, -81.4], 6);

let clickMarker = null;

function placeMarker(latlng) {
  if (clickMarker) {
    clickMarker.setLatLng(latlng); // move marker
  } else {
    clickMarker = L.marker(latlng).addTo(map); // create marker
  }
}

async function queryFeatureServer(latlng) {
  const [
    content1ft,
    content2ft,
    content3ft,
    content4ft,
    content5ft,
    content6ft,
    content7ft,
    contentstormsurge,
    content100yearflood,
    content500yearflood,
    contentHazard,
  ] = await Promise.all([
    getFeatureInfo(latlng, "ne:NOAA_SLR_1_0FT_RECLASS_AUG25"),
    getFeatureInfo(latlng, "ne:NOAA_SLR_2_0FT_RECLASS_AUG25"),
    getFeatureInfo(latlng, "ne:NOAA_SLR_3_0FT_RECLASS_AUG25"),
    getFeatureInfo(latlng, "ne:NOAA_SLR_4_0FT_RECLASS_AUG25"),
    getFeatureInfo(latlng, "ne:NOAA_SLR_5_0FT_RECLASS_AUG25"),
    getFeatureInfo(latlng, "ne:NOAA_SLR_6_0FT_RECLASS_AUG25"),
    getFeatureInfo(latlng, "ne:NOAA_SLR_7_0FT_RECLASS_AUG25"),
    getFeatureInfo(latlng, "ne:ss_zones_aug21"),
    getFeatureInfo(latlng, "ne:dfirm_100_dec24"),
    getFeatureInfo(latlng, "ne:dfirm_500_dec24"),
    getFeatureInfo(latlng, "ne:dfirm_fldhaz_dec24"),
  ]);

  const popupContent = `
    <h3>Clicked location: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(
    4
  )}</h3>
    <p><strong>1Ft Flood Risk:</strong> ${
      content1ft
        ? getRiskMessageFlood(content1ft.PALETTE_INDEX)
        : "No data available"
    }</p>
    <p><strong>2Ft Flood Risk:</strong> ${
      content2ft
        ? getRiskMessageFlood(content2ft.PALETTE_INDEX)
        : "No data available"
    }</p>
    <p><strong>3Ft Flood Risk:</strong> ${
      content3ft
        ? getRiskMessageFlood(content3ft.PALETTE_INDEX)
        : "No data available"
    }</p>
    <p><strong>4Ft Flood Risk:</strong> ${
      content4ft
        ? getRiskMessageFlood(content4ft.PALETTE_INDEX)
        : "No data available"
    }</p>
    <p><strong>5Ft Flood Risk:</strong> ${
      content5ft
        ? getRiskMessageFlood(content5ft.PALETTE_INDEX)
        : "No data available"
    }</p>
    <p><strong>6Ft Flood Risk:</strong> ${
      content6ft
        ? getRiskMessageFlood(content6ft.PALETTE_INDEX)
        : "No data available"
    }</p>
    <p><strong>7Ft Flood Risk:</strong> ${
      content7ft
        ? getRiskMessageFlood(content7ft.PALETTE_INDEX)
        : "No data available"
    }</p>
    <p><strong>Storm Surge Risk:</strong> ${
      contentstormsurge
        ? getRiskMessageStormSurge(contentstormsurge.PALETTE_INDEX)
        : "No data available"
    }</p>
    <p><strong>100 Year Floodplain:</strong> ${
      content100yearflood
        ? getRiskMessage100yearflood(content100yearflood.GRAY_INDEX)
        : "No data available"
    }</p>
    <p><strong>500 Year Floodplain:</strong> ${
      content500yearflood
        ? getRiskMessage500yearflood(content500yearflood.GRAY_INDEX)
        : "No data available"
    }</p>
    <p><strong>Hazard Zone:</strong> ${
      contentHazard
        ? getRiskMessageHazard(contentHazard.FLD_ZONE)
        : "No data available"
    }</p>
  `;

  if (!popupContent || popupContent.trim() === "") {
    popupContent = "<p>No data available</p>";
  }

  document.getElementById("infoText").innerHTML = popupContent;
}

const getRiskMessageHazard = (fld_zone) => {
  if (!fld_zone) {
    return "No data available";
  }

  const zone = fld_zone.toString().trim().toUpperCase();

  switch (zone) {
    case "A":
      return "High Flood Risk exact flood levels unknown. insurance required if house is under federal backed or insured mortgage.";
    case "AE":
      return "High Flood Risk exact flood levels known, insurance required if house is under federal backed or insured mortgage.";
    case "AH":
      return "High Flood Risk exact flood levels around 1 to 3 feet, insurance required if house is under federal backed or insured mortgage.";
    case "AO":
      return "High Flood Risk exact flood levels around 1 to 3 feet around sloped areas, insurance required if house is under federal backed or insured mortgage.";
    case "VE":
      return "High Flood Risk in costal areas. Often above 6 feet in flooding in thoes areas, insurance required if house is under federal backed or insured mortgage.";
    case "X":
      return "Moderate or Minimal Flood Risk, insurance is not required for this area";
    case "D":
      return "Undetermined Flood Risk (Data Not Available at this time) no insurance required for this area.";
    default:
      return "Error in data";
  }
};

const getRiskMessageFlood = (palette_index) => {
  if (palette_index === 0) {
    return "No data available";
  } else if (palette_index === 1) {
    return "0 to 5 inches";
  } else if (palette_index === 2) {
    return "6 to 11 inches";
  } else if (palette_index === 3) {
    return "12 to 17 inches";
  } else if (palette_index === 4) {
    return "18 to 23 inches";
  } else if (palette_index === 5) {
    return "2 to 3 feet";
  } else if (palette_index === 6) {
    return "3 to 4 feet";
  } else if (palette_index === 7) {
    return "4 to 5 feet";
  } else if (palette_index === 8) {
    return "5 to 6 feet";
  } else if (palette_index === 9) {
    return "6 to 7 feet";
  } else if (palette_index === 10) {
    return "7 to 8 feet";
  } else if (palette_index === 11) {
    return "8 to 9 feet";
  } else if (palette_index === 12) {
    return "9 to 10 feet";
  } else if (palette_index === 13) {
    return "10 to 11 feet";
  } else if (palette_index === 14) {
    return ">11 feet";
  } else {
    return "Error in data";
  }
};
const getRiskMessageStormSurge = (palette_index) => {
  if (palette_index === 0) {
    return "No data available";
  } else if (palette_index === 1) {
    return "Zone 1";
  } else if (palette_index === 2) {
    return "Zone 2";
  } else if (palette_index === 3) {
    return "Zone 3";
  } else if (palette_index === 4) {
    return "Zone 4";
  } else if (palette_index === 5) {
    return "Zone 5";
  }
};
const getRiskMessage500yearflood = (gray_index) => {
  const value = Number(gray_index);

  if (isNaN(value)) {
    return "Error in data";
  } else if (value === 0) {
    return "No data available";
  } else if (value === 5) {
    return "In 500 Year Floodplain";
  } else {
    return "Error in data";
  }
};
const getRiskMessage100yearflood = (gray_index) => {
  const value = Number(gray_index);

  if (isNaN(value)) {
    return "Error in data";
  } else if (value === 0) {
    return "No Risk";
  } else if (value === 1) {
    return "In 100 Year Floodplain";
  } else {
    return "Error in data";
  }
};

map.on("tileerror", function (err) {
  console.error("Tile failed to load", err.tile.src);
});

// "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

// Add OpenStreetMap tile layer
L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
).addTo(map);

// geocoder control to the map
const geocoderControl = L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: "Search for location...",
  errorMessage: "Location not found.",
  showResultIcons: true,
}).addTo(map);

geocoderControl.on("markgeocode", async function (e) {
  const latlng = e.geocode.center;

  // center map on the searched location
  map.setView(latlng, 12);
  placeMarker(latlng);
  queryFeatureServer(latlng);
});

const getFeatureInfo = async (latlng, layerName) => {
  const buffer = 0.01;

  const bbox = [
    latlng.lng - buffer, // minX
    latlng.lat - buffer, // minY
    latlng.lng + buffer, // maxX
    latlng.lat + buffer, // maxY
  ];

  const bboxString = bbox.join(",");
  const rootUrl =
    "http://localhost:8080/geoserver/wms?service=WMS&version=1.1.1&request=GetFeatureInfo";
  const suffix =
    "&SRS=EPSG:4326&X=128&Y=128&WIDTH=256&HEIGHT=256&INFO_FORMAT=application/json";
  const url = `${rootUrl}&layers=${layerName}&query_layers=${layerName}&BBOX=${bboxString}${suffix}`;
  console.log(url);
  try {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    const features = data.features.map((feature) => feature.properties);
    if (features.length === 0) {
      return null;
    } else {
      const content = features[0];
      content.layerName = layerName;
      console.log(content);
      return content;
    }
  } catch (error) {
    console.error("Error fetching feature info:", error, layerName);
    return null;
  }
};
var popup = L.popup();

map.on("click", async function (e) {
  const layersTab = document.querySelector(".legend");
  console.log(e);
  if (layersTab.contains(e.originalEvent.target)) {
    console.log("Clicked inside layers tab, ignoring map click.");
    return;
  }
  const latlng = e.latlng;

  placeMarker(latlng);

  queryFeatureServer(latlng);
});

// Flood layers
const floodLayers = {
  "5ft": L.tileLayer(
    "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_5_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
    {
      attribution: "Flood 5ft",
      minZoom: 1,
      maxZoom: 20,
    }
  ),
  "6ft": L.tileLayer(
    "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_6_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
    {
      attribution: "Flood 6ft",
      minZoom: 1,
      maxZoom: 20,
    }
  ),
  "7ft": L.tileLayer(
    "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_7_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
    {
      attribution: "Flood 7ft",
      minZoom: 1,
      maxZoom: 20,
    }
  ),

  hazard: L.tileLayer(
    "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:dfirm_fldhaz_dec24/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
    {
      attribution: "Hazard",
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
};

const labelsOnly = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }
);

const evacRoutes = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:Evacuation_Routes_Hosted/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "evacuationRoutes",
    minZoom: 1,
    maxZoom: 20,
  }
);
const countyLines = L.tileLayer(
  "http://127.0.0.1:5500/tiles/CountyLine/{z}/{x}/{y}.png",
  {
    attribution: "County Lines",
    minZoom: 1,
    maxZoom: 11,
  }
);

const hundredyearFloodplain = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:dfirm_100_dec24/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "100yearFloodplain",
    minZoom: 1,
    maxZoom: 20,
  }
);

const fivehundredyearFloodplain = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:dfirm_500_dec24/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "500yearFloodplain",
    minZoom: 1,
    maxZoom: 20,
  }
);

const stormSurge = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:ss_zones_aug21/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "stormSurge",
    minZoom: 1,
    maxZoom: 20,
  }
);

const oneFoot = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_1_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "Flood 1ft",
    minZoom: 1,
    maxZoom: 20,
  }
);

const twoFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_2_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "Flood 2ft",
    minZoom: 1,
    maxZoom: 20,
  }
);

const threeFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_3_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "Flood 3ft",
    minZoom: 1,
    maxZoom: 20,
  }
);

const fourFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_4_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "Flood 4ft",
    minZoom: 1,
    maxZoom: 20,
  }
);
const fiveFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_5_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "Flood 5ft",
    minZoom: 1,
    maxZoom: 20,
  }
);

const sixFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_6_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "Flood 6ft",
    minZoom: 1,
    maxZoom: 20,
  }
);

const sevenFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_7_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "Flood 7ft",
    minZoom: 1,
    maxZoom: 20,
  }
);
const hazard = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:dfirm_fldhaz_dec24/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png",
  {
    attribution: "Hazard",
    minZoom: 1,
    maxZoom: 20,
  }
);

// Legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");

  div.innerHTML = `
    <div class="tab-header">
      <button class="tab-button" data-tab="layersTab">Layers</button>
    </div>

    <div id="layersTab" class="tab-content">
      <h4>Layers</h4>
      <div class="other-layers">
        <input type="checkbox" id="oneFoot" /> <label for="oneFoot">1 Foot Flood</label> <button class="info-btn" data-layer="oneFoot">ℹ️</button><br>
        <input type="checkbox" id="twoFeet" /> <label for="twoFeet">2 Foot Flood</label> <button class="info-btn" data-layer="twoFeet">ℹ️</button><br>
        <input type="checkbox" id="threeFeet" /> <label for="threeFeet">3 Foot Flood</label> <button class="info-btn" data-layer="threeFeet">ℹ️</button><br>
        <input type="checkbox" id="fourFeet" /> <label for="fourFeet">4 Foot Flood</label><button class="info-btn" data-layer="fourFeet">ℹ️</button><br>
        <input type="checkbox" id="fiveFeet" /> <label for="fiveFeet">5 Foot Flood</label><button class="info-btn" data-layer="fiveFeet">ℹ️</button><br>
        <input type="checkbox" id="sixFeet" /> <label for="sixFeet">6 Foot Flood</label><button class="info-btn" data-layer="sixFeet">ℹ️</button><br>
        <input type="checkbox" id="sevenFeet" /> <label for="sevenFeet">7 Foot Flood</label><button class="info-btn" data-layer="sevenFeet">ℹ️</button><br>
        <input type="checkbox" id="hazard" legend="hazardlegend"/> <label for="hazard">Hazard Zone</label><button class="info-btn" data-layer="hazard">ℹ️</button><br>
        <input type="checkbox" id="evacRoutes" /> <label for="evacRoutes">Evacuation Routes</label><br>
        <input type="checkbox" id="stormSurge" legend="stromlegend" /> <label for="stormSurge">Storm Surge</label> <button class="info-btn" data-layer="stormSurge">ℹ️</button>
        <br>
        <input type="checkbox" id="countyLines" /> <label for="countyLines">County Lines</label><br>
        <input type="checkbox" id="hundredyearFloodplain" legend="100yearlegend" /> <label for="100yearFloodplain">100 Year Floodplain</label> <button class="info-btn" data-layer="hundredyearFloodplain">ℹ️</button>
        <div class="flood-legend hidden" id="100yearlegend">
        <i style="background:#5bd75b"></i> In 100 Year Floodplain<br>
        </div> <br>
        <input type="checkbox" id="fivehundredyearFloodplain" legend="500yearlegend" /> <label for="500yearFloodplain">500 Year Floodplain</label> <button class="info-btn" data-layer="fivehundredyearFloodplain">ℹ️</button>
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

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("hazard");
  const label = document.querySelector('label[for="hazard"]');

  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";

  label.insertAdjacentElement("afterend", arrow);

  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";

  const zones = [
    { color: "#e85b3b", name: "Zone A" },
    { color: "#f99d59", name: "Zone AE" },
    { color: "#fec980", name: "Zone AH" },
    { color: "#7e73e5", name: "Zone AO" },
    { color: "#c7e8ad", name: "Zone D" },
    { color: "#64abb0", name: "Zone VE" },
    { color: "#7e73e5", name: "Zone X" },
  ];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(hazard);
    } else {
      map.removeLayer(hazard);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("oneFoot");
  const label = document.querySelector('label[for="oneFoot"]');

  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";
  label.insertAdjacentElement("afterend", arrow);

  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";

  const zones = [
    { color: "limegreen", name: "0 to 5 inches" },
    { color: "lightpink", name: "6 to 11 inches" },
    { color: "hotpink", name: "12 to 17 inches" },
    { color: "violet", name: "18 to 23 inches" },
    { color: "skyblue", name: "2 to 3 feet" },
    { color: "orange", name: "3 to 4 feet" },
    { color: "gold", name: "4 to 5 feet" },
    { color: "orangered", name: "5 to 6 feet" },
    { color: "crimson", name: "6 to 7 feet" },
    { color: "mediumvioletred", name: "7 to 8 feet" },
    { color: "darkmagenta", name: "8 to 9 feet" },
    { color: "darkslateblue", name: "9 to 10 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "saddlebrown", name: ">11  feet" },
  ];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(oneFoot);
    } else {
      map.removeLayer(oneFoot);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("twoFeet");
  const label = document.querySelector('label[for="twoFeet"]');

  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";

  label.insertAdjacentElement("afterend", arrow);

  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";

  const zones = [
    { color: "limegreen", name: "0 to 5 inches" },
    { color: "lightpink", name: "6 to 11 inches" },
    { color: "hotpink", name: "12 to 17 inches" },
    { color: "violet", name: "18 to 23 inches" },
    { color: "skyblue", name: "2 to 3 feet" },
    { color: "orange", name: "3 to 4 feet" },
    { color: "gold", name: "4 to 5 feet" },
    { color: "orangered", name: "5 to 6 feet" },
    { color: "crimson", name: "6 to 7 feet" },
    { color: "mediumvioletred", name: "7 to 8 feet" },
    { color: "darkmagenta", name: "8 to 9 feet" },
    { color: "darkslateblue", name: "9 to 10 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "saddlebrown", name: ">11  feet" },
  ];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(twoFeet);
    } else {
      map.removeLayer(twoFeet);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("threeFeet");
  const label = document.querySelector('label[for="threeFeet"]');

  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";

  label.insertAdjacentElement("afterend", arrow);

  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";

  const zones = [
    { color: "limegreen", name: "0 to 5 inches" },
    { color: "lightpink", name: "6 to 11 inches" },
    { color: "hotpink", name: "12 to 17 inches" },
    { color: "violet", name: "18 to 23 inches" },
    { color: "skyblue", name: "2 to 3 feet" },
    { color: "orange", name: "3 to 4 feet" },
    { color: "gold", name: "4 to 5 feet" },
    { color: "orangered", name: "5 to 6 feet" },
    { color: "crimson", name: "6 to 7 feet" },
    { color: "mediumvioletred", name: "7 to 8 feet" },
    { color: "darkmagenta", name: "8 to 9 feet" },
    { color: "darkslateblue", name: "9 to 10 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "saddlebrown", name: ">11  feet" },
  ];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(threeFeet);
    } else {
      map.removeLayer(threeFeet);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("fourFeet");
  const label = document.querySelector('label[for="fourFeet"]');

  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";

  label.insertAdjacentElement("afterend", arrow);

  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";

  const zones = [
    { color: "limegreen", name: "0 to 5 inches" },
    { color: "lightpink", name: "6 to 11 inches" },
    { color: "hotpink", name: "12 to 17 inches" },
    { color: "violet", name: "18 to 23 inches" },
    { color: "skyblue", name: "2 to 3 feet" },
    { color: "orange", name: "3 to 4 feet" },
    { color: "gold", name: "4 to 5 feet" },
    { color: "orangered", name: "5 to 6 feet" },
    { color: "crimson", name: "6 to 7 feet" },
    { color: "mediumvioletred", name: "7 to 8 feet" },
    { color: "darkmagenta", name: "8 to 9 feet" },
    { color: "darkslateblue", name: "9 to 10 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "saddlebrown", name: ">11  feet" },
  ];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(fourFeet);
    } else {
      map.removeLayer(fourFeet);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("fiveFeet");
  const label = document.querySelector('label[for="fiveFeet"]');

  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";

  label.insertAdjacentElement("afterend", arrow);

  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";

  const zones = [
    { color: "limegreen", name: "0 to 5 inches" },
    { color: "lightpink", name: "6 to 11 inches" },
    { color: "hotpink", name: "12 to 17 inches" },
    { color: "violet", name: "18 to 23 inches" },
    { color: "skyblue", name: "2 to 3 feet" },
    { color: "orange", name: "3 to 4 feet" },
    { color: "gold", name: "4 to 5 feet" },
    { color: "orangered", name: "5 to 6 feet" },
    { color: "crimson", name: "6 to 7 feet" },
    { color: "mediumvioletred", name: "7 to 8 feet" },
    { color: "darkmagenta", name: "8 to 9 feet" },
    { color: "darkslateblue", name: "9 to 10 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "saddlebrown", name: ">11  feet" },
  ];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(fiveFeet);
    } else {
      map.removeLayer(fiveFeet);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("sixFeet");
  const label = document.querySelector('label[for="sixFeet"]');

  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";
  label.insertAdjacentElement("afterend", arrow);
  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";

  const zones = [
    { color: "limegreen", name: "0 to 5 inches" },
    { color: "lightpink", name: "6 to 11 inches" },
    { color: "hotpink", name: "12 to 17 inches" },
    { color: "violet", name: "18 to 23 inches" },
    { color: "skyblue", name: "2 to 3 feet" },
    { color: "orange", name: "3 to 4 feet" },
    { color: "gold", name: "4 to 5 feet" },
    { color: "orangered", name: "5 to 6 feet" },
    { color: "crimson", name: "6 to 7 feet" },
    { color: "mediumvioletred", name: "7 to 8 feet" },
    { color: "darkmagenta", name: "8 to 9 feet" },
    { color: "darkslateblue", name: "9 to 10 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "saddlebrown", name: ">11  feet" },
  ];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(sixFeet);
    } else {
      map.removeLayer(sixFeet);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("sevenFeet");
  const label = document.querySelector('label[for="sevenFeet"]');

  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";

  label.insertAdjacentElement("afterend", arrow);

  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";

  const zones = [
    { color: "limegreen", name: "0 to 5 inches" },
    { color: "lightpink", name: "6 to 11 inches" },
    { color: "hotpink", name: "12 to 17 inches" },
    { color: "violet", name: "18 to 23 inches" },
    { color: "skyblue", name: "2 to 3 feet" },
    { color: "orange", name: "3 to 4 feet" },
    { color: "gold", name: "4 to 5 feet" },
    { color: "orangered", name: "5 to 6 feet" },
    { color: "crimson", name: "6 to 7 feet" },
    { color: "mediumvioletred", name: "7 to 8 feet" },
    { color: "darkmagenta", name: "8 to 9 feet" },
    { color: "darkslateblue", name: "9 to 10 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "teal", name: "10 to 11 feet" },
    { color: "saddlebrown", name: ">11  feet" },
  ];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(sevenFeet);
    } else {
      map.removeLayer(sevenFeet);
    }
  });
});

document.addEventListener("change", function (e) {
  if (e.target.id === "evacRoutes") {
    if (e.target.checked) {
      map.addLayer(evacRoutes);
    } else {
      map.removeLayer(evacRoutes);
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "countyLines") {
    if (e.target.checked) {
      map.addLayer(countyLines);
    } else {
      map.removeLayer(countyLines);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("stormSurge");
  const label = document.querySelector('label[for="stormSurge"]');

  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";

  label.insertAdjacentElement("afterend", arrow);

  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";

  const zones = [
    { color: "#ee371f", name: "Zone 1" },
    { color: "#c3d444", name: "Zone 2" },
    { color: "#cb52bf", name: "Zone 3" },
    { color: "#28e23e", name: "Zone 4" },
    { color: "#7e73e5", name: "Zone 5" },
  ];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(stormSurge);
    } else {
      map.removeLayer(stormSurge);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("hundredyearFloodplain");
  const label = document.querySelector('label[for="100yearFloodplain"]');

  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";

  label.insertAdjacentElement("afterend", arrow);

  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";

  const zones = [{ color: "#5bd75b", name: "In 100-Year Floodplain" }];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(hundredyearFloodplain);
    } else {
      map.removeLayer(hundredyearFloodplain);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("fivehundredyearFloodplain");
  const label = document.querySelector('label[for="500yearFloodplain"]');
  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  arrow.textContent = "►";
  arrow.style.cursor = "pointer";
  arrow.style.marginLeft = "8px";
  arrow.style.userSelect = "none";
  label.insertAdjacentElement("afterend", arrow);
  const legendEl = document.createElement("div");
  legendEl.classList.add("flood-legend", "hidden");
  legendEl.style.marginTop = "4px";
  legendEl.style.marginLeft = "22px";
  const zones = [{ color: "#993399", name: "In 500-Year Floodplain" }];

  zones.forEach((zone) => {
    const item = document.createElement("div");
    const colorBox = document.createElement("i");
    colorBox.style.background = zone.color;
    colorBox.style.display = "inline-block";
    colorBox.style.width = "12px";
    colorBox.style.height = "12px";
    colorBox.style.marginRight = "4px";
    item.appendChild(colorBox);
    item.append(zone.name);
    legendEl.appendChild(item);
  });

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = legendEl.classList.contains("show");

    if (isVisible) {
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      arrow.textContent = "►";
      legendEl.remove();
    } else {
      arrow.insertAdjacentElement("afterend", legendEl);
      legendEl.classList.remove("hidden");
      legendEl.classList.add("show");
      arrow.textContent = "▼";
    }
  });

  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    if (checkbox.checked) {
      map.addLayer(fivehundredyearFloodplain);
    } else {
      map.removeLayer(fivehundredyearFloodplain);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const infoButtons = document.querySelectorAll(".info-btn");

  // text for each layer
  const layerInfo = {
    oneFoot:
      "The 1 foot flood inundation depth map is used to show a projected 1 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 1 foot storm surge can happen whenever a strong storm makes landfall in the state.",
    twoFeet:
      "The 2 feet flood inundation depth map is used to show a projected 2 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 2 feet storm surge can happen whenever a strong storm makes landfall and can occur yearly all year round.",
    threeFeet:
      "The 3 feet flood inundation depth map is used to show a projected 3 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 3 feet storm surge can happen whenever a strong storm makes landfall and can occur yearly all year round.",
    fourFeet:
      "The 4 feet flood inundation depth map is used to show a projected 4 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 4 feet storm surge is less likely to occur and occur during tropical storm and categories 1 and 2 hurricanes.",
    fiveFeet:
      "The 5 feet flood inundation depth map is used to show a projected 5 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 5 feet storm surge is less likely to occur and can occur during stronger tropical storms and category 1 and 2 hurricanes.",
    sixFeet:
      "The 6 feet flood inundation (also known as flooding) depth map is used to show a projected 6 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 6 feet storm surge is less likely to occur and occur during tropical storm and categories 1 and 2 hurricanes",
    sevenFeet:
      "The 7 feet flood inundation depth map is used to show a projected 7 foot rise in sea level be it natural rise, global warming, from storm surge, or major weather events. And the depths represent how deep the water reaches in terms of feet in a given area. Dealing with a rise of water level by a foot can occur fairly common in Florida. 7 feet storm surge is less likely to occur and occur in categories 3 and above hurricanes. These major hurricanes can occur in about three to five years in the state.",
    hazard:
      "The Hazard Map shows FEMA flood zones that describe different levels and types of flood risk and which areas require insurance. Zones A and AE represent high-risk areas that face with AE having detailed elevation data and A lacking it. Zones AH and AO also have high flood risk but involve shallow flooding—AH is for flood risk about 1–3 feet deep, while AO is for shallow sheet flow moving downhill. Zone VE is a coastal high-risk area where storm surge and waves over 6 feet can cause severe damage. Zone D means the flood risk is unknown because FEMA has not completed a study there. Finally, Zone X indicates lower risk for flooding. Flood insurance is required in Zones A, AE, AH, AO, and VE if a property has a federally backed or insured mortgage, but not in Zones D or X.",
    stormSurge:
      "The Storm Surge map identifies areas that could be inundated by storm-driven coastal flooding during hurricanes or tropical storms.",
    hundredyearFloodplain:
      "The 100 year Floodplain is a map that displays the the area of land covered in water for a 100 year storm meaning a storm that has a 1 percent chance of occurring every year so a a storm that could happen 1 in 100 years though is is not entirely accurate saying this a major storm that occur every year but has a very low chance of occurring. It is mainly used for long term planning and risk assessment or areas across the state.",
    fivehundredyearFloodplain:
      "The 500 year Floodplain is a map that displays the the area of land covered in water for a 500 year storm meaning a storm that has a 0.2 percent chance of occurring every year so a a storm that could happen 1 in 500 years though is is not entirely accurate saying this a major storm that can occur every year but has a very low chance of occurring.",
    evacRoutes:
      "The Evacuation Routes layer shows major routes used for safe evacuation during flood emergencies.",
    countyLines:
      "The County Lines layer outlines county boundaries across Florida for geographic context.",
  };

  infoButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const layerId = btn.getAttribute("data-layer");
      const infoText =
        layerInfo[layerId] || "No information available for this layer.";

      document.getElementById("infoText").innerHTML = `<p>${infoText}</p>`;
   
    });
  });
});

// Tutorial popup
const tutorialPopup = document.getElementById("tutorialPopup");
const closeTutorialBtn = document.getElementById("closeTutorial");

// Close tutorial
const modal = document.getElementById("myModal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.querySelector(".close-button");

openBtn.onclick = function () {
  modal.style.display = "block";
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
