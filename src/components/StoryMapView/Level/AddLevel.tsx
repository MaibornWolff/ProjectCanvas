import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { getRndInteger, LEVEL_PREFIX } from "../helpers/utils";
import { useStoryMapStore } from "../StoryMapStore";

export function AddLevel({ storyMapId }: { storyMapId: string }) {
  const addLevel = useStoryMapStore((state) => state.addLevel);
  const addSubActionGroups = useStoryMapStore(
    (state) => state.addSubActionGroups,
  );
  return (
    <Button
      leftSection={<IconPlus />}
      onClick={() => {
        const levelId = `${LEVEL_PREFIX}-${getRndInteger()}`;
        addLevel(storyMapId, { id: levelId, title: "New Level" });
        addSubActionGroups(storyMapId, levelId);
      }}
      variant="outline"
      color="dark"
      my="lg"
      fullWidth
      size="xl"
    >
      Add Level
    </Button>
  );
}
