import { PaperProps, Text, TextInput } from "@mantine/core";
import { useHover, useToggle } from "@mantine/hooks";
import { useState } from "react";
import { SubAction } from "../Types";
import { DraggableBaseCard } from "./Base/DraggableBaseCard";
import { DeleteButton } from "../Components/DeleteButton";

export function SubActionCard({
  id,
  index,
  storyMapId,
  subAction,
  updateSubAction,
  deleteSubAction,
  ...props
}: {
  id: string,
  index: number,
  storyMapId: string,
  subAction: SubAction,
  updateSubAction: (storyMapId: string, { id, title }: SubAction) => void,
  deleteSubAction: (storyMapId: string, subActionId: string) => void,
} & PaperProps) {
  const [edit, toggleEdit] = useToggle();
  const [title, setTitle] = useState(subAction.title);
  const { hovered, ref } = useHover();

  return (
    <DraggableBaseCard
      id={id}
      index={index}
      m="sm"
      bg="white"
      ref={ref}
      {...props}
    >
      {edit && title !== "" ? (
        <Text onClick={() => toggleEdit()}>{title}</Text>
      ) : (
        <TextInput
          onBlur={() => toggleEdit()}
          placeholder="Title"
          onChange={(event) => {
            setTitle(event.currentTarget.value);
            updateSubAction(storyMapId, {
              id,
              title: event.currentTarget.value,
            });
          }}
          variant="unstyled"
          value={title}
          autoFocus
          styles={{ input: { textAlign: "center", fontSize: "16px" } }}
        />
      )}
      <DeleteButton
        mounted={hovered}
        onClick={() => deleteSubAction(storyMapId, subAction.id)}
      />
    </DraggableBaseCard>
  );
}
