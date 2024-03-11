import { Center, Loader, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCanvasStore } from "../../lib/Store";
import { ProjectsTable } from "./Table/ProjectsTable";

export function ProjectsView() {
  const { setProjects } = useCanvasStore();
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => window.provider.getProjects(),
  });

  useEffect(() => setProjects(projects ?? []), [projects]);

  if (!projects) {
    return (<Center style={{ width: "100%", height: "100%" }}><Loader /></Center>);
  }

  if (projects.length === 0) {
    return (<Center style={{ width: "100%", height: "100%" }}><Text>No Projects Found</Text></Center>);
  }

  return <ProjectsTable data={projects} />;
}
