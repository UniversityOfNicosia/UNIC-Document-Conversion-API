import { google } from "googleapis";
import { exportToGDoc } from "./createDoc";
import { NextRequest, NextResponse } from "next/server";

export const dynamic='force-dynamic';

const OAUTH2_CLIENT_ID = process.env.GOOGLE_OAUTH2_CLIENT_ID;
const OAUTH2_CLIENT_SECRET = process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/endOAuth";

const oauth2Client = new google.auth.OAuth2(
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  REDIRECT_URI
);

const formatMarkdownToGoogleDoc = async (content, fileName, oauth2Client) => {
  const docs = google.docs({ version: "v1", auth: oauth2Client });

  let docId = await exportToGDoc(content, fileName, docs);

  return `https://docs.google.com/document/d/${docId}/edit`;
};

export async function GET(req) {
  try {
    const url = new URL(req.url);

    const code = url.searchParams.get('code');
    const scope = url.searchParams.get('scope');

    const stateJSON = url.searchParams.get('state');
    const state = JSON.parse(decodeURIComponent(stateJSON));

    const { content, fileName } = state;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    let docUrl = await formatMarkdownToGoogleDoc(content, fileName, oauth2Client);

    return NextResponse.redirect(docUrl);
  } catch (error) {
    console.error("Error in OAuth2 callback:", error);
    return NextResponse.status(501);
  }
}
