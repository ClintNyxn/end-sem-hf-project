import { useState, useCallback, useEffect } from 'react';

const CHAT_HISTORY_KEY = 'iss_chatbot_history';
const MAX_HISTORY = 30;

export function useAIChat(dashboardData) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  }, []);

  const sendMessage = useCallback(async (content) => {
    const newUserMsg = { role: 'user', content };
    const updatedMessages = [...messages, newUserMsg].slice(-MAX_HISTORY);
    setMessages(updatedMessages);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedMessages));

    setIsTyping(true);

    try {
      const systemPrompt = `You are a helpful AI assistant for the ISS & News Dashboard.
RULE: You can ONLY answer questions based on the following dashboard data. If the answer is not in the data, politely say you don't know and are restricted to dashboard data only.
DO NOT use outside knowledge. DO NOT guess.

CURRENT DASHBOARD DATA:
- ISS Position: Lat ${dashboardData.iss?.lat}, Lng ${dashboardData.iss?.lng}
- ISS Nearest Place: ${dashboardData.iss?.nearestPlace}
- ISS Speed: ${dashboardData.iss?.speed} km/h
- People in Space: ${dashboardData.iss?.astronauts?.count} (${dashboardData.iss?.astronauts?.people.map(p => p.name).join(', ')})
- News Articles Count: ${dashboardData.news?.length}
- News Highlights: ${dashboardData.news?.slice(0, 5).map(n => n.title).join(' | ')}

Answer the user's question concisely based ONLY on this data.`;

      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AI_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              ...updatedMessages
            ],
            model: "meta-llama/Llama-3.2-1B-Instruct:novita",
          }),
        }
      );

      const result = await response.json();
      const aiContent = result.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
      
      const newAiMsg = { role: 'assistant', content: aiContent };
      const finalMessages = [...updatedMessages, newAiMsg].slice(-MAX_HISTORY);
      setMessages(finalMessages);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(finalMessages));
    } catch (err) {
      console.error("AI Error:", err);
      const errorMsg = { role: 'assistant', content: "Error connecting to AI service. Please check your token." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, dashboardData]);

  return { messages, isTyping, sendMessage, clearChat };
}
