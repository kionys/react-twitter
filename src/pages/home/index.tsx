import PostBox from "components/posts/post-box";
import PostForm from "components/posts/post-form";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

export default function HomePage() {
  return (
    <div className="home">
      <div className="home__title">Home Title</div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">For you</div>
        <div className="home__tab home__tab">Following</div>
      </div>
      {/* Post Form */}
      <PostForm />
      {/* Tweet Posts */}
      {posts?.map(post => (
        <PostBox key={post.id} post={post} />
      ))}
    </div>
  );
}

const posts: PostProps[] = [
  {
    id: "1",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-08-08",
    uid: "12345",
  },
  {
    id: "2",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-08-08",
    uid: "12345",
  },
  {
    id: "3",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-08-08",
    uid: "12345",
  },
  {
    id: "4",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-08-08",
    uid: "12345",
  },
  {
    id: "5",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-08-08",
    uid: "12345",
  },
  {
    id: "6",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-08-08",
    uid: "12345",
  },
  {
    id: "7",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-08-08",
    uid: "12345",
  },
  {
    id: "8",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-08-08",
    uid: "12345",
  },
  {
    id: "9",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-08-08",
    uid: "12345",
  },
  {
    id: "10",
    email: "test@test.com",
    content: "내용1",
    createdAt: "2024-08-08",
    uid: "12345",
  },
];
