import { Box, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useCanvasStore } from "../../../lib/Store";
import { RouteNames } from "../../../route-names";

export function ProjectDependingView({
  title,
  children,
  rightHeader,
  searchBar,
  isLoadingContent,
}: {
  title: string,
  children: ReactNode,
  rightHeader?: ReactNode,
  searchBar?: ReactNode,
  isLoadingContent?: boolean,
}) {
  const navigate = useNavigate();
  const { selectedProject } = useCanvasStore();

  return (
    <Stack style={{ height: "100%" }}>
      <Stack align="left" gap={0}>
        <Group>
          <Group gap="xs" c="dimmed">
            <Text
              onClick={() => navigate(RouteNames.PROJECTS_VIEW)}
              style={{
                ":hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              Projects
            </Text>
            <Text>/</Text>
            <Text>{selectedProject?.name}</Text>
          </Group>
          <Box ml="auto">
            {rightHeader}
          </Box>
        </Group>
        <Group mb="sm" gap="0">
          <Title mr="sm">{title}</Title>
          {isLoadingContent ? (
            <>
              <Loader size="sm" />
              <Text ml="sm">Fetching...</Text>
            </>
          ) : undefined}
        </Group>
        {searchBar}
      </Stack>

      {children}
    </Stack>
  );
}
