import AuthContext from "context/auth-context";
import { storage } from "firebase-app";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import PostsHeader from "pages/posts/posts-header";
import { useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
interface IStateProfile {
  displayName?: string | null;
  image?: string | null;
}

export default function ProfileEdit() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [state, setState] = useState<IStateProfile>({
    image: null,
    displayName: null,
  });

  useEffect(() => {
    setState({
      ...state,
      image: user?.photoURL!,
      displayName: user?.displayName!,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.photoURL, user?.displayName]);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });
  };

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setState({ ...state, image: result });
    };
  };

  const onClickDeleteImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setState({ ...state, image: null });
  };

  const onSubmitProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    let key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let newImage = null;
    e.preventDefault();

    try {
      // 기존 이미지 삭제
      // if (user?.photoURL) {
      //   const imageRef = ref(storage, user?.photoURL);
      //   await deleteObject(imageRef).catch(error => console.log(error));
      // }

      // 이미지 업로드
      if (state.image) {
        const data = await uploadString(storageRef, state.image, "data_url");
        newImage = await getDownloadURL(data?.ref);
      }

      // updateProfile 호출
      user &&
        (await updateProfile(user, {
          displayName: state.displayName || "",
          photoURL: newImage || "",
        })
          .then(() => {
            toast.success("프로필이 업데이트 되었습니다");
            navigate(`/profile`);
          })
          .catch(error => {
            console.log(error);
          }));
    } catch (e: any) {
      console.log(e);
    }
  };
  return (
    <div className="post">
      <PostsHeader />
      <form className="post-form" onSubmit={onSubmitProfile}>
        <div className="post-form__profile">
          <input
            type="text"
            name="displayName"
            className="post-form__input"
            placeholder="이름"
            value={state.displayName || ""}
            onChange={onChangeInput}
          />
          {state.image && (
            <div className="post-form__attachment">
              <img
                src={state.image}
                alt="attachment"
                width={100}
                height={100}
              />
              <button
                type="button"
                onClick={onClickDeleteImage}
                className="post-form__clear-btn"
              >
                삭제
              </button>
            </div>
          )}
          <div className="post-form__submit-area">
            <div className="post-form__image-area">
              <label htmlFor="file-input" className="post-form__file">
                <FiImage className="post-form__file-icon" />
              </label>
            </div>
            <input
              type="file"
              name="file-input"
              id="file-input"
              hidden
              accept="image/*"
              onChange={onChangeImage}
            />
            <input
              type="submit"
              value={"프로필 수정"}
              className="post-form__submit-btn"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
