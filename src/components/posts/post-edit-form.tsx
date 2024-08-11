import { db } from "firebase-app";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface IStateForm {
  content: string;
  hashtags: string[];
  hashtag: string;
}
export default function PostEditForm() {
  const navigate = useNavigate();
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [state, setState] = useState<IStateForm>({
    content: "",
    hashtags: [],
    hashtag: "",
  });

  useEffect(() => {
    setState({ ...state, hashtag: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.hashtags?.length]);

  // 게시글 상세 가져오기
  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);

      setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
      setState({
        ...state,
        content: docSnap?.data()?.content,
        hashtags: docSnap?.data()?.hashtags,
      });
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
          hashtags: state.hashtags,
        });
        setState({ ...state, content: "" });
        navigate(`/posts/${post?.id}`);
        toast.success("게시글을 수정했습니다.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
  };

  const onKeyUpHashtag = (e: any) => {
    if (e.keyCode === 32 && e.target.value?.trim() !== "") {
      // 만약 같은 태그가 있다면 에러를 띄운다.
      // 아니면 태그를 생성해준다.
      if (state.hashtags?.includes(e.target.value?.trim())) {
        toast.error("같은 태그가 있습니다.");
      } else {
        setState({
          ...state,
          hashtags:
            state.hashtags?.length > 0
              ? [...state.hashtags, state.hashtag?.trim()]
              : [state.hashtag?.trim()],
        });
      }
    }
  };

  const onClickRemoveHashTag = (tag: string) => {
    setState({
      ...state,
      hashtags: state.hashtags.filter(hashtag => {
        return hashtag !== tag;
      }),
    });
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
      <div className="post-form__hashtags">
        <span className="post-form__hashtags-outputs">
          {state?.hashtags?.map((hashtag, i) => (
            <span
              key={i}
              className="post-form__hashtags-tag"
              onClick={() => onClickRemoveHashTag(hashtag)}
            >
              #{hashtag}
            </span>
          ))}
        </span>
        <input
          type="text"
          className="post-form__input"
          name="hashtag"
          id="hashtag"
          placeholder="해시태그 + 스페이스바 입력"
          onChange={onChangeInput}
          onKeyUp={onKeyUpHashtag}
          value={state.hashtag}
        />
      </div>
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
