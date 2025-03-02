import useAuth from "@api/customHooks/useAuth";
import BreadcrumbOur from "@components/Global/Breadcrumb";
import Header from "@components/Global/Header/Header";
import MobileSidebar from "@components/Global/MobileSidebar";
import Sidebar from "@components/Global/Sidebar";
import { AdminRoutes } from "@configs/route/SidebarRoute";
import themeColor from "@configs/theme/themeColor";
import useWindowSize from "@utils/helpers/ReactHelper";
import { isNotDashboard } from "@utils/helpers/Route";
import { Avatar, Col, Drawer, Dropdown, Layout, Menu, Row } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState } from "react";
import FadeIn from "react-fade-in";
import { Sessions } from "types/Session";

const { Content, Footer } = Layout;

type DashboardLayoutProps = {
  children: React.ReactNode;
  session: Sessions;
  background?: string;
};

function DashboardLayout({
  children,
  session,
  background = "",
}: DashboardLayoutProps) {
  const router = useRouter();
  const { handleLogout } = useAuth();

  const { isMobile } = useWindowSize();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const menuDesktop = (
    <Menu onClick={handleLogout}>
      <Menu.Item>Signout</Menu.Item>
    </Menu>
  );

  return (
    <Layout hasSider={session?.code === 0}>
      {session?.code === 0 && !isNotDashboard(router) && (
        <>
          {isMobile ? (
            <>
              <Drawer
                placement="right"
                // title={"Menu"}
                title={
                  <Row justify={"space-between"}>
                    <Col span={8} style={{ alignSelf: "center" }}>
                      <h3 style={{ margin: 0 }}>Menu</h3>
                    </Col>
                    <Col span={16}>
                      <Dropdown overlay={menuDesktop}>
                        <Row
                          gutter={[10, 10]}
                          style={{
                            marginTop: isNotDashboard(router) ? "-14px" : "0px",
                          }}
                          align="middle"
                          justify="end"
                        >
                          <Col xs={16} sm={16} md={16} lg={16}>
                            <p
                              id="headerPeopleName"
                              style={{
                                marginTop: "6px",
                                color: isNotDashboard(router)
                                  ? themeColor.white
                                  : themeColor.darkBlueSecondary,
                                fontWeight: "bold",
                                textAlign: "end",
                                lineHeight: "15px",
                                marginBottom: "0px"
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
                                textAlign: "end",
                                marginTop: "5px",
                                fontSize: "10px",
                                lineHeight: "15px",
                              }}
                            >
                              {session?.data?.data?.user_role?.role}
                            </p>
                          </Col>
                          <Col xs={4} sm={4} md={4} lg={4}>
                            <Avatar
                              className="mx-4 my-auto pointer"
                              src="/Images/avatar.png"
                            />
                          </Col>
                        </Row>
                      </Dropdown>
                    </Col>
                  </Row>
                }
                closable={true}
                // width={200}
                onClose={toggleDrawer}
                visible={drawerVisible}
              >
                <MobileSidebar _session={session} routes={AdminRoutes} />
              </Drawer>
            </>
          ) : (
            <>
              <Sidebar _session={session} routes={AdminRoutes} />
            </>
          )}
        </>
      )}
      <Layout
        className="site-layout"
        style={{
          backgroundColor: themeColor.signatureColor3,
        }}
      >
        <FadeIn>
          <Header
            session={session}
            toggleDrawer={toggleDrawer}
          />

          <div
            style={{
              margin: "0 16px",
            }}
          >
            {session?.code === 0 ? (
              <BreadcrumbOur />
            ) : (
              <div style={{ height: "32px" }} />
            )}

            <Content
              className="site-layout-background"
              style={{
                background,
                overflowX: isMobile ? "hidden" : "scroll",
                padding: isMobile || background ? 10 : 24,
                // minHeight: 360,
                borderRadius: 8,
              }}
            >
              {children}
            </Content>
          </div>

          <Footer style={{ textAlign: "center" }}>
            DIGIKEEP ©
            {' '}
            {moment().year()}
          </Footer>
        </FadeIn>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;
