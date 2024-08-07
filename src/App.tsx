import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>home page</h1>} />
      <Route path="/posts" element={<h1>posts list page</h1>} />
      <Route path="/posts/:id" element={<h1>posts detail page</h1>} />
      <Route path="/posts/new" element={<h1>posts new page</h1>} />
      <Route path="/posts/edit/:id" element={<h1>posts edit page</h1>} />
      <Route path="/profile" element={<h1>posts profile page</h1>} />
      <Route
        path="/profile/edit/:id"
        element={<h1>posts profile edit page</h1>}
      />
      <Route
        path="/notifications"
        element={<h1>posts notifications page</h1>}
      />
      <Route path="/search" element={<h1>posts search page</h1>} />
      <Route path="/login" element={<h1>posts login page</h1>} />
      <Route path="/signup" element={<h1>posts signup page</h1>} />
      <Route path="*" element={<Navigate replace to={"/"} />} />
    </Routes>
  );
}

export default App;
