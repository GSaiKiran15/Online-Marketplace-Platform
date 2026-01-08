import React, { useEffect, useState } from "react";
import "./Chats.css";
import api from "../api/axios";
import useUser from "../useUser";
import { useNavigate } from "react-router-dom";

// TODO: Replace with real API data
const fakeChats = [
  {
    id: 1,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "John Doe",
    product: "Apple MacBook Pro 16”",
    lastMessage: "Is this still available?",
    time: "2 min ago",
  },
  {
    id: 2,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Jane Smith",
    product: "Sony WH-1000XM5 Headphones",
    lastMessage: "Thanks for the quick reply!",
    time: "10 min ago",
  },
  {
    id: 3,
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    name: "Alex Turner",
    product: "IKEA Desk",
    lastMessage: "Can I pick up tomorrow?",
    time: "1 hr ago",
  },
];

export default function Chats() {
  const [chats, setChats] = useState([]);
  const { user, isLoading } = useUser();
  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function loadChats() {
      try {
        const { data } = await api.get("/api/findChat");
        if (!cancelled) setChats(data);
      } catch (err) {
        console.error("Failed to load chats", err);
      }
    }
    setChats(data)
    loadChats();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="chats-section">
      <h1 className="chats-title">Chats</h1>
      <div className="chats-list">
        {fakeChats.map((chat) => (
          <div className="chat-card" key={chat.id}>
            <img className="chat-avatar" src={chat.avatar} alt={chat.name} />
            <div className="chat-info">
              <div className="chat-header">
                <span className="chat-name">{chat.name}</span>
                <span className="chat-time">{chat.time}</span>
              </div>
              <div className="chat-product">{chat.product}</div>
              <div className="chat-last-message">{chat.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
