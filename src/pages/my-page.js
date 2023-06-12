import Layout from "@/components/Layout";
import UserProfile from "@/components/UserProfile";
import FollowingUsers from "@/components/FollowingUser";
import LikedAnswers from "@/components/LikedAnswer";
import { format } from "date-fns";
import UserCalendar from "@/components/UserCalendar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";
import mbtiColors from "@/data/mbtiColors.js";
import MyAnswer from "@/components/MyAnswer.js"

const Mypage = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState();
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [popupDate, setPopupDate] = useState(null);
  const [viewTag, setViewTag] = useState("calendar");
  const [bgColor, setBgColor] = useState("#E5E7EB"); // 기본 배경색 설정

  useEffect(() => {
    async function fetchUser() {
      if (session && session.user) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserId(userRef.id);
          setUser(userDoc.data());
          setQuestionAnswers(userDoc.data().questionAnswers);

          const userMbti = userDoc.data().mbti; // 세션 유저의 mbti 가져오기
          const mbtiColor = mbtiColors[userMbti]; // mbtiColors에서 해당 mbti의 색상 가져오기

          if (mbtiColor) {
            setBgColor(mbtiColor);
          }
        }
      }
    }

    fetchUser();
  }, [session]);

  const handleDatePopup = (date) => {
    setPopupDate(date);
  };

  const ViewTagButton = ({ value }) => {
    return (
      <div className="flex flex-row">
        <button
          onClick={() => {
            setViewTag(value);
          }}
          className="mr-3 my-3 px-2 rounded bg-white/50"
        >
          {value === "calendar" ? (
            <p>달력</p>
          ) : value === "likedAnswers" ? (
            <p>좋아요한 답변</p>
          ) : value === "followingUsers" ? (
            <p>팔로우한 친구들</p>
          ) : (
            <p>invalid</p>)}
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <div style={{ backgroundColor: bgColor }} >
        <div className="bg-white/50 flex flex-row h-full">
          <div className="h-full basis-1/5 p-3 flex flex-col items-start sticky top-0">
            <h1 className="text-4xl font-bold text-primary p-3">My page</h1>
            {session && userId ? (
              <UserProfile profiledUserId={userId} />
            ) : (
              <div>로그인이 필요합니다.</div>
            )}
          </div>
          <div className="basis-4/5 flex flex-col">
            <div className="flex flex-row">
              <ViewTagButton value="calendar" />
              <ViewTagButton value="likedAnswers" />
              <ViewTagButton value="followingUsers" />
            </div>
            <div className="bg-white/50">
              {viewTag === "calendar" ? (
                <UserCalendar
                  handleDatePopup={handleDatePopup}
                  bgColor={bgColor}
                />
              ) : viewTag === "likedAnswers" ? (
                <LikedAnswers />
              ) : viewTag === "followingUsers" ? (
                <FollowingUsers />
              ) : (
                <div>Invalid viewTag</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mypage;
