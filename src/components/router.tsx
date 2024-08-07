import HomePage from "pages/home";
import NotificationsPage from "pages/notifications";
import PostListPage from "pages/posts";
import PostDetail from "pages/posts/detail";
import PostEdit from "pages/posts/edit";
import PostNewPage from "pages/posts/new";
import ProfilePage from "pages/profile";
import ProfileEdit from "pages/profile/edit";
import SearchPage from "pages/search";
import LoginPage from "pages/users/login";
import SignupPage from "pages/users/signup";
import { Navigate, Route, Routes } from "react-router-dom";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts" element={<PostListPage />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/posts/new" element={<PostNewPage />} />
      <Route path="/posts/edit/:id" element={<PostEdit />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit/:id" element={<ProfileEdit />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/users/login" element={<LoginPage />} />
      <Route path="/users/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate replace to={"/"} />} />
    </Routes>
  );
}
