import { Box } from "@mui/material";
import CreatePost from "./box/CreatePost";
import LikePost from "./box/LikePost";
import CommentPost from "./box/CommentPost";
import CommentLike from "./box/CommentLike";
import FollowUser from "./box/FollowUser";
import { HistoryInterface } from "~/utils";

export default function LogComponent({ data }: { data: HistoryInterface }) {
  return (
    <Box>
      {data.historyType === HistoryType.CreatePost && (
        <Box>
          <CreatePost post={data} />
        </Box>
      )}
      {data.historyType === HistoryType.PostLike && (
        <Box>
          <LikePost post={data} />
        </Box>
      )}
      {data.historyType === HistoryType.Comment && (
        <Box>
          <CommentPost post={data} />
        </Box>
      )}
      {data.historyType === HistoryType.CommentLike && (
        <Box>
          <CommentLike post={data} />
        </Box>
      )}
      {data.historyType === HistoryType.Follow && (
        <Box>
          <FollowUser post={data} />
        </Box>
      )}
    </Box>
  );
}

enum HistoryType {
  CreatePost = "createPost",
  PostLike = "PostLike",
  Comment = "Comment",
  CommentLike = "CommentLike",
  Follow = "Follow",
  ProfileView = "ProfileView",
}
