import { Affix, Center, ThemeIcon, Group } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { StrictModeDroppable } from "../../common/StrictModeDroppable"

export function DeleteDropzone() {
  return (
    <Affix
      position={{ bottom: 20, left: "50%" }}
      sx={{
        width: "30vw",
        transform: "translate(-50%,0)",
      }}
    >
      <Center
        sx={{
          width: "100%",
          height: "100px",
          position: "relative",
          top: 0,
        }}
      >
        <StrictModeDroppable droppableId="delete">
          {(provided, snapshot) => (
            <Center
              sx={(theme) => ({
                width: "100%",
                height: "100%",
                borderRadius: theme.radius.md,
                ...(snapshot.isDraggingOver && {
                  ":hover": {
                    backgroundColor: theme.colors.red[1],
                  },
                }),
              })}
            >
              <ThemeIcon
                variant="light"
                color="red"
                size="xl"
                sx={{ position: "absolute", background: "transparent" }}
              >
                <IconTrash />
              </ThemeIcon>
              <Group
                sx={(theme) => ({
                  width: "100%",
                  height: "100%",
                  border: `2px dashed ${theme.colors.red[4]}`,
                  borderRadius: theme.radius.md,
                  position: "absolute",
                })}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {provided.placeholder}
              </Group>
            </Center>
          )}
        </StrictModeDroppable>
      </Center>
    </Affix>
  )
}
