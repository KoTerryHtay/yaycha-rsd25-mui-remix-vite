import { useMutation } from "react-query";
import {
  deleteCommentLike,
  deletePostLike,
  postCommentLike,
  postPostLike,
} from "../libs/fetcher";

import { Button, ButtonGroup, IconButton } from "@mui/material";
import {
  Favorite as LikedIcon,
  FavoriteBorder as LikeIcon,
} from "@mui/icons-material";
import { Post, useApp } from "~/utils";
import { queryClient } from "~/root";
import { useNavigate } from "@remix-run/react";

export default function LikeButton({
  item,
  comment,
}: {
  item: Post;
  comment?: boolean;
}) {
  // console.log("LikeButton");
  const navigate = useNavigate();
  const { auth, token } = useApp();

  function isLiked() {
    if (!auth) return false;
    if (!item.likes) return false;

    return !!item.likes.find((like) => like.userId === auth.id);
  }

  const likePost = useMutation((id: number) => postPostLike(id, token!), {
    onSuccess: () => {
      // queryClient.invalidateQueries("posts");
      // queryClient.invalidateQueries("comments");
      queryClient.refetchQueries("posts");
      queryClient.refetchQueries("comments");
    },
  });

  const likeComment = useMutation((id: number) => postCommentLike(id, token!), {
    onSuccess: () => {
      queryClient.refetchQueries("comments");
    },
  });

  const unlikePost = useMutation((id: number) => deletePostLike(id, token!), {
    onSuccess: () => {
      queryClient.refetchQueries("posts");
      queryClient.refetchQueries("comments");
    },
  });

  const unlikeComment = useMutation(
    (id: number) => deleteCommentLike(id, token!),
    {
      onSuccess: () => {
        queryClient.refetchQueries("comments");
      },
    }
  );

  return (
    <ButtonGroup>
      {isLiked() ? (
        <IconButton
          size="small"
          onClick={(e) => {
            comment
              ? unlikeComment.mutate(item.id!)
              : unlikePost.mutate(item.id!);

            e.stopPropagation();
          }}
        >
          <LikedIcon fontSize="small" color="error" />
        </IconButton>
      ) : (
        <IconButton
          size="small"
          onClick={(e) => {
            comment ? likeComment.mutate(item.id!) : likePost.mutate(item.id!);
            e.stopPropagation();
          }}
        >
          <LikeIcon fontSize="small" color="error" />
        </IconButton>
      )}
      <Button
        onClick={(e) => {
          if (comment) {
            navigate(`likes/${item.id}/comment`);
          } else {
            navigate(`likes/${item.id}/post`);
          }

          e.stopPropagation();
        }}
        sx={{ color: "text.fade" }}
        variant="text"
        size="small"
      >
        {item.likes ? item.likes.length : 0}
      </Button>
    </ButtonGroup>
  );
}
