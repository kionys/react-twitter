import PostBox from "components/posts/post-box";
import PostForm from "components/posts/post-form";
import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
  hashtags?: string[];
  image?: string | null;
}
type tabType = "all" | "following";
interface UserProps {
  id: string;
}
export default function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([""]);
  const [activeTab, setActiveTab] = useState<tabType>("all");
  const { user } = useContext(AuthContext);

  // 실시간 동기화로 user의 팔로잉 id 배열 가져오기
  const getFollowingIds = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, "following", user?.uid);
      onSnapshot(ref, doc => {
        setFollowingIds([""]);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setFollowingIds(prev => (prev ? [...prev, user?.id] : [])),
          );
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    user?.uid && getFollowingIds();
  }, [getFollowingIds, user?.uid]);

  // 실시간으로 posts 컬렉션 리스트 가져오기
  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
      let followingQuery = query(
        postsRef,
        where("uid", "in", followingIds),
        orderBy("createdAt", "desc"),
      );

      onSnapshot(postsQuery, snapShot => {
        let dataObj = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });

      onSnapshot(followingQuery, snapShot => {
        let dataObj = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setFollowingPosts(dataObj as PostProps[]);
      });
    }
  }, [followingIds, user]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Home</div>
        <div className="home__tabs">
          <div
            className={`home__tab ${
              activeTab === "all" && "home__tab--active"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </div>
          <div
            className={`home__tab ${
              activeTab === "following" && "home__tab--active"
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </div>
        </div>
      </div>
      {/* Post Form */}
      <PostForm />
      {/* Tweet Posts */}
      {activeTab === "all" && (
        <div className="post">
          {posts.length > 0 ? (
            posts?.map(post => <PostBox key={post.id} post={post} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      )}
      {activeTab === "following" && (
        <div className="post">
          {followingPosts.length > 0 ? (
            followingPosts?.map(post => <PostBox key={post.id} post={post} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
