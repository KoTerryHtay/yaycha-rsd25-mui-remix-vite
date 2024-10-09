import { Box, Button, TextField } from "@mui/material";
import { useRef } from "react";

export default function Form({
  add,
}: {
  add: (content: string) => void;
  // add: (content: string, name: string) => void;
}) {
  const contentRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const content = contentRef.current?.value;

        if (!content) return null;

        add(content);
        // add(content, "Alice");

        e.currentTarget.reset();
      }}
    >
      <Box sx={{ mb: 4, textAlign: "right" }}>
        <TextField
          inputRef={contentRef}
          type="text"
          placeholder="Content"
          fullWidth
          multiline
          sx={{ mb: 1 }}
        />
        <Button variant="contained" type="submit">
          Post
        </Button>
      </Box>
    </form>
  );
}
