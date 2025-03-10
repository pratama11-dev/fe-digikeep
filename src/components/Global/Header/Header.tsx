import { MenuOutlined, StarOutlined } from "@ant-design/icons";
import useAuth from "@api/customHooks/useAuth";
import themeColor from "@configs/theme/themeColor";
import useWindowSize from "@utils/helpers/ReactHelper";
import { isNotDashboard } from "@utils/helpers/Route";
import { Avatar, Button, Col, Dropdown, Menu, Row, Tag } from "antd";
import { Header } from "antd/lib/layout/layout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Sessions } from "types/Session";

type HeaderProps = {
  session: Sessions;
  toggleDrawer: () => void;
};

function HeaderOur({ session, toggleDrawer }: HeaderProps) {
  const router = useRouter();
  const { handleLogout } = useAuth();
  const { isMobile } = useWindowSize();

  const menuDesktop = (
    <Menu onClick={handleLogout}>
      <Menu.Item>Signout</Menu.Item>
    </Menu>
  );
  const logoTextStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    color: themeColor.fontPrimary,
    marginTop: "4px",
  };
  const loginTextStyle = {
    fontSize: "14px",
    fontWeight: 600,
    color: themeColor.fontPrimary,
    cursor: "pointer",
  };
  return (
    <>
      {session?.code === 0 && (
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: isMobile ? themeColor.darkBlue : "transparent",
            // background: isNotDashboard(router)
            //   ? themeColor.headerPrimary
            //   : themeColor.light,
            height: "70px",
          }}
        >
          <Row>
            <Col xs={14} sm={14} md={14} lg={14} >
              <h3 style={{ paddingLeft: 10, lineHeight: "25px", color: !isMobile ? "#000" : "#fff" }}>
                DIGIKEEP
              </h3>
            </Col>
            <Col xs={10} sm={10} md={10} lg={10} >
              <Row
                style={{ width: "100%" }}
                align="middle"
                justify={isNotDashboard(router) ? "space-between" : "end"}
              >
                {isNotDashboard(router) && (
                  <Link href="/dashboard" passHref>
                    <Row style={{ cursor: "pointer" }}>
                      <div className="logo">
                        <Image
                          src="/Images/logo.png"
                          alt="logo"
                          height="40px"
                          width="40px"
                        />
                      </div>
                      <p id="headerTittle" style={logoTextStyle}>
                        {process.env.NEXT_PUBLIC_APPNAME ?? "PG"}
                      </p>
                    </Row>
                  </Link>
                )}
                {!isMobile ? (
                  <Dropdown overlay={menuDesktop}>
                    <Row
                      style={{
                        marginTop: isNotDashboard(router) ? "-14px" : "0px",
                        width: "220px",
                      }}
                      align="middle"
                      justify="end"
                    >
                      <Col xs={4} sm={4} md={4} lg={4}>
                        <Avatar
                          className="mx-4 my-auto pointer"
                          src="/Images/avatar.png"
                        />
                      </Col>
                      <Col xs={18} sm={18} md={18} lg={16}>
                        <p
                          id="headerPeopleName"
                          style={{
                            marginTop: "6px",
                            color: isNotDashboard(router)
                              ? themeColor.white
                              : themeColor.darkBlueSecondary,
                            fontWeight: "bold",
                            textAlign: "center",
                            lineHeight: "15px",
                            marginBottom: "0px",
                          }}
                        >
                          {session?.data?.user?.name}
                        </p>
                        <p
                          id="headerPeopleName"
                          style={{
                            margin: "0px 0px",
                            color: isNotDashboard(router)
                              ? themeColor.white
                              : themeColor.darkBlueSecondary,
                            fontWeight: "normal",
                            textAlign: "center",
                            marginTop: "5px",
                            fontSize: "10px",
                            lineHeight: "15px",
                          }}
                        >
                          {session?.data?.data?.user_role?.role}
                        </p>
                      </Col>
                      <Col xs={4} sm={4} md={4} lg={4}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          style={{ marginRight: "10px" }}
                          src="/Icon/header/arrow-down-blue.svg"
                          alt="dropdown"
                        />
                      </Col>
                    </Row>
                  </Dropdown>
                ) : (
                  <Button
                    type="link"
                    icon={<MenuOutlined rev={""} />}
                    style={{ margin: 10, color: "#fff" }}
                    onClick={toggleDrawer}
                  />
                )}
              </Row>
            </Col>
          </Row>
        </Header>
      )}
      {session?.code === -1 && (
        <Header
          className="site-layout-background"
          style={{ padding: 0, background: themeColor.headerPrimary }}
        >
          <Row align="middle" justify="space-between">
            <Col xs={12} sm={12} md={12} lg={12}>
              <Row align="middle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  style={{
                    marginRight: "10px",
                    marginBottom: "10px",
                    marginLeft: "20px",
                  }}
                  src="/Images/logo.png"
                  alt="tesanjay"
                  height="40px"
                  width="40px"
                />
                <p id="headerTittle" style={logoTextStyle}>
                  SSO PIL
                </p>
              </Row>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <div style={{ float: "right", marginRight: "20px" }}>
                <Link href="/login" passHref>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a>
                    <p id="login-CTA" style={loginTextStyle}>
                      Sign In
                    </p>
                  </a>
                </Link>
              </div>
            </Col>
          </Row>
        </Header>
      )}
    </>
  );
}

export default HeaderOur;
