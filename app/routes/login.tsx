import { json } from "react-router-dom";
import { useApp } from "../utils";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { postLogin } from "~/src/libs/fetcher";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { cookie } from "~/cookies.server";

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookieData = (await cookie.parse(cookieHeader)) || {};

  const formData = await request.formData();

  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  console.log(username, password);

  if (!username || !password)
    return json({ message: "username and password required" });

  const user = await postLogin(username, password);

  cookieData.token = user.token;
  // cookieData.user = user.user;

  // console.log("user >>>", user);

  return redirect("/", {
    headers: {
      "Set-Cookie": await cookie.serialize(cookieData),
    },
  });
}

export default function Login() {
  const error = useActionData<typeof action>() as { message: string };
  const { token } = useApp();

  if (token) return null;

  // console.log("error >>>", error?.message);

  return (
    <Box>
      <Typography variant="h3">Login</Typography>

      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}

      <Form method="post">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <TextField name="username" placeholder="Username" fullWidth />
          <TextField
            name="password"
            value={"password"}
            type="password"
            placeholder="Password"
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Box>
      </Form>
    </Box>
  );
}
