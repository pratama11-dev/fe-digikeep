import { Sessions } from "types/Session";
import handleSessions from "@pages/api/GetSession";
import HeadPage from "@components/Global/Header/HeadPage";
import DashboardLayout from "@layouts/DashboardLayout";
import useNavbar from "@layouts/customHooks/useNavbar";
import { useState } from "react";
import { Button, Card, Col, Input, Row, Statistic, TablePaginationConfig } from "antd";
import { FilterValue } from "antd/es/table/interface";
import useDebounce from "@utils/helpers/customHooks/useDebounce";
import useWindowSize from "@utils/helpers/ReactHelper";
import { useDashboardCount, useDocumentQuery } from "@services/reactQuery/document";
import EventTable from "@components/Document/TableDocument";
import ModalDocument from "@components/Document/ModalDocument";
import { CheckCircleOutlined, ClockCircleOutlined, PlusOutlined } from "@ant-design/icons";
import DocumentTable from "@components/Document/TableDocument";
import { FaOutdent } from "react-icons/fa";
import getUserRole from "@utils/helpers/getUserRoles";

const activeStyle = { border: "solid 2px #402f00", borderRadius: "10px" };

const DocumentPage = (session: Sessions) => {
    useNavbar(["document"], [{ name: "Document", url: "/document" }]);
    const { isMobile } = useWindowSize();
    const role = getUserRole(session)

    const [paginationTable1, setPaginationTable1] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [actKey, setActKey] = useState<"accept" | "decline" | "created">("created");
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<Record<string, FilterValue | null>>();
    const [modal, setModal] = useState(false)
    const debouncedSearch = useDebounce(search, 500);

    const dataListEvent = useDocumentQuery({
        session: session,
        pagination: paginationTable1,
        search: debouncedSearch,
        enabled: true,
        mode: actKey,
        filters
    })

    const dataDashboard = useDashboardCount({
        session: session,
        enabled: true,
    })

    const dataList = dataListEvent?.data?.data?.data

    const renderCard = (
        title: string,
        name: string,
        value: any,
        color: string,
        prefix: React.ReactNode,
        suffix: string,
        onClick: () => void
    ) => (
        <Col span={24 / 3}>
            <Card
                loading={dataDashboard.isLoading}
                onClick={onClick}
                style={actKey === name ? activeStyle : {}}
                hoverable
            >
                <Statistic
                    title={title}
                    value={value}
                    precision={0}
                    groupSeparator="."
                    valueStyle={{ color }}
                    prefix={prefix}
                    suffix={suffix}
                />
            </Card>
        </Col>
    );

    const cards = [
        {
            title: "Outstanding",
            name: "created",
            value: dataDashboard?.data?.data?.data?.created,
            color: "#4C4B16",
            prefix: <FaOutdent />,
            suffix: "Dokumen",
            onClick: () => setActKey("created"),
        },
        {
            title: "Decline",
            name: "decline",
            value: dataDashboard?.data?.data?.data?.decline,
            color: "#4C4B16",
            prefix: <ClockCircleOutlined rev={""} />,
            suffix: "Dokumen",
            onClick: () => setActKey("decline"),
        },
        {
            title: "Accepted",
            name: "accept",
            value: dataDashboard?.data?.data?.data?.accept,
            color: "#4C4B16",
            prefix: <CheckCircleOutlined rev={""} />,
            suffix: "Dokumen",
            onClick: () => setActKey("accept"),
        },
    ];

    return (
        <>
            <HeadPage withDefaultCss title="Document" />
            <DashboardLayout session={session}>
                {role === "Super Admin" && (
                    <Row gutter={[10, 20]} style={{ marginBottom: 20 }}>
                        {cards.map((card, index) =>
                            renderCard(
                                card.title,
                                card?.name,
                                card.value,
                                card.color,
                                card.prefix,
                                card.suffix,
                                card.onClick
                            )
                        )}
                    </Row>
                )}
                <Row justify="space-between" align="middle" gutter={[10, 20]}>
                    <Col xs={20} sm={20} md={20} lg={20}>
                        <Input.Search
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title Document"
                        />
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4}>
                        <Button
                            // loading={isLoading}
                            onClick={() => { setModal(true) }}
                            block={isMobile}
                            type="primary"
                            style={{ width: "100%" }}
                            icon={<PlusOutlined rev={""} />}
                        >
                            {isMobile ? "" : "Add Document"}
                        </Button>
                    </Col>
                </Row>

                <div style={{ height: "10px" }} />

                <DocumentTable
                    session={session}
                    data={dataList ?? []}
                    loading={dataListEvent.isLoading}
                    onChange={(pg, ft) => {
                        setPaginationTable1(pg);
                        setFilters(ft);
                    }}
                    pagination={{ ...paginationTable1, total: dataListEvent?.data?.data?.total }}
                />

                <ModalDocument
                    session={session}
                    visible={modal}
                    setVisible={setModal}
                />

            </DashboardLayout>
        </>
    )
}

export async function getServerSideProps(context: any) {
    let checkSessions = await handleSessions(context);
    return checkSessions;
}

export default DocumentPage;