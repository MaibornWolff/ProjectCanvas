import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { Group } from "@mantine/core"
import { ReactNode } from "react"

interface RowPropsRequired {}

interface RowPropsOptional {
  children?: ReactNode
}

export interface RowProps extends RowPropsRequired, RowPropsOptional {}

export function Row({ children }: RowProps): ReactJSXElement {
  return (
    <Group spacing="xs" position="left" align="center">
      {children}
    </Group>
  )
}

const defaultProps: RowPropsOptional = {
  children: undefined,
}

Row.defaultProps = defaultProps
