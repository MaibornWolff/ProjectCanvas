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
    const resp = await response.json()
    const { access_token: accessToken, refresh_token: refreshToken } = resp
    return { accessToken, refreshToken }
  })
}

export async function refreshTokens({
  clientId,
  clientSecret,
  _refreshToken,
}: {
  clientId: string
  clientSecret: string
  _refreshToken: string
}) {
  return fetch("https://auth.atlassian.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: _refreshToken,
    }),
  }).then(async (response) => {
    const resp = await response.json()
    const { access_token: accessToken, refresh_token: refreshToken } = resp
    return { accessToken, refreshToken }
  })
}
