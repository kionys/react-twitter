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
interface IFilter {
  search: string;
}
export default function SearchPage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [filter, setFilter] = useState<IFilter>({
    search: "",
  });

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value?.trim() });
  };

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(
        postsRef,
        where("hashtags", "array-contains-any", [filter.search]),
        orderBy("createdAt", "desc"),
      );
      onSnapshot(postsQuery, snapShot => {
        let dataObj = snapShot?.docs?.map(doc => ({
          ...doc?.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [filter.search, user]);
  return (
    <div className="home__top">
      <div className="home__title">
        <div className="home__title-text">Search</div>
      </div>
      <div className="home__search-div">
        <input
          type="text"
          className="home__search"
          placeholder="해시태그 검색"
          onChange={onChangeInput}
        />
      </div>
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
