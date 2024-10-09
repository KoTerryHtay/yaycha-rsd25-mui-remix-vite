import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { MoreHoriz as MoreHorizIcon } from "@mui/icons-material";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Comment, HistoryInterface, useApp } from "~/utils";
import { api } from "~/src/libs/fetcher";
import { queryClient } from "~/root";

export default function CommentPost({ post }: { post: HistoryInterface }) {
  // console.log("CommentPost post", post);

  const { setGlobalMeg, token } = useApp();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const { isError, isLoading, error, data } = useQuery<Comment, Error>(
    ["history", post.id, post.historyType],
    async () => {
      const res = await fetch(`${api}/comments/${post.historyId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    }
  );

  const remove = useMutation(
    async (id: number) => {
      // content/comments/:id
      await fetch(`${api}/content/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["history", post.id, post.historyType]);
        setGlobalMeg("delete comment");
      },
    }
  );

  // console.log("CommentPost data >>>", data);
  if (!data) return null;

  if (isError) {
    return (
      <Box>
        <Alert>{error.message}</Alert>
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
    <Card
      sx={{
        mb: 2,
        border: "initial",
        borderColor: "grey",
        display: "flex",
        flexDirection: "row",
        opacity: 1,
        alignItems: "center",
      }}
    >
      <CardActionArea
        onClick={() => {
          navigate(`/comments/${data?.postId}`);
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "row",
            opacity: 1,
            alignItems: "center",
          }}
        >
          <Box>
            <Avatar />
          </Box>
          <Box
            sx={{
              ml: 2,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <Typography
              component="span"
              sx={{
                mr: 1,
              }}
            >
              <b>{`${data.user?.name} comment a post of ${data.post?.user?.name}.`}</b>
            </Typography>

            <Typography
              component="span"
              sx={{
                mr: 1,
                color: "text.secondary",
              }}
            >
              <b>{`${data.content}`}</b>
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box>
        <Button
          sx={{
            p: 1,
            color: "white",
          }}
          type="button"
          onClick={(e) => {
            handleClick(e);
          }}
        >
          <MoreHorizIcon />
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              handleClose();
              remove.mutate(data!.postId!);
            }}
          >
            Delete Comment
          </MenuItem>
        </Menu>
      </Box>
    </Card>
  );
}
