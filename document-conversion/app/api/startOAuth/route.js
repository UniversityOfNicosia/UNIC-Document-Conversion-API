import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const OAUTH2_CLIENT_ID = process.env.GOOGLE_OAUTH2_CLIENT_ID;
const OAUTH2_CLIENT_SECRET = process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/endOAuth";

const oauth2Client = new google.auth.OAuth2(
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  REDIRECT_URI
);

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const content = url.searchParams.get('content');
    const fileName = url.searchParams.get('fileName');

    const state = JSON.stringify({
      content,
      fileName,
    });

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/documents"],
      state: state,
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error in OAuth2 callback:", error);
    return new NextResponse(502, "Internal Server Error");
  }
}
