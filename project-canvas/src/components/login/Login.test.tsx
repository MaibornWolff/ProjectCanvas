import { useState as useStateMock } from "react"
import { render, screen } from "@testing-library/react"
import { Login } from "./Login"

const mockedUsedNavigate = jest.fn()

jest.mock("react-router-dom", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUsedNavigate,
}))

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}))
jest.mock("./jira-cloud/loginToJiraCloud.ts", () => ({
  loginToJiraCloud: jest.fn(),
}))
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}))
const setState = jest.fn()
jest.mock("./jira-server/loginToJiraServer.ts", () => ({
  loginToJiraServer: jest.fn(),
}))
describe("Button", () => {
  beforeEach(() => {
    // @ts-ignore
    // Accepts a function that will be used as an implementation of the mock for one call to the mocked function.
    // Can be chained so that multiple function calls produce different results.
    useStateMock.mockImplementation((init: string) => [init, setState])
  })
  it("tests the button props", () => {
    render(<Login />)
    expect(
      screen.getByRole("button", { name: "Jira Server" })
    ).toBeInTheDocument()
  })
  it("renders the button as disabled when state is true", () => {
    // @ts-ignore
    useStateMock.mockImplementationOnce(() => ["JiraServer", setState])
    render(<Login />)
    expect(screen.getByRole("button", { name: "Jira Server" })).toBeDisabled()
  })
})
