export async function fetchISS() {
  const res = await fetch(
    "https://api.wheretheiss.at/v1/satellites/25544"
  );
  return await res.json();
}

export async function fetchAstronauts() {
  const res = await fetch(
    "https://api.wheretheiss.at/v1/astronauts"
  );
  return await res.json();
}
