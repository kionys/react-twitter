import { db } from "firebase-app";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface IStateForm {
  content: string;
}
export default function PostEditForm() {
  const navigate = useNavigate();
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [state, setState] = useState<IStateForm>({
    content: "",
  });

  // 게시글 상세 가져오기
  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
      setState({ ...state, content: docSnap?.data()?.content });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    params.id && getPost();
  }, [getPost, params.id]);

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  // 게시글 수정
  const onSubmitForm = async (e: any) => {
    e.preventDefault();
    try {
      if (post) {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: state.content,
        });
        setState({ ...state, content: "" });
        navigate(`/posts/${post?.id}`);
        toast.success("게시글을 수정했습니다.");
      }
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
        <input type="submit" value={"수정"} className="post-form__submit-btn" />
      </div>
    </form>
  );
}
