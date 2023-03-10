import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { JiraCloudLogin } from "./JiraCloudLogin"

jest.mock("./loginToJiraCloud.ts", () => ({
  loginToJiraCloud: jest.fn(),
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

describe("<JiraCloudLogin />", () => {
  it("should call goBack when GO BACK button clicked", async () => {
    const goBack = jest.fn()
    const onSuccess = jest.fn()
    render(<JiraCloudLogin goBack={goBack} onSuccess={onSuccess} />)

    await userEvent.click(screen.getByRole("button"))

    expect(goBack).toBeCalled()
    expect(onSuccess).not.toBeCalled()
  })
})
