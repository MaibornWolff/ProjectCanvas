import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { Avatar, MantineNumberSize, NavLink } from "@mantine/core"
import { LinkText } from "./LinkText"
import { SimpleText } from "./SimpleText"

interface IssueLinkPropsRequired {
  td: boolean
  keyOrId: string | undefined
  onClick: (keyOrId: string | undefined) => void | undefined
}

interface IssueLinkPropsOptional {
  url?: string | null | undefined
  text?: string | undefined
  size?: MantineNumberSize | undefined
  radius?: MantineNumberSize | undefined
}

export interface IssueLinkProps
  extends IssueLinkPropsRequired,
    IssueLinkPropsOptional {}

export function IssueLink({
  td,
  keyOrId,
  text,
  onClick,
  url,
  size,
  radius,
}: IssueLinkProps): ReactJSXElement {
  return (
    <NavLink
      icon={<Avatar src={url} size={size} radius={radius} />}
      label={<LinkText td={td} text={keyOrId} grow />}
      onClick={() => onClick(keyOrId)}
      rightSection={text && <SimpleText text={text} />}
    />
  )
}

const defaultProps: IssueLinkPropsOptional = {
  url: undefined,
  size: 32,
  radius: "xs",
  text: undefined,
}

IssueLink.defaultProps = defaultProps
