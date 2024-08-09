import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import { deleteDoc, doc } from "firebase/firestore";
import { PostProps } from "pages/home";
import { useContext } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PostBoxProps {
  post: PostProps;
}
export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 게시글 삭제
  const onClickPostDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm) {
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글이 삭제되었습니다.");
      navigate("/");
    }
  };

  const onClickPostEdit = () => {};
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
              <button
                type="button"
                className="post__edit"
                onClick={onClickPostEdit}
              >
                <Link to={`/posts/edit/${post?.id}`}>수정</Link>
              </button>
            </>
          )}
          <button className="post__likes">
            <AiFillHeart />
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
