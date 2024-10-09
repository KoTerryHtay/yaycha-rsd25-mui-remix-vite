import { createContext, useContext } from "react";

export type Mode = "dark" | "light";

export const AppContext = createContext<{
  token: string | null;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  showDrawer: boolean;
  setShowDrawer: (show: boolean) => void;
  globalMeg: string;
  setGlobalMeg: (mes: string) => void;
  auth: User | null;
  setAuth: (auth: User | null) => void;
}>({
  token: null,
  mode: "dark",
  setMode: () => {},
  showForm: true,
  setShowForm: () => {},
  showDrawer: false,
  setShowDrawer: () => {},
  globalMeg: "",
  setGlobalMeg: () => {},
  auth: null,
  setAuth: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export enum HistoryType {
  ProfileView = "ProfileView",
  Follow = "Follow",
  CreatePost = "createPost",
  PostLike = "PostLike",
  Comment = "Comment",
  CommentLike = "CommentLike",
}

export interface User {
  id?: number;
  name: string;
  username: string;
  bio?: string;
  password?: string;

  posts?: Post[];
  comments?: Comment[];

  postLikes?: PostLike[];
  commentLikes?: CommentLikeInterface[];

  followers?: Follow[];
  following?: Follow[];

  notis: Noti[];

  profileViewTo?: ProfileView[];
  profileViewFrom?: ProfileView[];

  history?: History[];

  created?: string;
}

export interface ProfileView {
  id?: number;
  viewToUser?: User;
  viewToUserId?: number;
  viewFromUser?: User;
  viewFromUserId?: number;
  viewTime?: string;
  updated?: string;
}

export interface HistoryInterface {
  id?: number;
  historyId?: number;
  historyType?: HistoryType;
  user?: User;
  userId?: number;
  viewTime?: string;
  updated?: string;
}

export interface Post {
  id?: number;
  content?: string;

  user?: User;
  userId?: number;

  comments?: Comment[];
  likes?: PostLike[];

  notis?: Noti[];

  created?: string;
}

export interface PostLike {
  id?: number;
  post?: Post;
  postId?: number;
  user?: User;
  userId?: number;
  created?: string;
}

export interface Comment {
  id?: number;
  content: string;

  user?: User;
  userId?: number;

  post?: Post;
  postId: number;

  likes?: CommentLikeInterface[];
  created?: string;
}

export interface CommentLikeInterface {
  id?: number;
  comment?: Comment;
  commentId?: number;
  user?: User;
  userId?: number;
  created?: string;
}

export interface Follow {
  id?: number;
  follower?: User;
  followerId?: number;
  following?: User;
  followingId?: number;
  created?: string;
}

export interface loginUser {
  token: string;
  user: User;
}

export interface Msg {
  msg: string;
}

export interface Noti {
  id?: number;

  type: string;
  content: string;

  user?: User;
  userId?: number;

  post?: Post;
  postId?: number;

  read?: boolean;

  created?: string;
}
