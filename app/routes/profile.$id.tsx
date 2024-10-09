import { Alert, Avatar, Box, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import { useParams } from "@remix-run/react";
import { useQuery } from "react-query";

import FollowButton from "~/src/components/FollowButton";
import { fetchUser } from "~/src/libs/fetcher";
import { useApp, User } from "~/utils";

export default function Profile() {
  const { id } = useParams();
  const { token } = useApp();

  if (!token) return null;

  const { isLoading, isError, error, data } = useQuery<User, Error>(
    `users/${id}`,
    async () => fetchUser(Number(id), token!)
  );

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "banner",
          height: 150,
          borderRadius: 4,
        }}
      ></Box>
      <Box
        sx={{
          mb: 4,
          marginTop: "-60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar sx={{ width: 100, height: 100, bgcolor: pink[500] }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography>{data?.name}</Typography>
          <Typography
            sx={{
              fontSize: "0.8em",
              color: "text.fade",
            }}
          >
            {data?.bio}
          </Typography>
        </Box>
        <FollowButton user={data!} />
      </Box>
    </Box>
  );
}
