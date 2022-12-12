import { Navbar } from "@mantine/core"

export function LayoutNavbar() {
  return (
    <Navbar width={{ base: 300 }} height={500} p="xs">
      <Navbar.Section mt="xs">Projects View</Navbar.Section>
      <Navbar.Section grow mt="md">
        Backlog View
      </Navbar.Section>
    </Navbar>
  )
}
