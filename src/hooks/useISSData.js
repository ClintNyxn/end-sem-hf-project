import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateSpeed, getNearestPlace } from '../utils/geo';

export function useISSData() {
  const [currentPos, setCurrentPos] = useState(null);
  const [history, setHistory] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [nearestPlace, setNearestPlace] = useState("Loading...");
  const [astronauts, setAstronauts] = useState({ count: 0, people: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const lastFetchTime = useRef(null);

  const fetchAstronauts = useCallback(async () => {
    try {
      // Using an HTTPS proxy to fetch open-notify data without Mixed Content errors
      const res = await fetch('https://api.allorigins.win/raw?url=http://api.open-notify.org/astros.json');
      const data = await res.json();
      setAstronauts({ count: data.number, people: data.people });
    } catch (err) {
      console.error("Failed to fetch astronauts:", err);
    }
  }, []);

  const fetchISSLocation = useCallback(async () => {
    try {
      // Using an HTTPS proxy to fetch open-notify data to fix Mixed Content and format issues
      const res = await fetch('https://api.allorigins.win/raw?url=http://api.open-notify.org/iss-now.json');
      const data = await res.json();
      
      const newPos = {
        lat: parseFloat(data.iss_position.latitude),
        lng: parseFloat(data.iss_position.longitude),
        timestamp: data.timestamp
      };

      setCurrentPos(prev => {
        if (prev) {
          const timeDiff = newPos.timestamp - prev.timestamp;
          if (timeDiff > 0) {
            const currentSpeed = calculateSpeed(prev, newPos, timeDiff);
            setSpeed(currentSpeed);
          }
        }
        return newPos;
      });

      // Fetch nearest place
      getNearestPlace(newPos.lat, newPos.lng).then(place => setNearestPlace(place));

      setHistory(prev => {
        const updated = [...prev, newPos];
        return updated.slice(-30); // Keep last 30 for the chart
      });

      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("ISS Fetch Error:", err);
      setError("Failed to track ISS. Check your connection.");
      // Don't set loading false immediately if we have a previous position to show
    }
  }, []);

  useEffect(() => {
    fetchAstronauts();
    fetchISSLocation();
    
    const interval = setInterval(fetchISSLocation, 15000);
    return () => clearInterval(interval);
  }, [fetchISSLocation, fetchAstronauts]);

  return { currentPos, history, speed, nearestPlace, astronauts, loading, error, refresh: fetchISSLocation };
}
