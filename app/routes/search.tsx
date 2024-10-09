import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  Alert,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { Post, useApp, User } from "~/utils";
import { useNavigate } from "@remix-run/react";
import { api, fetchSearch } from "~/src/libs/fetcher";
import { queryClient } from "~/root";
import FollowButton from "~/src/components/FollowButton";
import Item from "~/src/components/Item";

export default function Search() {
  const { setGlobalMeg, token } = useApp();
  const [query, setQuery] = useState("");

  if (!token) return null;

  const debouncedQuery = useDebounce(query, 500);

  const navigate = useNavigate();

  // console.log("debouncedQuery >>>", debouncedQuery);

  const { isLoading, isError, error, data } = useQuery(
    ["search", debouncedQuery],
    () => fetchSearch(debouncedQuery)
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
        queryClient.setQueryData<{
          users: User[];
          posts: Post[];
        }>(["search", debouncedQuery], (old) => {
          return {
            users: old!.users,
            posts: old!.posts!.filter((item) => item.id !== id),
          };
        });
        setGlobalMeg("An post deleted");
      },
    }
  );

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">
          {error instanceof Error && error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <TextField
        fullWidth={true}
        variant="outlined"
        placeholder="Search..."
        onKeyUp={(e) => {
          setQuery((e.target as HTMLInputElement).value);
        }}
      />
      {debouncedQuery ? (
        isLoading ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>Loading...</Box>
        ) : (
          <>
            <List>
              {!!data?.users?.length && <Typography>Users</Typography>}
              {data?.users?.map((user) => (
                <ListItem key={user.id}>
                  <ListItemButton
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.bio} />
                    <ListItemSecondaryAction>
                      <FollowButton user={user} />
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <List>
              {!!data?.posts?.length && <Typography>Posts</Typography>}
              {data?.posts?.map((item) => (
                <Item key={item.id} item={item} remove={remove.mutate} />
              ))}
            </List>
          </>
        )
      ) : null}
    </Box>
  );
}
