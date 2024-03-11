import { Box, Button } from "@mantine/core";
import { useState } from "react";
import { useColorScheme } from "@canvas/common/color-scheme";
import { CreateSprintModal } from "./CreateSprintModal";

export function CreateSprint() {
  const colorScheme = useColorScheme();
  const [createSprintModalOpened, setCreateSprintModalOpened] = useState(false);

  return (
    <Box>
      <Button
        mt="sm"
        mb="xl"
        variant="subtle"
        color="gray"
        radius="sm"
        display="flex"
        fullWidth
        onClick={() => setCreateSprintModalOpened(true)}
        style={(theme) => ({
          justifyContent: "left",
          ":hover": {
            background:
              colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[4],
          },
        })}
      >
        + Create Sprint
      </Button>
      <CreateSprintModal
        opened={createSprintModalOpened}
        setOpened={setCreateSprintModalOpened}
      />
    </Box>
  );
}
