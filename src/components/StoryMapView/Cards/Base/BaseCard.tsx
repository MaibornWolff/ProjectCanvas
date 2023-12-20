import { Paper, PaperProps } from "@mantine/core"
import { forwardRef, MouseEventHandler, ReactNode } from "react"

export const BaseCard = forwardRef<
  HTMLDivElement,
  {
    children?: ReactNode
    onClick?: MouseEventHandler<HTMLDivElement>
  } & PaperProps
>(({ onClick, children, ...props }, ref) => (
  <Paper
    style={{
      height: "5.5em",
      aspectRatio: "16/8",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "black",
    }}
    radius="sm"
    shadow="sm"
    p="md"
    m="sm"
    ref={ref}
    onClick={onClick}
    {...props}
  >
    {children}
  </Paper>
))
