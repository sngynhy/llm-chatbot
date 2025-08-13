import { create, StateCreator } from "zustand";
import { persist, devtools, combine } from "zustand/middleware";

type StyleState = {
  openSidebar: boolean;
  setOpenSidebar: (value: boolean) => void;
};

export const useLocalStore = create(
  devtools(
    persist<StyleState>(
      (set) => ({
        openSidebar: true,
        setOpenSidebar: (value: boolean) => set({ openSidebar: value }),
      }),
      {
        name: "local-store",
      }
    ),
    {
      name: "local-store",
    }
  )
);
