import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { JiraCloudLogin } from "./JiraCloudLogin";

export {};
jest.mock("./loginToJiraCloud.ts", () => ({ loginToJiraCloud: jest.fn() }));
jest.mock("electron", () => ({
  ipcRenderer: {
    on: jest.fn(),
    removeAllListeners: jest.fn(),
  },
}));

describe("<JiraCloudLogin />", () => {
  it("should call goBack when GO BACK button clicked", async () => {
    const goBack = jest.fn();
    const onSuccess = jest.fn();
    render(
      <MantineProvider>
        <JiraCloudLogin goBack={goBack} onSuccess={onSuccess} />
      </MantineProvider>,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(goBack).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
