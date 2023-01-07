export function Logout() {
  console.log("logout sent from canvas to extender")

  fetch(`${import.meta.env.VITE_EXTENDER}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "JiraServer",
    }),
  })
    .then(() => {})
    .catch((err) => {
      console.log(err)
    })
}
