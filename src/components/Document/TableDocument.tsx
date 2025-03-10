import handleSessions from "@pages/api/GetSession";
import { Button, Popconfirm, Switch, Table, TableProps, Tag } from "antd";
import { Sessions } from "types/Session";
import { IDocument } from "types/document/index";
import customFooterPagination from "@components/Partial/customFooterPagination";
import moment from "moment";
import getUserRole from "@utils/helpers/getUserRoles";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ModalDocument from "./ModalDocument";
import { useState } from "react";
import useFetcher from "@api/customHooks/useFetcher";
import { showSuccess } from "@utils/helpers/AntdHelper";
import { useQueryClient } from "@tanstack/react-query";

interface ITableDocument {
    session: Sessions | undefined;
    data?: IDocument[];
    pagination: { current?: number | undefined; pageSize?: number | undefined; total?: number | undefined };
    loading?: boolean;
    onChange?: TableProps<IDocument>["onChange"];
}

const DocumentTable = ({
    session,
    data,
    pagination,
    loading,
    onChange,
}: ITableDocument) => {
    const role = getUserRole(session)
    const { FetcherPost, isLoading } = useFetcher(session);
    const uq = useQueryClient();

    const [modal, setModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IDocument>()

    const onDelete = async (id: number) => {
        const data = await FetcherPost({
            url: "/api/document/delete",
            api: "API",
            data: {
                id
            }
        })
        if (data.status === 200) {
            showSuccess("Berhasil!", `berhasil menghapus data`)
            uq.invalidateQueries(['useDocumentQuery'])
        }
    }

    return (
        <>
            <Table
                dataSource={data}
                pagination={pagination}
                onChange={onChange}
                loading={loading}
                rowKey={(d) => d?.id ?? "x"}
                scroll={{
                    x: true,
                }}
                footer={customFooterPagination(pagination)}
            >
                <Table.Column
                    title="No"
                    key="index"
                    dataIndex="index"
                    width="5%"
                    render={(value, item, index) => {
                        if (pagination) {
                            return (
                                ((pagination?.current ?? 1) - 1) *
                                (pagination?.pageSize ?? 10) +
                                index +
                                1
                            );
                        } else {
                            return index + 1;
                        }
                    }}
                />
                <Table.Column
                    title="Title"
                    dataIndex="name"
                    render={(_value, item: IDocument) => item?.title ?? "-"}
                />
                <Table.Column
                    title="Created Date"
                    dataIndex="doc_date"
                    render={(_value, item: IDocument) => moment(item?.created_at).format("DD MMMM YYYY")}
                />
                <Table.Column
                    title="Status"
                    dataIndex="status"
                    render={(_value, item: IDocument) => {
                        if (item?.id_status === 1) {
                            return <Tag color="green">{item?.document_status?.status}</Tag>
                        } else {
                            return <Tag color="red">{item?.document_status?.status}</Tag>
                        }
                    }}
                />
                <Table.Column
                    title="Action"
                    dataIndex="Action"
                    render={(_value, item: IDocument) => (
                        <>
                            <Button
                                type="link"
                                icon={<EditOutlined rev={""} />}
                                onClick={() => {
                                    setSelectedData(item)
                                    setModal(true)
                                }}
                            />
                            <Popconfirm
                                title="Delete?"
                                description="Are you sure to delete this data?"
                                onConfirm={() => { onDelete(item?.id as number) }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    type="link"
                                    icon={<DeleteOutlined rev={""} />}
                                    danger
                                />
                            </Popconfirm>
                        </>
                    )}
                />
            </Table>

            <ModalDocument
                session={session}
                visible={modal}
                setVisible={setModal}
                data={selectedData}
            />
        </>
    )
}

export async function getServerSideProps(context: any) {
    let checkSessions = await handleSessions(context);
    return checkSessions;
}

export default DocumentTable;