import CommentBox, { CommentProps } from "components/comments/comment-box";
import CommentForm from "components/comments/comment-form";
import Loader from "components/loader/loader";
import PostBox from "components/posts/post-box";
import { db } from "firebase-app";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../components/comments/comment.module.scss";
import PostsHeader from "./posts-header";

export default function PostDetail() {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      onSnapshot(docRef, doc => {
        setPost({ ...(doc?.data() as PostProps), id: doc.id });
      });

      setPost({ ...(docSnap?.data() as PostProps), id: docSnap?.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    params.id && getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <PostsHeader />
      {post ? (
        <>
          <PostBox post={post} />
          <CommentForm post={post} />
          <div className={styles.commentWrap}>
            {post?.comments
              ?.slice(0)
              ?.reverse()
              ?.map((data: CommentProps, i: number) => {
                return <CommentBox key={i} data={data} post={post} />;
              })}
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
