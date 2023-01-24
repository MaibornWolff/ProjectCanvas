/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Text, Badge, Button, Group, Collapse } from "@mantine/core"
import {
  IssueBean,
  IssueTypeDetails,
} from "project-extender/src/providers/jira-cloud-provider/types"
import { useState } from "react"

export function CardView(issue: IssueBean) {
  const [opened, setOpened] = useState(false)
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <Button onClick={() => setOpened((o) => !o)} fullWidth>
          Details
        </Button>
      </Card.Section>

      <Collapse in={opened}>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Please fill me with data</Text>
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        </Group>
        <Text size="sm" color="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes
          with tours and activities on and around the fjords of Norway
        </Text>
        <Button variant="light" color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button>
      </Collapse>
    </Card>
  )
}
