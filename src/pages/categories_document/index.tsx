import { Sessions } from "types/Session";
import handleSessions from "@pages/api/GetSession";
import HeadPage from "@components/Global/Header/HeadPage";
import DashboardLayout from "@layouts/DashboardLayout";
import useNavbar from "@layouts/customHooks/useNavbar";
import { useState } from "react";
import { Button, Col, Input, Row, TablePaginationConfig } from "antd";
import { FilterValue } from "antd/es/table/interface";
import useDebounce from "@utils/helpers/customHooks/useDebounce";
import useWindowSize from "@utils/helpers/ReactHelper";


import OrderTable from "@components/Order/OrderTicket";
import { PlusOutlined } from "@ant-design/icons";
import useFetcher from "@api/customHooks/useFetcher";
import { showSuccess } from "@utils/helpers/AntdHelper";
import { useDocumentCategoriesQuery } from "@services/reactQuery/document";


const CategoriesPage = (session: Sessions) => {
    useNavbar(["orders"], [{ name: "Orders", url: "/orders" }]);
    const { isMobile } = useWindowSize();
    const { FetcherPost, isLoading } = useFetcher(session);


    const [paginationTable1, setPaginationTable1] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<Record<string, FilterValue | null>>();
    const debouncedSearch = useDebounce(search, 500);

    const dataListCategories = useDocumentCategoriesQuery({
        session: session,
        pagination: paginationTable1,
        search: debouncedSearch,
        enabled: true,
        filters
    })

    const dataList = dataListCategories?.data?.data?.data

    const doSendEmail = async () => {
        FetcherPost({
            api: "API",
            url: `/api/email/send`,
            data: {
            }
        }).then((d) => {
            if (d.status === 200) {
                showSuccess("Success", `Berhasil menghapus Ticket`)
            }
        })
    }

    return (
        <>
            <HeadPage withDefaultCss title="Orders" />
            <DashboardLayout session={session}>
                <Row justify="space-between" align="middle" gutter={[10, 20]}>
                    <Col xs={20} sm={20} md={20} lg={20}>
                        <Input.Search
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name event"
                        />
                    </Col>
                    <Col>
                        <Button
                            onClick={() => { doSendEmail() }}
                            block={isMobile}
                            type="primary"
                            style={{ width: "100%" }}
                            icon={<PlusOutlined rev={""} />}
                        >
                            {isMobile ? "" : "Send Ticket"}
                        </Button>
                    </Col>
                </Row>

                <div style={{ height: "10px" }} />

                {/* <OrderTable
                    session={session}
                    data={dataList ?? []}
                    loading={dataListCategories.isLoading}
                    onChange={(pg, ft) => {
                        setPaginationTable1(pg);
                        setFilters(ft);
                    }}
                    pagination={{ ...paginationTable1, total: dataListCategories?.data?.data?.total }}
                /> */}
            </DashboardLayout>
        </>
    )
}

export async function getServerSideProps(context: any) {
    let checkSessions = await handleSessions(context);
    return checkSessions;
}

export default CategoriesPage;