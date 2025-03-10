import { showError, showSuccess } from "@utils/helpers/AntdHelper";
import { PushNavigateTo, ReplaceNavigateTo } from "@utils/helpers/Route";
import { message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Sessions } from "types/Session";
import useFetcher from "./useFetcher";

const useAuth = (session?: Sessions) => {
  const [isLoading, setLoading] = useState({
    restore: false,
    login: false,
    google: false,
    logout: false,
  });
  const [isError, setError] = useState<any | undefined>(undefined);
  const { FetcherPost, FetcherGet } = useFetcher(session ?? {});
  const router = useRouter();
  const { code } = router?.query ? router.query : { code: "2" };

  // const handleLoginGoogle = async () => {
  //   setError("");
  //   setLoading((prev) => ({ ...prev, google: true }));
  //   try {
  //     const url = await FetcherPost({
  //       url: `/public/v1/request-oauth-google`,
  //       api: "SSO",
  //       data: {
  //         client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  //       },
  //     });
  //     if (url?.data?.data) {
  //       window.location.href = url.data.data;
  //     }
  //     return true;
  //   } catch (error: any) {
  //     const info = error?.response?.data?.message ?? error?.message;
  //     showError("error", info);
  //     setError(error);
  //     return { ...info };
  //   } finally {
  //     setLoading((prev) => ({ ...prev, google: false }));
  //   }
  // };

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setError("");
    setLoading((prev) => ({ ...prev, login: true }));
    try {
      const accessToken = await FetcherPost({
        url: `/public/v1/login`,
        api: "SSO",
        data: {
          email,
          password,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        },
      });
      // Delete {status: 200 } to remove by pass
      const setCookie = await FetcherPost({
        url: `/api/set-cookie`,
        api: "CUSTOM",
        data: {
          token: accessToken?.data?.token,
          refresh_token: accessToken?.data?.refreshToken,
        },
      });
      if (setCookie.status === 200) {
        window.localStorage.setItem(
          "pg-sso-rt",
          accessToken?.data?.refreshToken
        );
        message
          .success("Sign complete. Taking you to your dashboard!", 1)
          .then(() => ReplaceNavigateTo("/"));
        return true;
      }
      return false;
    } catch (error: any) {
      const info = error?.response?.data?.message ?? error?.message;
      showError("error", info);
      setError(error);
      return { ...info };
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  };

  const handleLogout = async () => {
    setError("");
    setLoading((prev) => ({ ...prev, logout: true }));
    try {
      const logout = await FetcherGet({ url: "/public/v1/logout", api: "CUSTOM" });
      if (logout?.data?.code === 0) {
        window.localStorage.clear();
        ReplaceNavigateTo("/login?code=1");
        return true;
      }
      return false;
    } catch (error: any) {
      const info = error?.response?.data?.message ?? error?.message;
      showError("error", info);
      setError(error);
      return { ...info };
    } finally {
      setLoading((prev) => ({ ...prev, logout: false }));
    }
  };

  const tryRestoreSessionUseRefreshToken = async () => {
    // get refresh token
    const refreshToken = window.localStorage.getItem("pg-sso-rt");
    if (!refreshToken) {
      return false;
    }
    // hit refresh
    const accessToken = await FetcherPost({
      url: `/public/v1/refresh-token`,
      api: "SSO",
      data: {
        refreshToken,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      },
    });
    if (accessToken.status !== 200) {
      return false;
    }
    const setCookie = await FetcherPost({
      url: `/api/set-cookie`,
      api: "CUSTOM",
      data: {
        token: accessToken?.data?.token,
        refresh_token: refreshToken,
      },
    });
    if (setCookie.status === 200) {
      return true;
    }
    return false;
  };

  const restore = async () => {
    try {
      setLoading((prev) => ({ ...prev, restore: true }));
      const restores = await tryRestoreSessionUseRefreshToken();
      if (restores) {
        showSuccess("Success!", "Your Session has been restored");
        PushNavigateTo("/");
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, restore: false }));
    }
  };

  useEffect(() => {
    // console.log("1");
    if (code === "2") {
      showError("Error!", "Sessions expired!");
      restore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const property = {
    handleLogin,
    // handleLoginGoogle,
    handleLogout,
    restore,
    isLoading,
    isError,
    setError,
  };

  return property;
};

export default useAuth;
