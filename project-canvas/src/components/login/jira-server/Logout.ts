export function Logout({
  LogoutSuccess,
  LogoutFailed,
}: {
  LogoutSuccess: () => void
  LogoutFailed: () => void
}) {
  fetch(`${import.meta.env.VITE_EXTENDER}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "JiraServer",
    }),
  }).then((response) => {
    if (response.status === 204) LogoutSuccess()
    if (response.status === 401) LogoutFailed()
  })
}
