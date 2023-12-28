import { Anchor, Menu } from "@mantine/core"
import {
  IconChevronDown,
  IconLayoutDashboard,
  IconMap,
  IconTrash,
} from "@tabler/icons"
import { useNavigate } from "react-router-dom"
import { useStoryMapStore } from "../StoryMapView/StoryMapStore"

export function StoryMapMenu() {
  const navigate = useNavigate()
  const storyMaps = useStoryMapStore((state) => state.storyMaps)
  const deleteAllStoryMaps = useStoryMapStore(
    (state) => state.deleteAllStoryMaps
  )
  return (
    <Menu trigger="hover">
      <Menu.Target>
        <Anchor
          component="button"
          type="button"
          onClick={() => navigate("/storymapview")}
          style={{
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
            leftSection={<IconMap size={14} />}
            key={`layout-header-story-map-${storyMap.id}`}
            onClick={() => navigate(`/storymapview/${storyMap.id}`)}
          >
            {storyMap.name}
          </Menu.Item>
        ))}

        {storyMaps?.length > 0 && <Menu.Divider />}
        <Menu.Item
          leftSection={<IconLayoutDashboard size={14} />}
          onClick={() => navigate("/storymapview")}
        >
          View All Story Maps
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={14} />}
          onClick={deleteAllStoryMaps}
        >
          Delete All Story Maps
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
