import { useMutation } from "react-query";
import { Button } from "@mui/material";
import { useApp, User } from "~/utils";
import { deleteFollow, postFollow } from "../libs/fetcher";
import { queryClient } from "~/root";

export default function FollowButton({ user }: { user: User }) {
  const { auth, token } = useApp();

  function isFollowing() {
    return user.following?.find((item) => item.followerId === auth?.id);
  }

  const follow = useMutation((id: number) => postFollow(id, token!), {
    onSuccess: async () => {
      await queryClient.refetchQueries("users");
      await queryClient.refetchQueries("user");
      await queryClient.refetchQueries("search");
    },
  });

  const unfollow = useMutation((id: number) => deleteFollow(id, token!), {
    onSuccess: async () => {
      await queryClient.refetchQueries("users");
      await queryClient.refetchQueries("user");
      await queryClient.refetchQueries("search");
    },
  });

  if (!auth) return <></>;

  return auth.id === user.id ? (
    <></>
  ) : (
    <Button
      size="small"
      // edge="end"
      variant={isFollowing() ? "outlined" : "contained"}
      sx={{ borderRadius: 5 }}
      onClick={(e) => {
        if (isFollowing()) {
          unfollow.mutate(user.id!);
        } else {
          follow.mutate(user.id!);
        }

        e.stopPropagation();
      }}
    >
      {isFollowing() ? "Following" : "Follow"}
    </Button>
  );
}
