import { create } from "zustand"
import { persist } from "zustand/middleware"

import { StoryMap } from "./Types"

export interface StoryMapStore {
  storyMaps: StoryMap[]
  addStoryMap: (storyMap: StoryMap) => void
}

export const useStoryMapStore = create<StoryMapStore>()(
  persist(
    (set, get) => ({
      storyMaps: [
        {
          id: "0",
          name: "first story map",
        },
        {
          id: "1",
          name: "second story map",
        },
      ],
      addStoryMap: (storyMap: StoryMap) =>
        set({ storyMaps: [...get().storyMaps, storyMap] }),
    }),
    { name: "story-map-storage" }
  )
)
