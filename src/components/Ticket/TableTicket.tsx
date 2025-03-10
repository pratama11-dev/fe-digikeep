import handleSessions from "@pages/api/GetSession";
import { Button, Image, Popconfirm, Switch, Table, TableProps, Tag } from "antd";
import { Sessions } from "types/Session";
import { IEvent } from "types/document/index";
import customFooterPagination from "@components/Partial/customFooterPagination";
import moment from "moment";
import getUserRole from "@utils/helpers/getUserRoles";
import { DeleteFilled, DeleteOutlined, EditOutlined, PrinterOutlined } from "@ant-design/icons";
import { useState } from "react";
import useFetcher from "@api/customHooks/useFetcher";
import { showSuccess } from "@utils/helpers/AntdHelper";
import { useQueryClient } from "@tanstack/react-query";
import { ITicket } from "types/ticket/index";
import UnitConvert from "@components/Util/UnitConvert";
import ModalPrintReceipt from "./ModalPrintReceipt";
import ModalPrintTicketQr from "./ModalPrintTicketQr";

interface ITableTicket {
    session: Sessions | undefined;
    data?: ITicket[];
    pagination: { current?: number | undefined; pageSize?: number | undefined; total?: number | undefined };
    loading?: boolean;
    onChange?: TableProps<ITicket>["onChange"];
}

const TicketTable = ({
    session,
    data,
    pagination,
    loading,
    onChange,
}: ITableTicket) => {
    const role = getUserRole(session)
    const uq = useQueryClient();
    const { FetcherPost, isLoading } = useFetcher(session);

    const [modal, setModal] = useState<boolean>(false)
    const [id, setId] = useState<number | null>()

    const doDelete = async (id: number) => {
        FetcherPost({
            api: "API",
            url: `/api/ticket/delete`,
            data: {
                id
            }
        }).then((d) => {
            if (d.status === 200) {
                uq.invalidateQueries([
                    "useTicketQuery",
                ])
                uq.refetchQueries([
                    "useTicketQuery",
                ])
                showSuccess("Success", `Berhasil menghapus Ticket`)
            }
        })
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
                    title="QR Code"
                    dataIndex="qr_code"
                    render={(_value, item: ITicket, _index) => {
                        return (
                            <Image
                                src={item.qr_code ?? ""}
                                alt={"QR Code"}
                                width={60}
                                height={60}
                            />
                        );
                    }}
                />
                <Table.Column
                    title="Ticket Owner"
                    dataIndex="doc_date"
                    render={(_value, item: ITicket) => item?.ticket_owner}
                />
                <Table.Column
                    title="Ticket Type"
                    dataIndex="doc_date"
                    render={(_value, item: ITicket) => item?.order_item?.type_ticket}
                />
                <Table.Column
                    title="NIK/NISN"
                    dataIndex="doc_ticket_owner"
                    render={(_value, item: ITicket) => item?.doc_ticket_owner}
                />
                <Table.Column
                    title="Price"
                    dataIndex="prrice"
                    render={(_value, item: ITicket) => UnitConvert?.FormatCurrency(item?.price, "IDR")}
                />
                <Table.Column
                    title="Event"
                    dataIndex="event"
                    render={(_value, item: ITicket) => item?.order_item?.event?.name}
                />
                <Table.Column
                    title="Scan At?"
                    dataIndex="scan_at"
                    render={(_value, item: ITicket) => UnitConvert?.FormatDateClassic(item?.scan_at)}
                />
                <Table.Column
                    title="Status"
                    dataIndex="status"
                    render={(_value, item: ITicket) => {
                        if (item?.is_active === 1) {
                            return <Tag color="green">Active</Tag>
                        } else {
                            return <Tag color="red">NOT SCAN</Tag>
                        }
                    }}
                />
                <Table.Column
                    title="Status Order"
                    dataIndex="status"
                    render={(_value, item: ITicket) => {
                        if (item?.order_item?.orders?.id_status === 1) {
                            return <Tag color="red">Unpaid</Tag>
                        } else if (item?.order_item?.orders?.id_status === 2) {
                            return <Tag color="green">Paid</Tag>
                        } else {
                            return <Tag color="blue">Active</Tag>
                        }
                    }}
                />
                <Table.Column
                    title="Action"
                    dataIndex="Action"
                    render={(_value, item: ITicket) => (
                        <>
                            <Popconfirm
                                title="Delete?"
                                description="Are you sure to delete this data?"
                                onConfirm={() => { doDelete(item?.order_item?.id ?? 0) }}
                                okText="Yes"
                                cancelText="No"
                                disabled={item?.is_active == 1}
                            >
                                <DeleteFilled
                                    rev={''}
                                    style={{
                                        marginLeft: 5,
                                        color: "red"
                                    }}
                                />
                            </Popconfirm>
                            <Button
                                type="link"
                                icon={<PrinterOutlined rev={""} />}
                                onClick={() => {
                                    setModal(true)
                                    setId(item?.id)
                                }}
                            />
                        </>
                    )}
                />
            </Table>

            <ModalPrintTicketQr
                session={session}
                setVisible={setModal}
                visible={modal}
                id={id}
            />
        </>
    )
}

export async function getServerSideProps(context: any) {
    let checkSessions = await handleSessions(context);
    return checkSessions;
}

export default TicketTable;