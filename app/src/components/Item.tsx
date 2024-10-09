import {
  AccountCircle as UserIcon,
  Alarm as TimeIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { formatRelative } from "date-fns";
import { Post } from "~/utils";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import { useLocation, useNavigate } from "@remix-run/react";

export default function Item({
  item,
  remove,
  primary,
  comment,
}: {
  item: Post;
  remove: (id: number) => void;
  primary?: boolean;
  comment?: boolean;
}) {
  const navigate = useNavigate();

  const path = useLocation().pathname;

  return (
    <Card sx={{ mb: 2 }}>
      {primary && <Box sx={{ height: 50, bgcolor: green[500] }} />}

      <CardContent
        sx={{
          cursor: "pointer",
        }}
        onClick={() => {
          if (comment || path === `/comments/${item.id}`) return false;
          navigate(`/comments/${item.id}`);
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TimeIcon color="success" fontSize="small" />
            <Typography variant="caption" sx={{ color: green[500] }}>
              {/* A few second ago */}
              {formatRelative(Date.parse(item.created!), new Date())}
            </Typography>
          </Box>
          <IconButton
            sx={{ color: "text.fade" }}
            size="small"
            onClick={(e) => {
              remove(item.id!);
              e.stopPropagation();
            }}
          >
            <DeleteIcon color="inherit" fontSize="inherit" />
          </IconButton>
        </Box>

        <Typography sx={{ my: 3 }}>{item.content}</Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            onClick={(e) => {
              navigate(`profile/${item.user?.id}`);
              e.stopPropagation();
            }}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <UserIcon fontSize="small" color="info" />
            <Typography variant="caption">{item.user?.name}</Typography>
          </Box>
          <Box>
            <LikeButton comment={comment ? true : false} item={item} />
            <CommentButton item={item} comment={!!comment} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
