// Initialize the map and set view to Florida
var map = L.map("map").setView([28.48, -81.4], 6);



const getRiskMessageFlood = (palette_index) => {
  if (palette_index === 0) {
    return "No Risk";
  } else if (palette_index === 1 ) {
    return "0 to 5 inches";
  } else if (palette_index === 2 ) {
    return "6 to 11 inches";
  } else if (palette_index === 3 ) {
    return "12 to 17 inches";
  } else if (palette_index === 4 ) {
    return "18 to 23 inches";
  } else if (palette_index === 5 ) {
    return "2 to 3 feet";
  } else if (palette_index === 6 ) {
    return "3 to 4 feet";
  } else if (palette_index === 7 ) {
    return "4 to 5 feet";
  } else if (palette_index === 8 ) {
    return "5 to 6 feet";
  } else if (palette_index === 9 ) {
    return "6 to 7 feet";
  } else if (palette_index === 10 ) {
    return "7 to 8 feet";
  } else if (palette_index === 11 ) {
    return "8 to 9 feet";
  } else if (palette_index === 12 ) {
    return "9 to 10 feet";
  } else if (palette_index === 13 ) {
    return "10 to 11 feet";
  } else if (palette_index === 14 ) {
    return ">11 feet";
  }else{
    return "Error in data";
  }}
