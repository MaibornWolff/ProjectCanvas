import { Textarea, Text } from "@mantine/core";
import { useState } from "react";

export function Description({
  description,
  onChange,
}: {
  description: string,
  onChange: (newDescription: string) => void,
}) {
  const [currentDescription, setCurrentDescription] = useState(description);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);

  return (
    <span>
      {showDescriptionInput ? (
        <Textarea
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
          onBlur={() => {
            setShowDescriptionInput(false);
            onChange(currentDescription);
          }}
          autosize
          minRows={4}
          mb="xl"
        />
      ) : (
        <Text onClick={() => setShowDescriptionInput(true)} mb="xl">
          {currentDescription || "Add Description"}
        </Text>
      )}
    </span>
  );
}
