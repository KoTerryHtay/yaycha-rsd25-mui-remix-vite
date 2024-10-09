import {
  Home as HomeIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as ProfileIcon,
  PersonAdd as RegisterIcon,
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { Form, Link, useNavigate } from "@remix-run/react";
import { useApp } from "~/utils";

export default function AppDrawer() {
  const { showDrawer, setShowDrawer, auth } = useApp();
  const navigate = useNavigate();

  return (
    <div>
      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)}>
        <Box
          sx={{
            mb: 6,
            width: 300,
            height: 140,
            bgcolor: "banner",
            position: "relative",
          }}
        >
          <Box
            sx={{
              gap: 2,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              position: "absolute",
              left: 20,
              bottom: -30,
            }}
          >
            <Avatar
              sx={{
                width: 94,
                height: 94,
                color: "white",
                background: deepPurple[500],
              }}
            />
            <Typography sx={{ fontWeight: "bold" }}>
              {auth ? auth.name : "GUEST"}
            </Typography>
          </Box>
        </Box>

        <List>
          <Link to={"/"}>
            <ListItem>
              <ListItemButton onClick={() => navigate("/")}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText>Home</ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>

          <Divider />

          {auth && (
            <>
              <Link to={`/profile/${auth.id}`}>
                <ListItem>
                  <ListItemButton
                  // onClick={() => navigate(`/profile/${auth.id}`)}
                  >
                    <ListItemIcon>
                      <ProfileIcon />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </ListItemButton>
                </ListItem>
              </Link>
              <Form method="post" action="/">
                <ListItem>
                  <ListItemButton
                  // onClick={() => {
                  //   setAuth(null);
                  //   navigate("/");
                  // }}
                  >
                    <Button type="submit" color="error">
                      <ListItemIcon>
                        <LogoutIcon color="error" />
                      </ListItemIcon>
                      <ListItemText>Logouts</ListItemText>
                    </Button>
                  </ListItemButton>
                </ListItem>
              </Form>
            </>
          )}
          {!auth && (
            <>
              <ListItem>
                <ListItemButton onClick={() => navigate("/register")}>
                  <ListItemIcon>
                    <RegisterIcon />
                  </ListItemIcon>
                  <ListItemText>Register</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton
                  onClick={() => {
                    setShowDrawer(false);
                    navigate("/login");
                  }}
                >
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText>Login</ListItemText>
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </div>
  );
}