const getRiskMessageStormSurge = (palette_index) => {
  if (palette_index === 0) {
    return "No Risk";
  } else if (palette_index === 1 ) {
    return "Zone 1";
  } else if (palette_index === 2 ) {
    return "Zone 2";
  } else if (palette_index === 3 ) {
    return "Zone 3";
  } else if (palette_index === 4 ) {
    return "Zone 4";
  } else if (palette_index === 5 ) {
    return "Zone 5";
  }}
  const getRiskMessage500yearflood = (gray_index) => {
  const value = Number(gray_index);

  if (isNaN(value)) {
    return "Error in data";
  } else if (value === 0) {
    return "No Risk";
  } else if (value === 5) {
    return "In 500 Year Floodplain";
  } else {
    return "Error in data";
  }}
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
L.tileLayer("https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Add geocoder control to the map
const geocoderControl = L.Control.geocoder({
  defaultMarkGeocode: false, // don't auto-add a marker
  placeholder: "Search for location...",
  errorMessage: "Location not found.",
  showResultIcons: true,
}).addTo(map);

// Handle geocoder results
geocoderControl.on("markgeocode", async function(e) {
  const latlng = e.geocode.center;

  // Optional: center map on the searched location
  map.setView(latlng, 12);

  // Use the same function as map click to get info from all layers
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
    contentHazard
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

  mapInfo.innerHTML = `
    <h3>Clicked location: ${latlng.toString()}</h3>
    <p>1Ft Flood Risk: ${content1ft ? getRiskMessageFlood(content1ft.PALETTE_INDEX) : "No risk"}</p>
    <p>2Ft Flood Risk: ${content2ft ? getRiskMessageFlood(content2ft.PALETTE_INDEX) : "No risk"}</p>
    <p>3Ft Flood Risk: ${content3ft ? getRiskMessageFlood(content3ft.PALETTE_INDEX) : "No risk"}</p>
    <p>4Ft Flood Risk: ${content4ft ? getRiskMessageFlood(content4ft.PALETTE_INDEX) : "No risk"}</p>
    <p>5Ft Flood Risk: ${content5ft ? getRiskMessageFlood(content5ft.PALETTE_INDEX) : "No risk"}</p>
    <p>6Ft Flood Risk: ${content6ft ? getRiskMessageFlood(content6ft.PALETTE_INDEX) : "No risk"}</p>
    <p>7Ft Flood Risk: ${content7ft ? getRiskMessageFlood(content7ft.PALETTE_INDEX) : "No risk"}</p>
    <p>Storm Surge Risk: ${contentstormsurge ? getRiskMessageStormSurge(contentstormsurge.PALETTE_INDEX) : "No risk"}</p>
    <p>100 Year Floodplain Risk: ${content100yearflood ? getRiskMessage100yearflood(content100yearflood.GRAY_INDEX) : "No risk"}</p>
    <p>500 Year Floodplain Risk: ${content500yearflood ? getRiskMessage500yearflood(content500yearflood.GRAY_INDEX) : "No risk"}</p>
    <p>Hazard Risk: ${contentHazard.FLD_ZONE}</p>
  `;

  // Opens Sideber at the searched location
  sidebar.classList.add("open");
});

// Popup on map click
// var popup = L.popup();
// map.on("click", function (e) {
//   popup
//     .setLatLng(e.latlng)
//     .setContent("You clicked the map at " + e.latlng.toString())
//     .openOn(map);
// });

const getFeatureInfo = async (latlng, layerName) => {
  const buffer = 0.01;
  

    const bbox = [
        latlng.lng - buffer, // minX
        latlng.lat - buffer, // minY
        latlng.lng + buffer, // maxX
        latlng.lat + buffer, // maxY
    ];

    const bboxString = bbox.join(",");
    const rootUrl = "http://localhost:8080/geoserver/wms?service=WMS&version=1.1.1&request=GetFeatureInfo";
    const suffix = "&SRS=EPSG:4326&X=128&Y=128&WIDTH=256&HEIGHT=256&INFO_FORMAT=application/json";
    const url = `${rootUrl}&layers=${layerName}&query_layers=${layerName}&BBOX=${bboxString}${suffix}`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    const features = data.features.map((feature) => feature.properties);
    if (features.length === 0) {
      return null;
    }else{
      const content = features[0];
      content.layerName = layerName;
      console.log(content);
      return content;
    }
    
}
var popup = L.popup();

map.on("click", async function (e) {
  const latlng = e.latlng;
  
    // const buffer = 0.01;
    // const clickLatLng = e.latlng;

    // const bbox = [
    //     clickLatLng.lng - buffer, // minX
    //     clickLatLng.lat - buffer, // minY
    //     clickLatLng.lng + buffer, // maxX
    //     clickLatLng.lat + buffer, // maxY
    // ];
    // const bboxString = bbox.join(",");
    // const rootUrl = "http://localhost:8080/geoserver/wms?service=WMS&version=1.1.1&request=GetFeatureInfo";
    // const suffix = "&SRS=EPSG:4326&X=128&Y=128&WIDTH=256&HEIGHT=256&INFO_FORMAT=application/json";
    // const query_layers = "ne:NOAA_SLR_7_0FT_RECLASS_AUG25,ne:ss_zones_aug21";
    // const url = `${rootUrl}&layers=${query_layers}&query_layers=${query_layers}&BBOX=${bboxString}${suffix}`;
    // console.log(url);
    // const response = await fetch(url);
    // const data = await response.json();
    // console.log(data);
    // const content = data.features.map((feature) => feature.properties);
    // console.log(content);
    // const content1ft = getFeatureInfo(e.latlng, "ne:NOAA_SLR_1_0FT_RECLASS_AUG25");
    // const content2ft = getFeatureInfo(e.latlng, "ne:NOAA_SLR_2_0FT_RECLASS_AUG25");
    // const content3ft = getFeatureInfo(e.latlng, "ne:NOAA_SLR_3_0FT_RECLASS_AUG25");
    // const content4ft = getFeatureInfo(e.latlng, "ne:NOAA_SLR_4_0FT_RECLASS_AUG25");
    // const content5ft = getFeatureInfo(e.latlng, "ne:NOAA_SLR_5_0FT_RECLASS_AUG25");
    // const content6ft = getFeatureInfo(e.latlng, "ne:NOAA_SLR_6_0FT_RECLASS_AUG25");
    // const content7ft = getFeatureInfo(e.latlng, "ne:NOAA_SLR_7_0FT_RECLASS_AUG25");
    // const contentstormsurge = getFeatureInfo(e.latlng, "ne:ss_zones_aug21");
    // Fetch all flood and storm surge layers at clicked location
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
    contentHazard
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

  // Populate sidebar with the results
  mapInfo.innerHTML = `
    <h3>Clicked location: ${latlng.toString()}</h3>
    <p>1Ft Flood Risk: ${content1ft ? getRiskMessageFlood(content1ft.PALETTE_INDEX) : "No risk"}</p>
    <p>2Ft Flood Risk: ${content2ft ? getRiskMessageFlood(content2ft.PALETTE_INDEX) : "No risk"}</p>
    <p>3Ft Flood Risk: ${content3ft ? getRiskMessageFlood(content3ft.PALETTE_INDEX) : "No risk"}</p>
    <p>4Ft Flood Risk: ${content4ft ? getRiskMessageFlood(content4ft.PALETTE_INDEX) : "No risk"}</p>
    <p>5Ft Flood Risk: ${content5ft ? getRiskMessageFlood(content5ft.PALETTE_INDEX) : "No risk"}</p>
    <p>6Ft Flood Risk: ${content6ft ? getRiskMessageFlood(content6ft.PALETTE_INDEX) : "No risk"}</p>
    <p>7Ft Flood Risk: ${content7ft ? getRiskMessageFlood(content7ft.PALETTE_INDEX) : "No risk"}</p>
    <p>Storm Surge Risk: ${contentstormsurge ? getRiskMessageStormSurge(contentstormsurge.PALETTE_INDEX) : "No risk"}</p>
    <p>100 Year Floodplain Risk: ${content100yearflood ? getRiskMessage100yearflood(content100yearflood.GRAY_INDEX) : "No risk"}</p>
    <p>500 Year Floodplain Risk: ${content500yearflood ? getRiskMessage500yearflood(content500yearflood.GRAY_INDEX) : "No risk"}</p>
    <p>Hazard Risk: ${contentHazard.FLD_ZONE}</p>
    `;

  // Automatically open the sidebar
  sidebar.classList.add("open");
});

// Flood layers
const floodLayers = {

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
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_1_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 1ft",
    minZoom: 1,
    maxZoom: 20,
  });

const twoFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_2_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 2ft",
    minZoom: 1,
    maxZoom: 20,
  });

const threeFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_3_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 3ft",
    minZoom: 1,
    maxZoom: 20,
  });

const fourFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_4_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 4ft",
    minZoom: 1,
    maxZoom: 20,
  });
const fiveFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_5_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 5ft",
    minZoom: 1,
    maxZoom: 20,
  });

  const sixFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_6_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 6ft",
    minZoom: 1,
    maxZoom: 20,
  });

  const sevenFeet = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:NOAA_SLR_7_0FT_RECLASS_AUG25/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Flood 7ft",
    minZoom: 1,
    maxZoom: 20,
  });
  const hazard = L.tileLayer(
  "http://localhost:8080/geoserver/gwc/service/wmts/rest/ne:dfirm_fldhaz_dec24/EPSG:900913/EPSG:900913:{z}/{y}/{x}?format=image/png", {
    attribution: "Hazard",
    minZoom: 1,
    maxZoom: 20,
  });

// Initial setup


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
        <input type="checkbox" id="oneFoot" /> <label for="oneFoot">1 Foot Flood</label><br>
        <input type="checkbox" id="twoFeet" /> <label for="twoFeet">2 Feet Flood</label><br>
        <input type="checkbox" id="threeFeet" /> <label for="threeFeet">3 Feet Flood</label><br>
        <input type="checkbox" id="fourFeet" /> <label for="fourFeet">4 Feet Flood</label><br>
        <input type="checkbox" id="fiveFeet" /> <label for="fiveFeet">5 Feet Flood</label><br>
        <input type="checkbox" id="sixFeet" /> <label for="sixFeet">6 Feet Flood</label><br>
        <input type="checkbox" id="sevenFeet" /> <label for="sevenFeet">7 Feet Flood</label><br>
        <input type="checkbox" id="hazard" /> <label for="hazard">Hazard Zone</label><br>
        <input type="checkbox" id="evacRoutes" /> <label for="evacRoutes">Evacuation Routes</label><br>
        <input type="checkbox" id="vulnerabilityIndex" /> <label for="vulnerabilityIndex">Vulnerability Index</label><br>
        <input type="checkbox" id="stormSurge" legend="stromlegend" /> <label for="stormSurge">Storm Surge</label>
        <div class="flood-legend hidden" id="stromlegend">
        <i style="background:#ee371f"></i> Zone 1<br>
        <i style="background:#c3d444"></i> Zone 2<br>
        <i style="background:#cb52bf"></i> Zone 3<br>
        <i style="background:#28e23e"></i> Zone 4<br>
        <i style="background:#7e73e5"></i> Zone 5<br>
        </div><br>
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
  if (e.target.id === "hazard") {
    if (e.target.checked) {
      map.addLayer(hazard);
    } else {
      map.removeLayer(hazard);
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "oneFoot") {
    if (e.target.checked) {
      map.addLayer(oneFoot);
    } else {
      map.removeLayer(oneFoot);
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "twoFeet") {
    if (e.target.checked) {
      map.addLayer(twoFeet);
    } else {
      map.removeLayer(twoFeet);
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "threeFeet") {
    if (e.target.checked) {
      map.addLayer(threeFeet);
    } else {
      map.removeLayer(threeFeet);
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "fourFeet") {
    if (e.target.checked) {
      map.addLayer(fourFeet);
    } else {
      map.removeLayer(fourFeet);
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "fiveFeet") {
    if (e.target.checked) {
      map.addLayer(fiveFeet);
    } else {
      map.removeLayer(fiveFeet);
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "sixFeet") {
    if (e.target.checked) {
      map.addLayer(sixFeet);
    } else {
      map.removeLayer(sixFeet);
    }
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "sevenFeet") {
    if (e.target.checked) {
      map.addLayer(sevenFeet);
    } else {
      map.removeLayer(sevenFeet);
    }
  }
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
  if (e.target.id === "stormSurge") {
    const checkbox = e.target;
    const legendId = checkbox.getAttribute("legend");
    const legendEl = document.getElementById(legendId);
    const label = document.querySelector('label[for="stormSurge"]');
    let arrow = label.querySelector(".arrow");

    // Create the arrow only once
    if (!arrow) {
      arrow = document.createElement("span");
      arrow.classList.add("arrow");
      arrow.textContent = "►";
      label.appendChild(arrow);
    }

    if (checkbox.checked) {
      // Add layer to map
      map.addLayer(stormSurge);

      // Show arrow when checked
      arrow.style.display = "inline-block";

      // Add click event for dropdown toggle
      arrow.onclick = function () {
        const isVisible = legendEl.classList.contains("show");

        if (isVisible) {
          legendEl.classList.remove("show");
          label.classList.remove("open");
          setTimeout(() => legendEl.classList.add("hidden"), 300);
        } else {
          legendEl.classList.remove("hidden");
          legendEl.classList.add("show");
          label.classList.add("open");
        }
      };
    } else {
      // Remove layer from map
      map.removeLayer(stormSurge);

      // Hide legend and arrow when unchecked
      legendEl.classList.remove("show");
      legendEl.classList.add("hidden");
      label.classList.remove("open");
      arrow.style.display = "none";
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

// document.addEventListener("change", function (e) {
//   if (e.target.id === "fivehundredyearFloodplain") {
//     const legendid = e.target.getAttribute("legend");
//     const legendelement = document.getElementById(legendid);
    
//     // Reference to your info slide-out element
//     const infoPanel = document.getElementById("500yearFloodplain"); 
//     // Create or select a container for the floodplain description
//     let floodplainDescription = document.getElementById("floodplain-description");

//     if (e.target.checked) {
//       map.addLayer(fivehundredyearFloodplain);
//       legendelement.classList.remove("hidden");

//       // If no description element exists yet, create it
//       if (!floodplainDescription) {
//         floodplainDescription = document.createElement("p");
//         floodplainDescription.id = "floodplain-description";
//         floodplainDescription.textContent =
//           "The 500 year Floodplain is a map that displays the area of land covered in water for a 500 year storm — meaning a storm that has a 0.2 percent chance of occurring every year. So it’s often called a ‘1 in 500 year’ storm, though that’s not entirely accurate — it describes a major storm that could happen any year but has a very low probability of occurring.";
//         infoPanel.appendChild(floodplainDescription);
//       }

//     } else {
//       map.removeLayer(fivehundredyearFloodplain);
//       legendelement.classList.add("hidden");

//       // Remove the description when unchecked
//       if (floodplainDescription) {
//         floodplainDescription.remove();
//       }
//     }
//   }
// });

// Sidebar toggle logic
const sidebar = document.getElementById("mapInfo");
const toggleBtn = document.getElementById("sidebarToggle");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// Tutorial popup logic
const tutorialPopup = document.getElementById("tutorialPopup");
const closeTutorialBtn = document.getElementById("closeTutorial");

// Show tutorial on page load
// window.addEventListener("load", () => {
//   tutorialPopup.classList.remove("hidden");
// });

// Close tutorial on button click
const modal = document.getElementById("myModal");
    const openBtn = document.getElementById("openModalBtn");
    const closeBtn = document.querySelector(".close-button");

    openBtn.onclick = function() {
        modal.style.display = "block";
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal if the user clicks outside of the modal content
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }



