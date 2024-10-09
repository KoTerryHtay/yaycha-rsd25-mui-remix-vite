import { Box, Container, Snackbar } from "@mui/material";
import Header from "./src/components/Header";
import { useApp } from "./utils";
import AppDrawer from "./src/components/AppDrawer";
import { useEffect } from "react";
import { fetchVerify } from "./src/libs/fetcher";

export default function Template({ children }: { children: React.ReactNode }) {
  const { globalMeg, setGlobalMeg, token, setAuth } = useApp();

  useEffect(() => {
    token &&
      fetchVerify(token).then((user) => {
        if (user) setAuth(user);
        console.log("fetchVerify user auth >>>", user);
      });
  }, [token]);

  return (
    <Box>
      <Header />
      <AppDrawer />

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {children}
      </Container>

      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        open={Boolean(globalMeg)}
        autoHideDuration={6000}
        onClose={() => setGlobalMeg("")}
        message={globalMeg}
      />
    </Box>
  );
}
