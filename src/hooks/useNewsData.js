import { useState, useEffect, useCallback } from 'react';

const NEWS_CACHE_KEY = 'news_dashboard_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export function useNewsData() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async (categories = ['technology', 'science']) => {
    setLoading(true);
    try {
      // Check cache first
      const cached = localStorage.getItem(NEWS_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setNews(data);
          setLoading(false);
          return;
        }
      }

      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      if (!apiKey || apiKey === 'YOUR_NEWS_API_KEY') {
        // Fallback to mock data if no key provided
        throw new Error("Missing News API Key");
      }

      let allArticles = [];
      for (const cat of categories) {
        const res = await fetch(`https://newsapi.org/v2/top-headlines?category=${cat}&pageSize=5&apiKey=${apiKey}`);
        const data = await res.json();
        if (data.status === 'error') throw new Error(data.message);
        
        const articlesWithCat = data.articles.map(a => ({ ...a, category: cat }));
        allArticles = [...allArticles, ...articlesWithCat];
      }

      setNews(allArticles);
      localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({
        data: allArticles,
        timestamp: Date.now()
      }));
      setError(null);
    } catch (err) {
      console.error("News Fetch Error:", err);
      // Try to load from cache even if expired if fetch fails
      const cached = localStorage.getItem(NEWS_CACHE_KEY);
      if (cached) {
        setNews(JSON.parse(cached).data);
        setError("Using cached data. " + err.message);
      } else {
        setError(err.message);
        // Use Mock data as final fallback for demonstration
        setNews(getMockNews());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { news, loading, error, refresh: fetchNews };
}

function getMockNews() {
  return [
    {
      title: "ISS Astronauts Perform Space Walk for Upgrades",
      source: { name: "Space News" },
      author: "Jane Doe",
      publishedAt: new Date().toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
      description: "NASA astronauts successfully completed a 6-hour spacewalk to upgrade the ISS solar arrays.",
      url: "https://nasa.gov",
      category: "science"
    },
    {
      title: "New Mars Rover Findings Suggest Ancient Water",
      source: { name: "Science Daily" },
      author: "John Smith",
      publishedAt: new Date().toISOString(),
      urlToImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
      description: "Data from the Perseverance rover indicates that Jezero Crater was once home to a massive lake.",
      url: "https://sciencedaily.com",
      category: "science"
    },
    // Add more mock items if needed...
  ].concat(Array(8).fill(null).map((_, i) => ({
      title: `Space Tech Breakthrough #${i+1}`,
      source: { name: "TechCrunch" },
      author: "AI Reporter",
      publishedAt: new Date().toISOString(),
      urlToImage: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80`,
      description: "A revolutionary new propulsion system could cut travel time to Mars in half.",
      url: "https://techcrunch.com",
      category: i % 2 === 0 ? "technology" : "science"
  })));
}
