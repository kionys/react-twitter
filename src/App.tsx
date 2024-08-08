import { Layout } from "components/layout";
import Router from "components/router";
import { app } from "firebase-app";
import { getAuth } from "firebase/auth";

function App() {
  const auth = getAuth(app);
  console.log(auth);
  return (
    <Layout>
      <Router />
    </Layout>
  );
}

export default App;
