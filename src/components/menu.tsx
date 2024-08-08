import AuthContext from "context/auth-context";
import { app } from "firebase-app";
import { getAuth, signOut } from "firebase/auth";
import { useContext } from "react";
import { BiUserCircle } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { MdLogin, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MenuList() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" className="" onClick={() => navigate("/")}>
          <BsHouse />
          Home
        </button>
        <button type="button" className="" onClick={() => navigate("/profile")}>
          <BiUserCircle />
          Profile
        </button>
        {user === null ? (
          <button
            type="button"
            className=""
            onClick={() => navigate("/users/login")}
          >
            <MdLogin />
            Login
          </button>
        ) : (
          <button
            type="button"
            className=""
            onClick={async () => {
              const auth = getAuth(app);
              await signOut(auth);
              toast.success("로그아웃 되었습니다.");
            }}
          >
            <MdLogout />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
