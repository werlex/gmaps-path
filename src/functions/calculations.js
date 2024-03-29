

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const deg2rad = (deg) => deg * (Math.PI/180)
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

const calculateDistances = (markers) => {
  markers.forEach((marker, index) => {
    const distances = [];
    markers.forEach((markerTwo)=>{
      if(markerTwo.id !== marker.id){
        distances.push({
          id: markerTwo.id,
          distance: calculateDistance(marker.lat, marker.lng, markerTwo.lat, markerTwo.lng)
        });
      }
    });
    markers[index] = {...marker, distances};
  });
  return markers;
}

export { calculateDistances };