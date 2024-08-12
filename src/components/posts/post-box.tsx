import AuthContext from "context/auth-context";
import { db, storage } from "firebase-app";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
interface PostBoxProps {
  post: PostProps;
}
export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const imageRef = ref(storage, post?.image!);

  // 게시글 삭제
  const onClickPostDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm) {
      // 스토리지 이미지 먼저 삭제
      if (post?.image) {
        deleteObject(imageRef).catch(error => {
          console.log(error);
        });
      }

      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글이 삭제되었습니다.");
      navigate("/");
    }
  };

  const onClickToggleLike = async () => {
    const postRef = doc(db, "posts", post.id);

    // 사용자가 좋아요를 미리 한 경우 => 좋아요 취소
    if (user?.uid && post?.likes?.includes(user?.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
      });
    } else {
      // 사용자가 좋아요를 하지 않은 경우 => 좋아요 추가
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount! + 1,
      });
    }
  };
  return (
    <div className="post">
      <div className="post__box" key={post?.id}>
        <Link to={`/posts/${post?.id}`}>
          <div className="post__box-profile">
            <div className="post__flex">
              {post?.profileUrl ? (
                <img
                  src={post?.profileUrl}
                  alt="profile"
                  className="post__box-profile-img"
                />
              ) : (
                <FaUserCircle className="post__box-profile-icon" />
              )}
              <div className="post__email">{post?.email}</div>
              <div className="post__createdAt">{post?.createdAt}</div>
            </div>
            <div className="post__box-content">{post?.content}</div>
            {post?.image && (
              <div className="post__image-div">
                <img
                  src={post?.image}
                  alt="post img"
                  className="post__image"
                  width={100}
                  height={100}
                />
              </div>
            )}
            <div className="post-form__hashtags-outputs">
              {post?.hashtags?.map((hashtag, i) => (
                <span key={i} className="post-form__hashtags-tag">
                  #{hashtag}
                </span>
              ))}
            </div>
          </div>
        </Link>
        <div className="post__box-footer">
          {/* post.uid === user.uid 일 때 */}
          {user?.uid === post?.uid && (
            <>
              <button
                type="button"
                className="post__delete"
                onClick={onClickPostDelete}
              >
                삭제
              </button>
              <button type="button" className="post__edit">
                <Link to={`/posts/edit/${post?.id}`}>수정</Link>
              </button>
            </>
          )}
          <button className="post__likes" onClick={onClickToggleLike}>
            {user && post?.likes?.includes(user.uid) ? (
              <AiFillHeart />
            ) : (
              <AiOutlineHeart />
            )}
            {post?.likeCount || 0}
          </button>
          <button className="post__comments">
            <FaRegComment />
            {post?.comments?.length || 0}
          </button>
        </div>
      </div>
    </div>
  );
}
