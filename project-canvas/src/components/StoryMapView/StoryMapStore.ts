import { create } from "zustand"
import { persist } from "zustand/middleware"
import { removeWithId } from "./helpers/utils"

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
        set({ storyMaps: removeWithId(get().storyMaps || [], storyMapId) })
      },
      deleteAllStoryMaps: () => set({ storyMaps: [] }),
    }),
    { name: "story-map-storage" }
  )
)
