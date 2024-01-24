import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { Login } from "./Login";

jest.mock("../../get-meta-env.ts", () => ({
  getImportMetaEnv: jest.fn(() => ({})),
}));
jest.mock("./jira-cloud/loginToJiraCloud.ts", () => ({
  loginToJiraCloud: jest.fn(),
}));
jest.mock("electron", () => ({
  ipcRenderer: {
    send: jest.fn(),
    on: jest.fn(),
    removeAllListeners: jest.fn(),
  },
}));

jest.mock("./jira-server/loginToJiraServer.ts", () => ({
  loginToJiraServer: jest.fn(),
}));
const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("<Login />", () => {
  it("should set providerLogin to JiraCloud after clicking on the Jira Cloud Button", async () => {
    const { container, getByTestId } = render(
      <MantineProvider>
        <Login />
      </MantineProvider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Jira Cloud" }));
    const providerLogin = container.querySelector("#providerLogin");

    if (providerLogin !== null) {
      expect(providerLogin.textContent).toBe("JiraCloud");
      const JiraCloudLoginElement = getByTestId("JiraCloudLogin");
      expect(JiraCloudLoginElement).toBeInTheDocument();
    }
  });

  it("should set providerLogin to JiraServer after clicking on the Jira Server Button", async () => {
    const { container, getByTestId } = render(
      <MantineProvider>
        <Login />
      </MantineProvider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Jira Server" }));

    const providerLogin = container.querySelector("#providerLogin");
    if (providerLogin !== null) {
      expect(providerLogin.textContent).toBe("JiraServer");
      const JiraServerLoginElement = getByTestId("JiraServerLogin");
      expect(JiraServerLoginElement).toBeInTheDocument();
    }
  });
});
