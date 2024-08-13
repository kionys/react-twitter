import { languageState } from "atom";
import PostBox from "components/posts/post-box";
import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import useTranslation from "hooks/use-translation";
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

const PROFILE_DEFAULT_URL = "/logo512.png";
type TabType = "my" | "like";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("my");
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [language, setLanguage] = useRecoilState(languageState);
  const t = useTranslation();
  console.log(language);

  // 실시간으로 posts 컬렉션 리스트 가져오기
  useEffect(() => {
    if (user) {
      switch (activeTab) {
        // My Post List
        case "my":
          let mypPostsRef = collection(db, "posts");
          const myPostQuery = query(
            mypPostsRef,
            where("uid", "==", user?.uid),
            orderBy("createdAt", "desc"),
          );
          onSnapshot(myPostQuery, snapShot => {
            let dataObj = snapShot.docs.map(doc => ({
              ...doc.data(),
              id: doc?.id,
            }));
            setMyPosts(dataObj as PostProps[]);
          });
          return;

        // Like Post List
        case "like":
          let likePostsRef = collection(db, "posts");
          const likePostQuery = query(
            likePostsRef,
            where("likes", "array-contains", user?.uid),
            orderBy("createdAt", "desc"),
          );

          onSnapshot(likePostQuery, snapShot => {
            let dataObj = snapShot.docs.map(doc => ({
              ...doc.data(),
              id: doc?.id,
            }));
            setLikePosts(dataObj as PostProps[]);
          });
          return;

        default:
          return;
      }
    }
  }, [user, activeTab]);

  const onClickLangauge = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLanguage(language === "ko" ? "en" : "ko");
    localStorage.setItem("language", language === "ko" ? "en" : "ko");
  };
  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">{t("MENU_PROFILE")}</div>
        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFAULT_URL}
            alt="profile"
            className="profile__image"
            width={100}
            height={100}
          />
          <div className="profile__flex">
            <button
              type="button"
              className="profile__btn"
              onClick={() => navigate("/profile/edit")}
            >
              {/* 프로필 수정 */}
              {t("BUTTON_EDIT_PROFILE")}
            </button>

            <button
              type="button"
              className="profile__btn--langauge"
              onClick={onClickLangauge}
            >
              {language === "ko" ? "한국어" : "English"}
            </button>
          </div>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || "사용자님"}</div>
          <div className="profile__email">{user?.email}</div>
        </div>
        <div className="home__tabs">
          <div
            className={`home__tab ${
              activeTab === "my" && "home__tab home__tab--active"
            }`}
            onClick={() => setActiveTab("my")}
          >
            {/* For you */}
            {t("TAB_ALL")}
          </div>
          <div
            className={`home__tab ${
              activeTab === "like" && "home__tab home__tab--active"
            }`}
            onClick={() => setActiveTab("like")}
          >
            {/* Likes */}
            {t("TAB_LIKES")}
          </div>
        </div>
        {activeTab === "my" ? (
          <div className="post">
            {myPosts?.length > 0 ? (
              myPosts?.map((post, i) => <PostBox key={i} post={post} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">
                  {/* 게시글이 없습니다. */}
                  {t("NO_POSTS")}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === "like" ? (
          <div className="post">
            {likePosts?.length > 0 ? (
              likePosts?.map((post, i) => <PostBox key={i} post={post} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">
                  {/* 게시글이 없습니다. */}
                  {t("NO_POSTS")}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
