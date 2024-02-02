import { Box, PaperProps } from "@mantine/core";
import { useMergedRef } from "@mantine/hooks";
import { forwardRef, ReactNode } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { BaseCard } from "./BaseCard";

export const DraggableBaseCard = forwardRef<
HTMLDivElement,
{
  id: string,
  index: number,
  children: ReactNode | ReactNode[],
} & PaperProps
>(({
  id, index, children, ...props
}, ref) => (
  <Draggable draggableId={id} index={index}>
    {(provided) => (
      <BaseCard
        ref={useMergedRef(ref, provided.innerRef)}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        {...props}
        p="0"
      >
        <Box
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          p="md"
        >
          {children}
        </Box>
      </BaseCard>
    )}
  </Draggable>
));
