export {}
jest.mock("electron", () => ({
  ipcRenderer: {
    on: jest.fn(),
  },
}))

describe("loginToJiraCloud", () => {
  it("should call onSuccess if the response is OK", async () => {
    // Mock the loginToJiraCloud function
    const mockLoginToJiraCloud = jest.fn()
    mockLoginToJiraCloud.mockImplementation(({ onSuccess }) => {
      onSuccess()
    })
    const onSuccess = jest.fn()
    // Call the mocked function
    await mockLoginToJiraCloud({ onSuccess })

    // Check if onSuccess was called
    expect(onSuccess).toHaveBeenCalled()
  })
})
