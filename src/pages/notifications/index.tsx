import NotificationBox from "components/notifications/notification-box";
import AuthContext from "context/auth-context";
import { db } from "firebase-app";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

export interface INotification {
  id: string;
  uid: string;
  url: string;
  isRead: boolean;
  content: string;
  createdAt: string;
}
export default function NotificationsPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    if (user) {
      let ref = collection(db, "notifications");
      let notificationQuery = query(
        ref,
        where("uid", "==", user?.uid),
        orderBy("createdAt", "desc"),
      );
      onSnapshot(notificationQuery, snapShot => {
        let dataObj = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        setNotifications(dataObj as INotification[]);
      });
    }
  }, [user]);

  console.log(notifications);
  return (
    <>
      <div className="home">
        <div className="home__top">
          <div className="home__title">
            <div className="home__title-text">Notification</div>
          </div>
        </div>
        <div className="post">
          {notifications?.length > 0 ? (
            notifications?.map(notification => {
              return (
                <NotificationBox
                  key={notification.id}
                  notification={notification}
                />
              );
            })
          ) : (
            <div className="post__no-posts">
              <div className="post__text">알림이 없습니다.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
