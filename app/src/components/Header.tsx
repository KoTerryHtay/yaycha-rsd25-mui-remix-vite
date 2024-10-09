import {
  Add as AddIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotiIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  History as HistoryIcon,
} from "@mui/icons-material";

import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import { useApp } from "~/utils";
import { Link } from "@remix-run/react";

export default function Header() {
  const { showForm, setShowForm, mode, setMode, setShowDrawer, token } =
    useApp();
  // const navigate = useNavigate();

  // console.log('header')

  // const { isLoading, isError, data } = useQuery(["notis", auth], () =>
  //   fetchNotis(token)
  // );

  // function notiCount() {
  //   if (!auth) return 0;
  //   if (isLoading || isError) return 0;

  //   return data?.filter((noti) => !noti.read).length;
  // }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => {
            setShowDrawer(true);
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          sx={{
            flexGrow: 1,
            ml: 2,
          }}
        >
          <Link to={"/"}>
            <IconButton sx={{ gap: 1 }}>Yaycha</IconButton>
          </Link>
        </Typography>

        <Box>
          {token && (
            <>
              <IconButton
                onClick={() => {
                  setShowForm(!showForm);
                }}
              >
                <AddIcon />
              </IconButton>

              <Link to={"/profile-view"}>
                <IconButton>
                  <RemoveRedEyeIcon />
                </IconButton>
              </Link>

              <Link to={"/history"}>
                <IconButton>
                  <HistoryIcon />
                </IconButton>
              </Link>

              <Link to={"/search"}>
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </Link>

              <Link to={"/notis"}>
                <IconButton>
                  <Badge color="error" badgeContent={0}>
                    <NotiIcon />
                  </Badge>
                </IconButton>
              </Link>
            </>
          )}

          {mode === "dark" ? (
            <IconButton
              edge="end"
              onClick={() => {
                setMode("light");
              }}
            >
              <LightModeIcon />
            </IconButton>
          ) : (
            <IconButton
              edge="end"
              onClick={() => {
                setMode("dark");
              }}
            >
              <DarkModeIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
