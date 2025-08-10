import { create, StateCreator } from "zustand";
import { devtools, combine } from "zustand/middleware";

type StyleState = {
  openSidebar: boolean;
  setOpenSidebar: (value: boolean) => void;
};

export const useStyleStore = create(
  devtools<StyleState>(
    (set) => ({
      openSidebar: true,
      setOpenSidebar: (value: boolean) => set({ openSidebar: value }),
    }),
    {
      name: "style-store",
    }
  )
);
