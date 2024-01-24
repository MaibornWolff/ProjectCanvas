import { Accordion, AccordionControlProps, ActionIcon, Center, TextInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useStoryMapStore } from "../StoryMapStore";
import { SubActionLevel } from "../Types";

export function LevelControl({
  level,
  storyMapId,
  ...props
}: {
  level: SubActionLevel;
  storyMapId: string;
} & AccordionControlProps) {
  const [edit, toggleEdit] = useState(true);
  const updateLevel = useStoryMapStore((state) => state.updateLevel);
  const deleteLevel = useStoryMapStore((state) => state.deleteLevel);
  return (
    <Center>
      <Accordion.Control {...props}>
        <TextInput
          placeholder="Title"
          {...(edit ? { readOnly: false } : { readOnly: true })}
          onBlur={(event) => {
            updateLevel(storyMapId, {
              id: level.id,
              title: event.currentTarget.value,
            });
            toggleEdit(false);
          }}
          onClick={(event) => {
            event.stopPropagation();
            toggleEdit(true);
          }}
          variant="unstyled"
          styles={{ input: { padding: 0 } }}
          defaultValue={level.title}
          autoFocus
          size="lg"
        />
      </Accordion.Control>
      <ActionIcon
        color="red"
        size="sm"
        onClick={() => {
          deleteLevel(storyMapId, level.id);
        }}
      >
        <IconTrash />
      </ActionIcon>
    </Center>
  );
}
