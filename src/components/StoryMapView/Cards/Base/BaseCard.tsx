import { Paper, PaperProps } from "@mantine/core";
import { forwardRef, MouseEventHandler, ReactNode } from "react";

export const BaseCard = forwardRef<
HTMLDivElement,
{
  children?: ReactNode,
  onClick?: MouseEventHandler<HTMLDivElement>,
} & PaperProps
>(({ onClick, children, ...props }, ref) => (
  <Paper
    radius="sm"
    shadow="sm"
    p="md"
    m="sm"
    ref={ref}
    onClick={onClick}
    {...props}
    style={[
      {
        height: "5.5em",
        aspectRatio: "16/8",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
      },
      props.style,
    ]}
  >
    {children}
  </Paper>
));
