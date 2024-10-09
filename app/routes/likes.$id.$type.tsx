import { Alert, Box } from "@mui/material";
import { useParams } from "@remix-run/react";
import { useQuery } from "react-query";
import UserList from "~/src/components/UserList";
import { fetchCommentLikes, fetchPostLikes } from "~/src/libs/fetcher";
import { useApp } from "~/utils";

export default function Likes() {
  const { id, type } = useParams() as { id: string; type: "comment" };

  const { token } = useApp();

  if (!token) return null;

  const { isLoading, isError, error, data } = useQuery(
    ["users", id, type],
    () => {
      if (type === "comment") {
        return fetchCommentLikes(Number(id));
      } else {
        return fetchPostLikes(Number(id));
      }
    }
  );

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">
          {error instanceof Error && error?.message}
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box>
      <UserList title="Likes" data={data!} />
    </Box>
  );
}
