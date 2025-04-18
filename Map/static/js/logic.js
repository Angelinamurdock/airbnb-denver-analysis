// Create the base map tile layer
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  
  // Create layer groups for each listing type
  let allListings = L.layerGroup();
  let entireHome = L.layerGroup();
  let privateRoom = L.layerGroup();
  
  // Create marker cluster group
  let markerCluster = L.markerClusterGroup();
  
  // Initialize the map
  let myMap = L.map("map", {
    center: [39.75, -104.99],
    zoom: 13,
    layers: [street, markerCluster]
  });
  
  // Add base and overlay layers
  let baseMaps = { "Street Map": street };
  let overlayMaps = {
    "All Listings": allListings,
    "Entire home/apt": entireHome,
    "Private room": privateRoom,
    "Marker Clusters": markerCluster
};
  
  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);
  
  // Marker style configuration
  function styleInfo(listing) {
    return {
      radius: 8,
      fillColor: getColor(listing.listing_type),
      color: "#000",
      weight: 0.5,
      opacity: 1,
      fillOpacity: 0.8
    };
  }
  
  function getColor(type) {
    if (type === "Entire home/apt") return "green";
    if (type === "Private room") return "blue";
    return "red";
  }
  
  // Add each listing to the appropriate layer and marker cluster
  listingsData.forEach(listing => {
    let marker = L.circleMarker([listing.Latitude, listing.Longitude], styleInfo(listing))
      .bindPopup(`
        <h3>Neighborhood: ${listing.Neighborhood}</h3>
        <p>Listing Type: ${listing.listing_type}</p>
        <p>Price: $${listing.Price}</p>
      `);
  
    // Add marker to main cluster and specific layer
    marker.addTo(allListings);
    markerCluster.addLayer(marker);
  
    if (listing.listing_type === "Entire home/apt") {
      marker.addTo(entireHome);
    } else if (listing.listing_type === "Private room") {
      marker.addTo(privateRoom);
    }
  });
