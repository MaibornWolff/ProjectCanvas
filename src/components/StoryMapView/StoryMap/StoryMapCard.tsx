import { TextInput } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseCard } from "../Cards/Base/BaseCard";
import { DeleteButton } from "../Components/DeleteButton";
import { useStoryMapStore } from "../StoryMapStore";
import { StoryMap } from "../Types";

export function StoryMapCard({ name, id }: StoryMap) {
  const navigate = useNavigate();
  const deleteStoryMap = useStoryMapStore((state) => state.deleteStoryMap);
  const updateStoryMap = useStoryMapStore((state) => state.updateStoryMap);
  const { ref, hovered } = useHover();
  const [edit, setEdit] = useState(false);
  return (
    <BaseCard
      style={{
        height: "16em",
        aspectRatio: "9/10",
        position: "relative",
      }}
      ref={ref}
      onClick={() => navigate(id)}
    >
      <TextInput
        placeholder="Title"
        {...(edit ? { readOnly: false } : { readOnly: true })}
        onBlur={(event) => {
          updateStoryMap({ id, name: event.target.value });
          setEdit(false);
        }}
        onClick={(event) => {
          event.stopPropagation();
          setEdit(true);
        }}
        variant="unstyled"
        styles={{ input: { textAlign: "center", padding: 0 } }}
        defaultValue={name}
        autoFocus
        size="lg"
      />
      <DeleteButton
        onClick={(event) => {
          event.stopPropagation();
          deleteStoryMap(id);
        }}
        mounted={hovered}
      />
    </BaseCard>
  );
}
