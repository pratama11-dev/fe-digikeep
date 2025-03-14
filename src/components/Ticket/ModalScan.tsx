import useAuth from "@api/customHooks/useAuth";
import useFetcher from "@api/customHooks/useFetcher";
import { handlingError } from "@pages/_app";
import { useQueryClient } from "@tanstack/react-query";
import { showSuccess } from "@utils/helpers/AntdHelper";
import { Form, Input, Modal, Segmented, Spin } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Sessions } from "types/Session";
import QRCodeScanner from "@components/Scanner/QrScanner";

const ModalScan = ({
    session,
    visible,
    setVisible,
}: {
    session: Sessions | undefined;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}) => {
    const uq = useQueryClient();

    const [form] = Form.useForm();
    const { FetcherPost, isLoading } = useFetcher(session);
    const { handleLogout } = useAuth();
    const [scan, setScan] = useState(false);
    const [noDoc, setNoDoc] = useState<String>("")
    const [mode, setMode] = useState<"scan" | "manual">("scan")

    useEffect(() => {
        if (visible) {
            setScan(true);
        } else {
            setScan(false);
        }
    }, [visible]);

    const doScan = async (qr_code?: string) => {
        try {
            const res = await FetcherPost({
                url: "/api/ticket/qr-scan",
                api: "API",
                data: {
                    qr_code,
                    mode,
                    noDoc
                }
            });

            if (res.status === 200) {
                showSuccess(
                    "Berhasil!",
                    `Berhasil Scan Qr!`
                );
                uq.invalidateQueries([
                    "useTicketQuery",
                ])
                uq.refetchQueries([
                    "useTicketQuery",
                ])
                
            }
            setScan(false);
            setVisible(false)
            setMode("scan")
            setNoDoc("")
            form.resetFields();
        } catch (error) {
            setVisible(false)
            setScan(false);
            handlingError(error, handleLogout);
        }
    }

    return (<>
        <Modal
            open={visible}
            // width={"1200px"}
            onCancel={() => {
                setVisible(false);
                form.resetFields();
            }}
            onOk={() => {
                doScan()
            }}
            title={`Scan Ticket`}
        >
            {isLoading ? (
                <Spin tip="Processing QR Code..." />
            ) : (
                <>
                    <Segmented
                        options={['scan', 'manual']}
                        style={{ marginBottom: 10 }}
                        onChange={(value) => {
                            setMode(value as "manual" | "scan")
                        }}
                    />
                    {mode === "scan" ? (
                        <QRCodeScanner
                            scan={scan}
                            onFinish={(idQr) => {
                                doScan(idQr)
                            }}
                        />
                    ) : (
                        <Form form={form} layout="vertical" style={{ marginTop: 10 }}>
                            <Form.Item
                                label="NISN / NIK"
                                name="no_doc"
                                rules={[{ required: true, message: 'Please enter your name' }]}
                            >
                                <Input
                                    placeholder="NISN / NIK"
                                    onChange={(e) => {
                                        setNoDoc(e?.target?.value)
                                    }}
                                />
                            </Form.Item>
                        </Form>
                    )}
                </>
            )}
        </Modal>
    </>);
}
export default ModalScan;
