import { StreamRequest } from "types/api";

export const streamApi = (data: StreamRequest, signal: AbortSignal) => {
  return fetch(`/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: signal,
  });
};

export const askWithImageApi = (imageFile: File, signal: AbortSignal) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  return fetch("/api/ask/file", {
    method: "POST",
    body: formData,
    signal: signal,
  });
};
