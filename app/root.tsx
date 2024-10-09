import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Template from "./Template";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppContext, Mode, User } from "./utils";
import { deepPurple, grey } from "@mui/material/colors";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { getCookie } from "./model/getCookie";
import { cookie } from "./cookies.server";

export const queryClient = new QueryClient();

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getCookie(request);
  console.log("root.tsx cookieData token >>>", token);

  return json({ token });
}

// Logout
export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookieData = (await cookie.parse(cookieHeader)) || {};

  cookieData.token = null;

  // console.log("logout cookieData >>>", cookieData);

  return redirect("/", {
    headers: {
      "Set-Cookie": await cookie.serialize(cookieData),
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { token } = useLoaderData<{ token: string }>();

  const [showDrawer, setShowDrawer] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [globalMeg, setGlobalMeg] = useState("");
  const [auth, setAuth] = useState<User | null>(null);
  const [mode, setMode] = useState<Mode>("dark");

  // console.log("root.tsx Layout useLoaderData token >>>", token);
  // console.log("root.tsx Layout auth >>>", auth);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: deepPurple,
          banner: mode === "dark" ? grey[800] : grey[200],
          text: {
            fade: grey[500],
          },
        },
      }),
    [mode]
  );

  useEffect(() => {
    import("@fontsource/roboto/300.css");
    import("@fontsource/roboto/400.css");
    import("@fontsource/roboto/500.css");
    import("@fontsource/roboto/700.css");

    !token && setAuth(null);
  }, [token]);

  const navigate = useNavigate();
  const url = useLocation().pathname;
  // console.log("root.tsx Layout url >>>", url);

  useEffect(() => {
    if (!token && url !== "/" && url !== "/login") return navigate("/");
    if (token && (url === "/login" || url === "/register"))
      return navigate("/");
  }, [token, url]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <AppContext.Provider
          value={{
            token,
            showForm,
            setShowForm,
            mode,
            setMode,
            showDrawer,
            setShowDrawer,
            globalMeg,
            setGlobalMeg,
            auth,
            setAuth,
          }}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Template>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </Template>
          </ThemeProvider>
        </AppContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.data
    : (error as Error).message;
  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }} color="red">
        {message ?? "An error occurred"}
      </Typography>
    </Box>
  );
}

// Extend the TypeText interface
declare module "@mui/material" {
  interface TypeText {
    fade: string;
  }

  interface Palette {
    banner: string;
  }

  interface PaletteOptions {
    banner?: string;
  }
}
