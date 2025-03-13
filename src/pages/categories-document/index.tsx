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
import { PlusOutlined } from "@ant-design/icons";
import { useDocumentCategoriesQuery } from "@services/reactQuery/document";
import CategoriesDocumentTable from "@components/Document/TableDocumentCategories";
import ModalCategories from "@components/Categories/ModalCategories";


const CategoriesPage = (session: Sessions) => {
    useNavbar(["categories-document"], [{ name: "Categories Document", url: "/categories-document" }]);
    const { isMobile } = useWindowSize();

    const [paginationTable1, setPaginationTable1] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(false)
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

    return (
        <>
            <HeadPage withDefaultCss title="Orders" />
            <DashboardLayout session={session}>
                <Row justify="space-between" align="middle" gutter={[10, 20]}>
                    <Col xs={19} sm={19} md={19} lg={19}>
                        <Input.Search
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name categories"
                        />
                    </Col>
                    <Col xs={5} sm={5} md={5} lg={5}>
                        <Button
                            onClick={() => { setModal(true) }}
                            block={isMobile}
                            type="primary"
                            style={{ width: "100%" }}
                            icon={<PlusOutlined rev={""} />}
                        >
                            {isMobile ? "" : "Add Categories"}
                        </Button>
                    </Col>
                </Row>

                <div style={{ height: "10px" }} />

                <CategoriesDocumentTable
                    session={session}
                    data={dataList ?? []}
                    loading={dataListCategories.isLoading}
                    onChange={(pg, ft) => {
                        setPaginationTable1(pg);
                        setFilters(ft);
                    }}
                    pagination={{ ...paginationTable1, total: dataListCategories?.data?.data?.total }}
                />

                <ModalCategories 
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

export default CategoriesPage;