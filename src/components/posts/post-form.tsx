import AuthContext from "context/auth-context";
import { db, storage } from "firebase-app";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
interface IStateForm {
  content: string;
  hashtags: string[];
  hashtag: string;
  imageFile: string | null;
}
export default function PostForm() {
  const { user } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [state, setState] = useState<IStateForm>({
    content: "",
    hashtags: [],
    hashtag: "",
    imageFile: "" || null,
  });

  useEffect(() => {
    setState({ ...state, hashtag: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.hashtags?.length]);

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setState({ ...state, imageFile: result });
    };
  };

  const onClickClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setState({ ...state, imageFile: null });
  };

  // 게시글 생성
  const onSubmitForm = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);

    try {
      // 이미지 먼저 업로드
      let imageUrl = "";
      if (state.imageFile) {
        const data = await uploadString(
          storageRef,
          state.imageFile,
          "data_url",
        );
        imageUrl = await getDownloadURL(data?.ref);
      }

      // 업도드된 이미지의 download url 업데이트
      await addDoc(collection(db, "posts"), {
        content: state.content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
        hashtags: state.hashtags,
        image: imageUrl,
      });
      setState({
        ...state,
        content: "",
        hashtag: "",
        hashtags: [],
        imageFile: "",
      });
      toast.success("게시글을 생성했습니다.");
      setIsSubmitting(false);
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
      if (state.hashtags.includes(e.target.value?.trim())) {
        toast.error("같은 태그가 있습니다.");
      } else {
        setState({
          ...state,
          hashtags:
            state.hashtags.length > 0
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
          {state?.hashtags.map((hashtag, i) => (
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
        <div className="post-form__image-area">
          <label htmlFor="file-input" className="post-form__file">
            <FiImage className="post-form__file_icon" />
          </label>
          <input
            type="file"
            name="file-input"
            id="file-input"
            accept="image/*"
            onChange={onChangeImage}
            className="hidden"
          />
          {state.imageFile && (
            <div className="post-form__attachment">
              <img
                src={state.imageFile}
                alt="attachment"
                width={100}
                height={100}
              />
              <button
                className="post-form__clear-btn"
                type="button"
                onClick={onClickClearImage}
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <input
          type="submit"
          value={"Tweet"}
          className="post-form__submit-btn"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
}
