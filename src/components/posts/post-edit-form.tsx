import AuthContext from "context/auth-context";
import { db, storage } from "firebase-app";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import useTranslation from "hooks/use-translation";
import { PostProps } from "pages/home";
import PostsHeader from "pages/posts/posts-header";
import { useCallback, useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
interface IStateForm {
  content: string;
  hashtags: string[];
  hashtag: string;
  imageFile: string | null;
}
export default function PostEditForm() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [post, setPost] = useState<PostProps | null>(null);
  const [state, setState] = useState<IStateForm>({
    content: "",
    hashtags: [],
    hashtag: "",
    imageFile: "" || null,
  });
  const t = useTranslation();

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
        imageFile: docSnap?.data()?.image,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    params.id && getPost();
  }, [getPost, params.id]);

  // 게시글 수정
  const onSubmitForm = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    try {
      if (post) {
        // 기존 사진 지우고 새로운 사진 업로드
        if (post?.image) {
          let imageRef = ref(storage, post?.image);
          deleteObject(imageRef).catch(error => {
            console.log(error);
          });
        }

        // 새로운 파일 있다면 업로드
        let imageUrl = "";
        if (state.imageFile) {
          const data = await uploadString(
            storageRef,
            state.imageFile,
            "data_url",
          );
          imageUrl = await getDownloadURL(data?.ref);
        }

        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: state.content,
          hashtags: state.hashtags,
          image: imageUrl,
        });
        navigate(`/posts/${post?.id}`);
        toast.success("게시글을 수정했습니다.");
      }
      setState({ ...state, content: "", imageFile: null });
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
  return (
    <>
      <PostsHeader />
      <form onSubmit={onSubmitForm} className="post-form">
        <textarea
          name="content"
          id="content"
          value={state.content}
          className="post-form__textarea"
          required
          placeholder={t("POST_PLACEHOLDER")}
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
            placeholder={t("POST_HASHTAG")} // 해시태그 + 스페이스바 입력
            onChange={onChangeInput}
            onKeyUp={onKeyUpHashtag}
            value={state.hashtag}
          />
        </div>
        <div className="post-form__submit-area">
          {/* <label htmlFor="file-input" className="post-form__file">
<FiImage className="post-form__file_icon" />
</label>
<input
type="file"
name="file-input"
accept="image/*"
onChange={onChangeImage}
className="hidden"
/> */}
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
            value={"수정"}
            className="post-form__submit-btn"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </>
  );
}
