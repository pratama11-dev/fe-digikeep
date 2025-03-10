import useWindowSize from "@utils/helpers/ReactHelper";
import { useMemo } from "react";
import { Image } from "antd";
import themeColor from "@configs/theme/themeColor";
import { MdEditDocument } from "react-icons/md";

function ThemeBackground() {
  const windowDimension = useWindowSize();
  const isTablet = useMemo(() => {
    if (windowDimension.width) {
      return windowDimension.width! <= 768;
    }
    return false;
  }, [windowDimension]);

  return (
    <div
      style={{
        width: "100%",
        position: "absolute",
        margin: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          right: 0,
          width: "50%",
        }}
      >
        {/* <span
          style={{
            display: "block",
            backgroundColor: themeColor.signatureColor,
            width: "190%",
            height: "200vh",
            position: "absolute",
            transform: "rotateZ(-25deg)",
            top: "-50vh",
            right: "20vh",
            zIndex: -9999,
          }}
        /> */}
        <span
          style={{
            position: "absolute",
            height: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: isTablet ? "50px" : "70px",
            top: isTablet ? "-10px" : "-20px",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* <h1></h1> */}
          <Image
            src="/Images/logo.png"
            style={{
              zIndex: 1,
              width: isTablet ? "180px" : "700px",
            }}
            alt="logo login"
            preview={false}
          />
          <h1
            style={{
              padding: 0,
              letterSpacing: isTablet ? "2px" : "3.5px",
              whiteSpace: "nowrap",
              fontSize: isTablet ? "19px" : "30px",
            }}
          >
            DIGIKEEP
          </h1>
        </span>
      </div>
      <span
        style={{
          transform: "rotateZ(245deg) translateX(-50%) translateY(-50%)",
          position: "absolute",
          zIndex: -999,
        }}
      >
      </span>
    </div>
  );
}

export default ThemeBackground;
