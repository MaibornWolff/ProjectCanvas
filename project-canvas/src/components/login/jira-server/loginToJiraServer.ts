export function loginToJiraServer({
  onSuccess,
  loginOptions,
}: {
  onSuccess: () => void
  loginOptions: { url: string; username: string; password: string }
}) {
  fetch(`${import.meta.env.VITE_EXTENDER}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "JiraServer",
      ...loginOptions,
    }),
  }).then((response) => {
    if (response.ok) onSuccess()
  })

  // EXEMPLE
  // await fetch(`${import.meta.env.VITE_EXTENDER}/projects`).then(
  //   async (response) => console.log(await response.json())
  // )
}
