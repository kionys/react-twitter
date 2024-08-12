import { db } from "firebase-app";
import { doc, updateDoc } from "firebase/firestore";
import { INotification } from "pages/notifications";
import { useNavigate } from "react-router-dom";
import styles from "./notification.module.scss";

export default function NotificationBox({
  notification,
}: {
  notification: INotification;
}) {
  const navigate = useNavigate();

  const onClickNotification = async (url: string) => {
    // isRead 업데이트
    const ref = doc(db, "notifications", notification.id);
    await updateDoc(ref, {
      isRead: true,
    });
    // url로 이동
    navigate(url);
  };
  return (
    <div
      onClick={() => onClickNotification(notification?.url)}
      className={styles.notification}
    >
      <div className={styles.notification__flex}>
        <div className={styles.notification__createdAt}>
          {notification?.createdAt}
        </div>
        {notification?.isRead === false && (
          <div className={styles.notification__unread} />
        )}
      </div>
      <div className="notification__content">{notification.content}</div>
    </div>
  );
}
