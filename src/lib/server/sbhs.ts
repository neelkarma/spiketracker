import { CLIENT_ID, CLIENT_SECRET } from "$env/static/private";
import { API_BASE, WEBSITE_URL } from "$lib/server/consts";
import { Issuer } from "openid-client";

const issuer = new Issuer({
  issuer: API_BASE,
  authorization_endpoint: `${API_BASE}/authorize`,
  token_endpoint: `${API_BASE}/token`,
});

export const client = new issuer.Client({
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  redirect_uris: [`${WEBSITE_URL}/auth/callback`],
  response_types: ["code"],
});
