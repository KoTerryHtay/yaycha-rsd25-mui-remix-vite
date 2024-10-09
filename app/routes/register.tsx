import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useApp, User } from "~/utils";
import { postUser } from "~/src/libs/fetcher";

export default function Register() {
  const { setGlobalMeg, token } = useApp();

  const nameInput = useRef<HTMLInputElement>(null);
  const usernameInput = useRef<HTMLInputElement>(null);
  const bioInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
    const name = nameInput.current?.value;
    const username = usernameInput.current?.value;
    const bio = bioInput.current?.value;
    const password = passwordInput.current?.value;

    if (!name || !username || !password) {
      setError("name, username and password required");
      return false;
    }

    create.mutate({ name, username, bio, password });
  };

  const create = useMutation(async (data: Partial<User>) => postUser(data), {
    onError: async () => {
      setError("Cannot create account");
    },
    onSuccess: async () => {
      setGlobalMeg("Account Created");
      navigate("login");
    },
  });

  if (token) return null;

  return (
    <Box>
      <Typography variant="h3">Register</Typography>

      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 2,
          }}
        >
          <TextField inputRef={nameInput} placeholder="Name" fullWidth />
          <TextField
            inputRef={usernameInput}
            placeholder="Username"
            fullWidth
          />
          <TextField inputRef={bioInput} placeholder="Bio" fullWidth />
          <TextField
            inputRef={passwordInput}
            placeholder="Password"
            type="password"
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth>
            Register
          </Button>
        </Box>
      </form>
    </Box>
  );
}
