import { FiImage } from "react-icons/fi";
export default function PostForm() {
  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  };
  return (
    <form action="" className="post-form">
      <textarea
        name="content"
        id="content"
        className="post-form__textarea"
        required
        placeholder="What is happening?"
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
