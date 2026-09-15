// Keep streets and labels legible; reserve saturated yellow for our pins and route.
export const brandMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#F5F3EA" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#38505C" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#FFFFFF" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#D4E5EA" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#E8EDDF" }] },
  { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#F1EFE5" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#E9EBDD" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#FFFFFF" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#F5DEA0" }] },
  { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];
