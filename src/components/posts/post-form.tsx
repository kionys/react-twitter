import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import { addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
interface IStateForm {
  content: string;
}
export default function PostForm() {
  const { user } = useContext(AuthContext);
  const [state, setState] = useState<IStateForm>({
    content: "",
  });

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  // 게시글 생성
  const onSubmitForm = async (e: any) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "posts"), {
        content: state.content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
      });
      setState({ ...state, content: "" });
      toast.success("게시글을 생성했습니다.");
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
  };

  return (
    <form onSubmit={onSubmitForm} className="post-form">
      <textarea
        name="content"
        id="content"
        value={state.content}
        className="post-form__textarea"
        required
        placeholder="What is happening?"
        onChange={onChangeInput}
      />
      <div className="post-form__submit-area">
        <label htmlFor="file-input" className="post-form__file">
          <FiImage className="post-form__file_icon" />
        </label>
        <input
          type="file"
          name="file-input"
          accept="image/*"
          onChange={onChangeImage}
          className="hidden"
        />
        <input
          type="submit"
          value={"Tweet"}
          className="post-form__submit-btn"
        />
      </div>
    </form>
  );
}
