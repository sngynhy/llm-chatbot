import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchChatTitles = async () => {
  const res = await api.get("/chats/titles");
  return res.data;
};

export const fetchChat = async (chatId: string) => {
  const res = await api.get(`/chats/${chatId}`);
  return res.data.data;
};

export const deleteChat = async (chatId: string) => {
  return await api.delete(`/chats/${chatId}`);
};
