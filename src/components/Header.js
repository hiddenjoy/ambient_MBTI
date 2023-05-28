import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/index.js";

const Header = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (session) {
        const userRef = doc(db, "users", session.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    }

    fetchUser();
  }, [session]);

  let isLogin = false;
  return (
    <>
      <div className="flex items-center justify-between bg-lime-200 p-3 sticky top-0 text-black">
        <Link
          href="/"
          className="text-xl font-bold text-center text-primary border-4 ml-4 p-3"
        >
          Ambient MBTI
        </Link>
        <div>
          {isLogin ? (
            <div>
              <Link
                href="./auth/signin"
                className="text-base font-bold text-center text-primary border-4 ml-4 p-3"
              >
                로그아웃
              </Link>
              <Link
                href="/my-page"
                className="text-base font-bold text-center text-primary border-4 ml-4 p-3"
              >
                마이페이지
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="./auth/signin"
                className="text-base font-bold text-center text-primary border-4 ml-4 p-3"
              >
                로그인
              </Link>
              <Link
                href="/my-page"
                className="text-base font-bold text-center text-primary border-4 ml-4 p-3"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
