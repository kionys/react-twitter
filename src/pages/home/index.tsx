import PostBox from "components/posts/post-box";
import PostForm from "components/posts/post-form";
import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

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

export default function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  // 실시간으로 posts 컬렉션 리스트 가져오기
  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
      onSnapshot(postsQuery, snapShot => {
        let dataObj = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, []);
  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Home Title</div>
        <div className="home__tabs">
          <div className="home__tab home__tab--active">For you</div>
          <div className="home__tab home__tab">Following</div>
        </div>
      </div>
      {/* Post Form */}
      <PostForm />
      {/* Tweet Posts */}
      <div className="post">
        {posts.length > 0 ? (
          posts?.map(post => <PostBox key={post.id} post={post} />)
        ) : (
          <div className="post__no-posts">
            <div className="post__text">게시글이 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}
