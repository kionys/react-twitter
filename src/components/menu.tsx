import AuthContext from "context/auth-context";
import { app } from "firebase-app";
import { getAuth, signOut } from "firebase/auth";
import useTranslation from "hooks/use-translation";
import { useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { IoMdNotifications } from "react-icons/io";
import { MdLogin, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MenuList() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const t = useTranslation();

  return (
    <div className="footer">
      <div className="footer__grid">
        <button type="button" className="" onClick={() => navigate("/")}>
          <BsHouse />
          {/* Home */}
          {t("MENU_HOME")}
        </button>
        <button type="button" className="" onClick={() => navigate("/profile")}>
          <BiUserCircle />
          {/* Profile */}
          {t("MENU_PROFILE")}
        </button>
        <button type="button" className="" onClick={() => navigate("/search")}>
          <AiOutlineSearch />
          {/* Search */}
          {t("MENU_SEARCH")}
        </button>
        <button
          type="button"
          className=""
          onClick={() => navigate("/notifications")}
        >
          <IoMdNotifications />
          {/* Notification */}
          {t("MENU_NOTI")}
        </button>
        {user === null ? (
          <button
            type="button"
            className=""
            onClick={() => navigate("/users/login")}
          >
            <MdLogin />
            {/* Login */}
            {t("MENU_LOGIN")}
          </button>
        ) : (
          <button
            type="button"
            className=""
            onClick={async () => {
              const auth = getAuth(app);
              await signOut(auth);
              toast.success(t("LOGOUT_SUCCESS"));
            }}
          >
            <MdLogout />
            {/* Logout */}
            {t("MENU_LOGOUT")}
          </button>
        )}
      </div>
    </div>
  );
}
