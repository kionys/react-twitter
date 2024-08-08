import { app } from "firebase-app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface IStateLogin {
  email: string;
  password: string;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [state, setState] = useState<IStateLogin>({
    email: "",
    password: "",
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
        value?.length < 8 && setError("비밀번호는 8자리 이상 입력해주세요.");
        value?.length >= 8 && setError("");
        return;

      default:
        return;
    }
  };

  const onClickSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, state.email, state.password);
      toast.success("로그인이 성공적으로 완료되었습니다.");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error.code);
    }
  };

  return (
    <>
      <form onSubmit={onClickSubmitLogin} className="form form--lg">
        <div className="form__title">로그인</div>
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

        {/* 에러가 있을 시 */}
        {error && error.length > 0 && (
          <div className="form__block">
            <div className="form__error">{error}</div>
          </div>
        )}
        <div className="form__block">
          계정이 없으신가요?
          <Link to="/users/signup" className="form__link">
            로그인하기
          </Link>
        </div>
        <div className="form__block--lg">
          <button
            type="submit"
            className="form__btn--submit"
            disabled={error?.length > 0}
          >
            로그인
          </button>
        </div>
      </form>
    </>
  );
}
