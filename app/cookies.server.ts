import { createCookie } from "@remix-run/node";

export const cookie = createCookie("cookie", {
  maxAge: 604_800,
});
