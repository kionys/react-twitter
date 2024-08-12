import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { PostProps } from "pages/home";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export interface CommentFormProps {
  post: PostProps | null;
}
interface IStateComment {
  comment: string;
}
export default function CommentForm({ post }: CommentFormProps) {
  const { user } = useContext(AuthContext);
  const [state, setState] = useState<IStateComment>({ comment: "" });

  const onChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
  };

  const onSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (post && user) {
      const postRef = doc(db, "posts", post?.id);
      const commentObj = {
        comment: state.comment,
        uid: user?.uid,
        email: user?.email,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      try {
        await updateDoc(postRef, {
          comments: arrayUnion(commentObj),
        });

        // 댓글 생성 알림 만들기
        if (user?.uid !== post?.uid) {
          await addDoc(collection(db, "notifications"), {
            createdAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            uid: post?.uid,
            isRead: false,
            url: `/posts/${post?.id}`,
            content: `${
              post?.content?.length > 10
                ? post?.content.substring(0, 10) + "..."
                : post?.content
            } 글에 댓글이 작성되었습니다.`,
          });
        }

        toast.success("댓글을 생성했습니다.");
        setState({ ...state, comment: "" });
      } catch (e: any) {
        //
      }
    }
  };
  return (
    <form className="post-form" onSubmit={onSubmitComment}>
      <textarea
        className="post-form__textarea"
        name="comment"
        id="comment"
        required
        placeholder="Wat is happening?"
        value={state.comment || ""}
        onChange={onChangeTextarea}
      />
      <div className="post-form__submit-area">
        <div />
        <input
          type="submit"
          className="post-form__submit-btn"
          value={"Comment"}
          disabled={!state.comment}
        />
      </div>
    </form>
  );
}
