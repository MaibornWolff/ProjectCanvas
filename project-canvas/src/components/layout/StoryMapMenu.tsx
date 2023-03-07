import { Anchor, Menu } from "@mantine/core"
import { IconChevronDown, IconMap } from "@tabler/icons"
import { useNavigate } from "react-router-dom"
import { useStoryMapStore } from "../StoryMapView/StoryMapStore"

export function StoryMapMenu() {
  const navigate = useNavigate()
  const storyMaps = useStoryMapStore((state) => state.storyMaps)
  return (
    <Menu trigger="hover">
      <Menu.Target>
        <Anchor
          component="button"
          type="button"
          onClick={() => navigate("/storymapview")}
          sx={{
            display: "flex",
          }}
        >
          Story Map
          <IconChevronDown />
        </Anchor>
      </Menu.Target>
      <Menu.Dropdown>
        {storyMaps?.slice(0, 3).map((storyMap) => (
          <Menu.Item
            icon={<IconMap size={14} />}
            key={`layout-header-story-map-${storyMap.id}`}
            onClick={() => navigate(`/storymapview/${storyMap.id}`)}
          >
            {storyMap.name}
          </Menu.Item>
        ))}

        <Menu.Divider />
        <Menu.Item onClick={() => navigate("/storymapview")}>
          View all Story Maps
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
