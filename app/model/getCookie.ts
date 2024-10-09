import { cookie } from "~/cookies.server";

export async function getCookie(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const cookieData = (await cookie.parse(cookieHeader)) || {};

  // console.log("cookieHeader >>>", cookieHeader);
  console.log("getToken.ts >>>", cookieData);

  return cookieData.token as string;
}
