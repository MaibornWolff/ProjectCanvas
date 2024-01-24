import { Button, Group, Modal, ScrollArea, Stack, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { SprintCreate } from "types";
import { useCanvasStore } from "../../../lib/Store";
import { createSprint } from "../helpers/queryFetchers";
import { NameInput } from "./NameInput";
import { GoalInput } from "./GoalInput";
import { SprintEndDatePicker } from "./SprintEndDatePicker";
import { SprintStartDatePicker } from "./SprintStartDatePicker";
import { ColorSchemeToggle } from "../../common/ColorSchemeToggle";
import { useColorScheme } from "../../../common/color-scheme";

export function CreateSprintModal({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const theme = useMantineTheme();
  const colorScheme = useColorScheme();
  const selectedBoard = useCanvasStore(
    (state) => state.selectedProjectBoardIds[0],
  );

  const form = useForm<SprintCreate>({
    initialValues: {
      name: "",
      originBoardId: selectedBoard,
      startDate: undefined as unknown as Date,
      endDate: undefined as unknown as Date,
      goal: undefined as unknown as string,
    } as SprintCreate,
  });

  const mutation = useMutation({
    mutationFn: (sprint: SprintCreate) => createSprint(sprint),
    onError: () => {
      showNotification({
        message: "The sprint couldn't be created! 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      showNotification({
        message: "The sprint has been created!",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["sprints"] });
      queryClient.invalidateQueries({ queryKey: ["issues", "sprints"] });
      setOpened(false);
      form.reset();
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Create Sprint"
      size="70vw"
      overlayProps={{
        color:
          colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
    >
      <ColorSchemeToggle
        size="34px"
        style={{
          position: "absolute",
          top: 19,
          right: 50,
        }}
      />
      <ScrollArea.Autosize style={{ maxHeight: "70vh" }}>
        <form
          onSubmit={form.onSubmit((sprint, event) => {
            event?.preventDefault();
            mutation.mutate(sprint);
          })}
        >
          <Stack gap="md" mr="sm">
            <NameInput form={form} />
            <GoalInput form={form} />
            <SprintStartDatePicker form={form} />
            <SprintEndDatePicker form={form} />
            <Group justify="right">
              <Button
                variant="light"
                color="gray"
                onClick={() => setOpened(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </Group>
          </Stack>
        </form>
      </ScrollArea.Autosize>
    </Modal>
  );
}
