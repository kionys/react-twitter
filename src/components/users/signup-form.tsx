import { app } from "firebase-app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface IStateSignup {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function SignupForm() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [state, setState] = useState<IStateSignup>({
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setState({ ...state, [name]: value });

    switch (name) {
      case "email":
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        !value?.match(regex) && setError("이메일 형식이 올바르지 않습니다.");
        value?.match(regex) && setError("");
        return;

      case "password":
        value !== state.passwordConfirmation &&
          setError("비밀번호와 비밀번호 확인 값이 다릅니다.");
        value?.length < 8 && setError("비밀번호는 8자리 이상 입력해주세요.");
        value?.length >= 8 && setError("");
        return;

      case "passwordConfirmation":
        state.password !== value &&
          setError("비밀번호와 비밀번호 확인 값이 다릅니다.");
        value?.length < 8 && setError("비밀번호는 8자리 이상 입력해주세요.");
        value?.length >= 8 && setError("");
        return;

      default:
        return;
    }
  };

  const onClickSubmitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, state.email, state.password);
      toast.success("회원가입이 성공적으로 완료되었습니다.");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.code);
    }
  };

  const onClickSocialLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;

    let provider: any;
    const auth = getAuth(app);

    switch (name) {
      case "google":
        provider = new GoogleAuthProvider();
        break;
      case "github":
        provider = new GithubAuthProvider();
        break;
      default:
        return;
    }

    try {
      await signInWithPopup(
        auth,
        provider as GithubAuthProvider | GoogleAuthProvider,
      )
        .then(result => {
          console.log(result);
          console.log("User Info:", result.user);
          navigate("/");
          toast.success("로그인 되었습니다.");
        })
        .catch(error => {
          const errorMessage = error?.message;
          toast.error(errorMessage);
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <form onSubmit={onClickSubmitSignup} className="form form--lg">
        <div className="form__title">회원가입</div>
        <div className="form__block">
          <label htmlFor="email">이메일</label>
          <input
            type="text"
            name="email"
            id="email"
            required
            value={state.email}
            onChange={onChangeInput}
          />
        </div>
        <div className="form__block">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={state.password}
            onChange={onChangeInput}
          />
        </div>
        <div className="form__block">
          <label htmlFor="passwordConfirmation">비밀번호 확인</label>
          <input
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            required
            value={state.passwordConfirmation}
            onChange={onChangeInput}
          />
        </div>
        {/* 에러가 있을 시 */}
        {error && error.length > 0 && (
          <div className="form__block">
            <div className="form__error">{error}</div>
          </div>
        )}
        <div className="form__block">
          계정이 있으신가요?
          <Link to="/users/login" className="form__link">
            로그인하기
          </Link>
        </div>
        <div className="form__block--lg">
          <button
            type="submit"
            className="form__btn--submit"
            disabled={error?.length > 0}
          >
            회원가입
          </button>
        </div>
        <div className="form__block--lg">
          <button
            type="button"
            name="google"
            className="form__btn--google"
            onClick={onClickSocialLogin}
          >
            Google로 회원가입
          </button>
        </div>
        <div className="form__block--lg">
          <button
            type="button"
            name="github"
            className="form__btn--github"
            onClick={onClickSocialLogin}
          >
            Github로 회원가입
          </button>
        </div>
      </form>
    </>
  );
}
