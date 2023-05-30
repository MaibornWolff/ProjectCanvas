/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Group, Loader, TextInput } from "@mantine/core"
import { useState } from "react"
import { CreateSprintModal } from "./CreateSprintModal"

export function CreateSprint() {
  const [createSprintModalOpened, setCreateSprintModalOpened] = useState(false)

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
        sx={(theme) => ({
          justifyContent: "left",
          ":hover": {
            background:
              theme.colorScheme === "dark"
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
  )
}
