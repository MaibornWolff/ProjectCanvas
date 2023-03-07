import { create } from "zustand"
import { persist } from "zustand/middleware"
import { remove } from "./helpers/utils"

import { StoryMap } from "./Types"

export interface StoryMapStore {
  storyMaps: StoryMap[]
  addStoryMap: (storyMap: StoryMap) => void
  deleteStoryMap: (storyMapId: string) => void
  deleteAllStoryMaps: () => void
}

export const useStoryMapStore = create<StoryMapStore>()(
  persist(
    (set, get) => ({
      storyMaps: [],
      addStoryMap: (storyMap: StoryMap) =>
        set({ storyMaps: [...get().storyMaps, storyMap] }),
      deleteStoryMap: (storyMapId: string) => {
        const newStoryMaps = remove(
          get().storyMaps,
          get().storyMaps.findIndex((storyMap) => storyMap.id === storyMapId)
        )
        set({ storyMaps: newStoryMaps })
      },
      deleteAllStoryMaps: () => set({ storyMaps: [] }),
    }),
    { name: "story-map-storage" }
  )
)
