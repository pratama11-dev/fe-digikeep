import useAuth from "@api/customHooks/useAuth";
import useFetcher from "@api/customHooks/useFetcher";
import { handlingError } from "@pages/_app";
import { useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@utils/helpers/AntdHelper";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Switch, Upload, UploadProps } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Sessions } from "types/Session";
import dayjs from "dayjs";
import { IDocument } from "types/document/index";
import { UploadFile } from "antd/lib";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import API_ENDPOINT from "@api/apiEndpoint";
import SelectBusPartner from "@components/Select/SelectBusPartner";
import { IBusinessPartnerRawQ } from "types/business-partner/index";

const ModalDocument = ({
    session,
    visible,
    setVisible,
    data
}: {
    session: Sessions | undefined;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    data?: IDocument
}) => {
    const uq = useQueryClient();

    const [form] = Form.useForm();
    const { FetcherPost, isLoading } = useFetcher(session);
    const { handleLogout } = useAuth();

    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [newCust, setNewCust] = useState<boolean>(false);
    const [cardCode, setCardCode] = useState<IBusinessPartnerRawQ>();

    const props: UploadProps = {
        name: "file",
        // multiple: false,
        accept: ".pdf",
        beforeUpload(file) {
            // Create an instance of FormData
            const formData = new FormData();

            // Append the file to the FormData
            setLoading(true);
            formData.append("file_upload", file);
            setLoading(false);
            // Axios POST request

            return false;
        },
        onDrop(e: React.DragEvent<HTMLDivElement>) {
            console.log("Dropped files", e.dataTransfer.files);
        },
        onChange: ({ fileList }) => setFileList(fileList),
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
        },

    };

    const handleSubmit = async () => {
        form.validateFields()
            .then(async values => {
                const formData = new FormData();

                formData.append("name", values?.name ?? "");
                formData.append("nomer_pengajuan", values?.nomer_pengajuan ?? "");
                formData.append("bl_code", values?.bl_code ?? "");
                formData.append("bs_code", values?.bs_code ?? "");
                formData.append("new_bp", values?.new_bp ?? "");
                // formData.append("id_bp", cardCode?.id );

                fileList.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append("file_upload", file.originFileObj as Blob, file.name);
                    }
                });

                try {
                    const response = await axios.post(
                        `${API_ENDPOINT.API}/api/document/add`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${session?.token}`,
                            },
                        }
                    );

                    if (response.status === 200) {
                        showSuccess("Success!", "Berhasil membuat Document");
                        uq.invalidateQueries([
                            "useDocumentQuery",
                        ])
                        uq.refetchQueries([
                            "useDocumentQuery",
                        ])
                        setVisible(false)
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Error uploading file", error);
                    setLoading(false);
                    showError(
                        "Error!",
                        // @ts-ignore
                        JSON.stringify(error?.response?.data?.info ?? error?.response?.data)
                    );
                }
            })
            .catch(errorInfo => {
                handlingError(errorInfo, handleLogout);
            });
    }

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                // name: data?.name,
                // event_date: data.event_date ? dayjs(data.event_date) : null
            })
        }
    }, [data, visible])


    return (<>
        <Modal
            open={visible}
            // width={"1200px"}
            onCancel={() => {
                setVisible(false);
                form.resetFields();
            }}
            onOk={() => {
                handleSubmit()
            }}
            title={`${data ? "Edit" : "Add"} Document`}
        >
            <Form form={form} layout="vertical" style={{ padding: 10 }}>
                <Form.Item
                    name="name"
                    label="Document Title"
                    required
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="nomer_pengajuan"
                    label="Nomer Pengajuan"
                    required
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="bl_code"
                    label="B/L Number"
                    required
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="bs_code"
                    label="BS Code"
                    required
                >
                    <Input />
                </Form.Item>

                <Row gutter={[20, 15]} align={"middle"} style={{ marginBottom: 10 }}>
                    <Col xs={16} sm={16} md={20} lg={20}>
                        {!newCust ? (
                            <Form.Item label="Business Partner"  name="bp" style={{ margin: 0 }}>
                                <SelectBusPartner
                                    enabled
                                    session={session}
                                    onChange={(data) => {
                                        setCardCode(data);
                                    }}
                                />
                            </Form.Item>
                        ) : (
                            <Form.Item label="Business Partner" name="new_bp" style={{ margin: 0 }}>
                                <Input />
                            </Form.Item>
                        )}
                    </Col>
                    <Col xs={8} sm={8} md={4} lg={4}>
                        <Form.Item style={{ margin: 0 }}>
                            <Switch
                                checkedChildren="New Supplier"
                                unCheckedChildren="Existing"
                                onChange={(e) => setNewCust(e)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Documen Upload"
                    name="file_upload"
                >
                    <Upload
                        listType="picture"
                        multiple
                        onChange={({ fileList }) => setFileList(fileList)}
                        beforeUpload={() => false} // Prevent auto upload
                        className="upload-list-inline"
                        accept={".pdf"}
                        fileList={fileList}
                        {...props}
                    >
                        <Button icon={<UploadOutlined rev={"icon"} />}>
                            Upload Doc
                        </Button>
                    </Upload>
                </Form.Item>

                {data && (
                    <Form.Item
                        name="id_status"
                        label="Is Active?"
                        required
                    >
                        <Switch
                            checked={data?.id_status === 1}
                        // onChange={(e) => 
                        //     console.log(e)
                        // }
                        />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    </>);
}
export default ModalDocument;
