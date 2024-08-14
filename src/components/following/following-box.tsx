import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import useTranslation from "hooks/use-translation";
import { PostProps } from "pages/home";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowingProps {
  post: PostProps;
}
interface UserProps {
  id?: string;
}
export default function FollowingBox({ post }: FollowingProps) {
  const { user } = useContext(AuthContext);
  const [postFollowers, setPostFollowers] = useState<UserProps[]>([]);
  const t = useTranslation();
  const getFollowers = useCallback(async () => {
    if (post.uid) {
      const ref = doc(db, "follower", post.uid);
      onSnapshot(ref, doc => {
        const followers = doc?.data()?.users || [];
        setPostFollowers(followers);
      });
    }
  }, [post.uid]);

  useEffect(() => {
    post.uid && getFollowers();
  }, [getFollowers, post.uid]);

  const onClickFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        // 내가 주체가 되어 '팔로잉' 컬렉션 생성 or 업데이트
        const followingRef = doc(db, "following", user?.uid);
        await setDoc(
          followingRef,
          { users: arrayUnion({ id: post?.uid }) },
          { merge: true },
        );
        // 팔로우 당하는 사람이 주체가 되어 '팔로우' 컬렉션 생성 or 업데이트
        const followerRef = doc(db, "follower", post?.uid);
        await setDoc(
          followerRef,
          { users: arrayUnion({ id: user?.uid }) },
          { merge: true },
        );

        // 팔로잉 알림 생성
        await addDoc(collection(db, "notifications"), {
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          content: `${
            user?.email || user?.displayName
          }님이 팔로우를 요청했습니다.`,
          url: "#",
          isRead: false,
          uid: post?.uid,
        });

        toast.success("팔로우를 했습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickUnFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const followingRef = doc(db, "following", user?.uid);
        await updateDoc(followingRef, {
          users: arrayRemove({ id: post?.uid }),
        });

        const followerRef = doc(db, "follower", post?.uid);
        await updateDoc(followerRef, {
          users: arrayRemove({ id: user?.uid }),
        });
        toast.success("팔로우를 취소했습니다.");
      }
    } catch (e) {
      //
    }
  };
  return (
    <>
      {user?.uid !== post?.uid &&
        (postFollowers
          ?.map(follower => follower.id) // `id` 속성만 추출하여 `string[]` 배열 생성
          .includes(user?.uid) ? (
          <button
            type="button"
            className="post__following-btn"
            onClick={onClickUnFollow}
          >
            {/* 팔로잉 */}
            {t("BUTTON_FOLLOWING")}
          </button>
        ) : (
          <button
            type="button"
            className="post__follow-btn"
            onClick={onClickFollow}
          >
            {/* 팔로우 */}
            {t("BUTTON_FOLLOW")}
          </button>
        ))}
    </>
  );
}
