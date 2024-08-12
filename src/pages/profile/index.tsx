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
import { PostProps } from "pages/home";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PROFILE_DEFAULT_URL = "/logo512.png";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"my" | "like">("my");
  const [myPosts, setMyPosts] = useState<PostProps[]>([]);
  const [likePosts, setLikePosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Profile</div>
        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFAULT_URL}
            alt="profile"
            className="profile__image"
            width={100}
            height={100}
          />
          <button
            type="button"
            className="profile__btn"
            onClick={() => navigate("/profile/edit")}
          >
            프로필 수정
          </button>
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
            For you
          </div>
          <div
            className={`home__tab ${
              activeTab === "like" && "home__tab home__tab--active"
            }`}
            onClick={() => setActiveTab("like")}
          >
            Likes
          </div>
        </div>
        {activeTab === "my" ? (
          <div className="post">
            {myPosts?.length > 0 ? (
              myPosts?.map((post, i) => <PostBox key={i} post={post} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">게시글이 없습니다.</div>
              </div>
            )}
          </div>
        ) : activeTab === "like" ? (
          <div className="post">
            {likePosts?.length > 0 ? (
              likePosts?.map((post, i) => <PostBox key={i} post={post} />)
            ) : (
              <div className="post__no-posts">
                <div className="post__text">게시글이 없습니다.</div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
