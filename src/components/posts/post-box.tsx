import { PostProps } from "pages/home";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

interface PostBoxProps {
  post: PostProps;
}
export default function PostBox({ post }: PostBoxProps) {
  const onClickPostDelete = () => {};
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
