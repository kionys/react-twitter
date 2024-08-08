import { Layout } from "components/layout";
import Loader from "components/loader/loader";

import Router from "components/router";
import { app } from "firebase-app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const auth = getAuth(app);
  const [init, setInit] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    auth.currentUser ? true : false,
  );

  useEffect(() => {
    // 인증 상태 감지
    onAuthStateChanged(auth, user => {
      user && setIsAuthenticated(true);
      !user && setIsAuthenticated(false);
    });
    setInit(true);
  }, [auth]);

  return (
    <Layout>
      <ToastContainer
        theme="dark"
        autoClose={1000}
        hideProgressBar
        newestOnTop
      />
      {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
    </Layout>
  );
}

export default App;
