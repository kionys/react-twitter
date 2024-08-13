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
          <span className="footer__grid--text">{t("MENU_HOME")}</span>
        </button>
        <button type="button" className="" onClick={() => navigate("/profile")}>
          <BiUserCircle />
          {/* Profile */}
          <span className="footer__grid--text">{t("MENU_PROFILE")}</span>
        </button>
        <button type="button" className="" onClick={() => navigate("/search")}>
          <AiOutlineSearch />
          {/* Search */}
          <span className="footer__grid--text">{t("MENU_SEARCH")}</span>
        </button>
        <button
          type="button"
          className=""
          onClick={() => navigate("/notifications")}
        >
          <IoMdNotifications />
          {/* Notification */}

          <span className="footer__grid--text">{t("MENU_NOTI")}</span>
        </button>
        {user === null ? (
          <button
            type="button"
            className=""
            onClick={() => navigate("/users/login")}
          >
            <MdLogin />
            {/* Login */}
            <span className="footer__grid--text">{t("MENU_LOGIN")}</span>
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
            <span className="footer__grid--text">{t("MENU_LOGOUT")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
