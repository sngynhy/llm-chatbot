import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchChatTitles = async () => {
  const res = await api.get("/chat/titles");
  return res.data;
};

export const fetchChat = async (chatId: string) => {
  const res = await api.get(`/chat/${chatId}`);
  return res.data.data;
};

export const deleteChat = async (chatId: string) => {
  return await api.delete(`/chat/${chatId}`);
};
