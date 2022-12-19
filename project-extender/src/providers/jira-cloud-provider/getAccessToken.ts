import fetch from "cross-fetch"

export async function getAccessToken({
  clientId,
  clientSecret,
  redirectUri,
  code,
}: {
  clientId: string
  clientSecret: string
  redirectUri: string
  code: string
}) {
  return fetch("https://auth.atlassian.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  }).then(async (response) => {
    const { access_token: accessToken } = await response.json()
    return accessToken
  })
}
