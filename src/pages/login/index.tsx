import React from "react";
import handleSessions from "@pages/api/GetSession";
import ThemeBackground from "@components/Login/ThemeBackground";
import LoginForm from "@components/Login/LoginForm";
import { Sessions } from "types/Session";
import HeadPage from "@components/Global/Header/HeadPage";

export default function LoginPage(session: Sessions) {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <HeadPage title="Digikeep Login Page" />
      <ThemeBackground />
      <LoginForm session={session} style={{ width: "100%" }} />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const checkSessions = await handleSessions(context, false, true);
  return checkSessions;
}
