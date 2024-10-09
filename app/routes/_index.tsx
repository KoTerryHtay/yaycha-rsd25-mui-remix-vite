import { Box, Typography, Alert, Button } from "@mui/material";
import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "~/root";
import Form from "~/src/components/Form";
import Item from "~/src/components/Item";
import {
  api,
  fetchFollowingPosts,
  fetchPosts,
  postPost,
} from "~/src/libs/fetcher";
import { Post, useApp } from "~/utils";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [showLatest, setShowLatest] = useState(true);
  const { showForm, setGlobalMeg, auth, token } = useApp();

  console.log("home auth >>>", auth);

  // console.log("_index useLoaderData token >>>", token);

  const { isLoading, isError, error, data } = useQuery<Post[], Error>(
    ["posts", showLatest],
    async () => {
      if (showLatest) return fetchPosts();
      return fetchFollowingPosts(token!);
    }
  );

  const remove = useMutation(
    async (id: number) => {
      await fetch(`${api}/content/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onMutate: (id: number) => {
        queryClient.cancelQueries("posts");
        queryClient.setQueryData<Post[]>(["posts", showLatest], (old) =>
          old!.filter((item) => item.id !== id)
        );
        setGlobalMeg("An post deleted");
      },
    }
  );

  const add = useMutation(
    async (content: string) => postPost(content, token!),
    {
      onSuccess: async (post) => {
        await queryClient.cancelQueries("posts");
        queryClient.setQueryData<Post[]>(
          ["posts", showLatest],
          (old) => [post, ...old!]
          // old ? [post, ...old] : [post];
        );
        setGlobalMeg("A post added");
      },
    }
  );

  if (!data) return null;

  // console.log("posts data >>>", data);

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
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
      {showForm && auth && <Form add={add.mutate} />}
      {!auth && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Typography>Please Login to continue</Typography>
          <Link to={"/login"}>Login</Link>
        </Box>
      )}

      {auth && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Button disabled={showLatest} onClick={() => setShowLatest(true)}>
            Latest
          </Button>
          <Typography sx={{ color: "text.fade", fontSize: 15 }}>|</Typography>
          <Button disabled={!showLatest} onClick={() => setShowLatest(false)}>
            Following
          </Button>
        </Box>
      )}

      {auth &&
        data.map((item) => {
          return <Item key={item.id} item={item} remove={remove.mutate} />;
        })}
    </Box>
  );
}
