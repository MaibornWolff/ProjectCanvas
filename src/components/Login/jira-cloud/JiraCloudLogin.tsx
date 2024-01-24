import { Button, Center, Loader } from "@mantine/core";
import { ipcRenderer } from "electron";
import { useEffect } from "react";
import { loginToJiraCloud } from "./loginToJiraCloud";

export function JiraCloudLogin({
  goBack,
  onSuccess,
}: {
  goBack: () => void;
  onSuccess: () => void;
}) {
  loginToJiraCloud({ onSuccess });

  // Add event listener for "cancelOAuth" message
  useEffect(() => {
    ipcRenderer.on("cancelOAuth", () => {
      goBack();
    });
    return () => {
      // Remove event listener when component unmounts
      ipcRenderer.removeAllListeners("cancelOAuth");
    };
  }, []);

  return (
    <>
      <Center style={{ height: "200px" }} data-testid="JiraCloudLogin">
        <Loader size="xl" />
      </Center>
      <Button variant="outline" fullWidth color="dark" onClick={goBack}>
        Go Back
      </Button>
    </>
  );
}
