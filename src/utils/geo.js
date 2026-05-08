export function calculateSpeed(pos1, pos2, timeDiffSeconds) {
  if (!pos1 || !pos2 || !timeDiffSeconds) return 0;
  
  const R = 6371; // Earth's radius in km 
  const toRad = (deg) => deg * (Math.PI / 180);
  const dLat = toRad(pos2.lat - pos1.lat);
  const dLon = toRad(pos2.lng - pos1.lng); 
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(pos1.lat)) * Math.cos(toRad(pos2.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // distance in km 
  const speedKmh = (distance / timeDiffSeconds) * 3600;
  
  return isNaN(speedKmh) ? 0 : Math.round(speedKmh);
}

export async function getNearestPlace(lat, lng) {
  try {
    // Try BigDataCloud first - excellent for water bodies/oceans
    const bdcRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    const bdcData = await bdcRes.json();
    
    if (bdcData.locality || bdcData.city || bdcData.principalSubdivision) {
      const parts = [bdcData.locality, bdcData.city, bdcData.principalSubdivision, bdcData.countryName].filter(Boolean);
      return parts.join(', ');
    }

    // Fallback to Nominatim if BDC doesn't give a clear city/locality
    const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=5&addressdetails=1`);
    const nomData = await nomRes.json();
    
    if (nomData.display_name) return nomData.display_name;
    
    // If both fail, use a manual ocean lookup logic or just return the ocean name from BDC if it has it
    // Actually BDC often returns "Indian Ocean" etc in countryName or principalSubdivision for water
    return bdcData.countryName || "Over the Ocean";
  } catch (err) {
    console.error("Geocoding error:", err);
    return "Over the Ocean";
  }
}
