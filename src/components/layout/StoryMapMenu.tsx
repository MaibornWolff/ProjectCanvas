import { Anchor, Menu } from "@mantine/core";
import {
  IconChevronDown,
  IconLayoutDashboard,
  IconMap,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useStoryMapStore } from "../StoryMapView/StoryMapStore";
import { RouteNames } from "../../route-names";

export function StoryMapMenu() {
  const navigate = useNavigate();
  const storyMaps = useStoryMapStore((state) => state.storyMaps);
  const deleteAllStoryMaps = useStoryMapStore(
    (state) => state.deleteAllStoryMaps,
  );
  return (
    <Menu trigger="hover">
      <Menu.Target>
        <Anchor
          component="button"
          type="button"
          onClick={() => navigate(RouteNames.STORY_MAP_VIEW)}
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
            onClick={() => navigate(`${RouteNames.STORY_MAP_VIEW}/${storyMap.id}`)}
          >
            {storyMap.name}
          </Menu.Item>
        ))}

        {storyMaps?.length > 0 && <Menu.Divider />}
        <Menu.Item
          leftSection={<IconLayoutDashboard size={14} />}
          onClick={() => navigate(RouteNames.STORY_MAP_VIEW)}
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
  );
}
