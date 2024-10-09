import {
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { useMutation, useQuery } from "react-query";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useNavigate } from "@remix-run/react";
import { fetchNotis, putAllNotisRead, putNotiRead } from "~/src/libs/fetcher";
import { Noti, useApp } from "~/utils";
import { queryClient } from "~/root";

export default function Notis() {
  const navigate = useNavigate();
  const { token } = useApp();

  if (!token) return null;

  const { isLoading, isError, error, data } = useQuery("notis", () =>
    fetchNotis(token!)
  );

  // console.log("Notis data >>>", data);

  const readAllNotis = useMutation(() => putAllNotisRead(token!), {
    onMutate: async () => {
      await queryClient.cancelQueries("notis");
      queryClient.setQueryData<Noti[]>("notis", (old) => {
        return old!.map((noti) => {
          noti.read = true;
          return noti;
        });
      });
    },
  });

  const readNoti = useMutation((id: number) => putNotiRead(id, token!));

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">
          {error instanceof Error && error.message}
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ flex: 1 }}></Box>
        <Button
          size="small"
          variant="outlined"
          sx={{ borderRadius: 5 }}
          onClick={() => {
            readAllNotis.mutate();
          }}
        >
          Mark all as Read
        </Button>
      </Box>

      {data?.map((noti) => {
        return (
          <Card
            key={noti.id}
            sx={{
              mb: 2,
              opacity: noti.read ? 0.3 : 1,
            }}
          >
            <CardActionArea
              onClick={() => {
                readNoti.mutate(noti.id!);
                navigate(`/comments/${noti.postId}`);
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  opacity: 1,
                }}
              >
                {noti.type === "comment" ? (
                  <CommentIcon color="success" />
                ) : (
                  <FavoriteIcon color="error" />
                )}

                <Box
                  sx={{
                    ml: 3,
                  }}
                >
                  <Avatar />

                  <Box
                    sx={{
                      ml: 3,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        mr: 1,
                      }}
                    >
                      <b>{noti.user?.name}</b>
                    </Typography>

                    <Typography
                      component="span"
                      sx={{
                        mr: 1,
                        color: "text.secondary",
                      }}
                    >
                      <b>{noti.content}</b>
                    </Typography>

                    <Typography component="span" color="primary">
                      <small>{format(noti.created!, "MMM dd, yyyy")}</small>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
}
