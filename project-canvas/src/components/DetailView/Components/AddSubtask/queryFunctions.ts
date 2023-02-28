export const createSubtask = (
  parentIssueKey: string,
  summary: string,
  projectId: string
): Promise<{ id: string; key: string }> =>
  new Promise((resolve) => {
    fetch(
      `${
        import.meta.env.VITE_EXTENDER
      }/createSubtask?parentIssueKey=${parentIssueKey}&summary=${summary}&projectId=${projectId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentIssueKey, summary, projectId }),
      }
    ).then(async (createdSubtask) => {
      resolve(await createdSubtask.json())
    })
  })
