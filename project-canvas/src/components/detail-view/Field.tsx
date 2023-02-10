import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { MantineNumberSize, Stack } from "@mantine/core"
import { ReactNode } from "react"
import { SimpleText } from "./SimpleText"

interface FieldPropsRequired {
  title: string | undefined
  children: ReactNode
}

interface FieldPropsOptional {
  fz?: MantineNumberSize | undefined
  fw?: number | undefined
}

export interface FieldProps extends FieldPropsRequired, FieldPropsOptional {}

export function Field({
  title,
  children,
  fz,
  fw,
}: FieldProps): ReactJSXElement {
  return (
    <Stack justify="flex-start" spacing="xs">
      <SimpleText text={title} fw={fw} fz={fz} />
      {children}
    </Stack>
  )
}

const defaultProps: FieldPropsOptional = {
  fz: "sm",
  fw: 600,
}

Field.defaultProps = defaultProps
