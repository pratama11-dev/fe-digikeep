import useFetcher from "@api/customHooks/useFetcher";
import { useQueryClient } from "@tanstack/react-query";
import { showSuccess } from "@utils/helpers/AntdHelper";
import { Button, Col, Form, Input, Row, Switch } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Sessions } from "types/Session";
import { IDocument, IDocumentCategory } from "types/document/index";
import { CloseOutlined } from "@ant-design/icons";
import SelectBusPartner from "@components/Select/SelectBusPartner";
import { IBusinessPartnerRawQ } from "types/business-partner/index";
import { FaPlus } from "react-icons/fa";
import SelectCategoryDoc from "@components/Select/SelectCategoryDoc";

const FormEdit = ({
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

    const [loading, setLoading] = useState<boolean>(false)
    const [newCust, setNewCust] = useState<boolean>(false);
    const [cardCode, setCardCode] = useState<IBusinessPartnerRawQ>();
    const [category, setCategory] = useState<IDocumentCategory>()

    const handleSubmit = () => {
        form.validateFields().then(async (d) => {

            const params = {
                id: data?.id,
                name: d?.name,
                nomer_pengajuan: d?.nomer_pengajuan,
                bl_code: d?.bl_code,
                bs_code: d?.bs_code,
                new_bp: d?.new_bp,
                id_bp: d?.id_bp,
                id_category: category?.id
            };

            FetcherPost({
                url: `/api/document/update`,
                api: "API",
                data: params,
            }).then((d) => {
                if (d.status === 200) {
                    showSuccess("Success", "Berhasil mengubah Item!");

                    uq.invalidateQueries(["useDocumentQuery"]);
                    uq.refetchQueries(["useDocumentQuery"]);
                }
            });
            setVisible(false)
            setLoading(false);
            form.resetFields()
        });
    }

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                name: data?.title,
                nomer_pengajuan: data?.nomer_pengajuan,
                bl_code: data?.bl_code,
                bs_code: data?.bs_code
            })

            setCardCode(data?.business_partner)
        }
    }, [data, visible])

    return (
        <>
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

                <Form.Item label="Category Document" name="id_category" style={{ marginBottom: 10 }}>
                    <SelectCategoryDoc
                        enabled
                        session={session}
                        selected={{
                            label: category?.category ?? "",
                            value: category?.id?.toString() ?? "",
                        }}
                        onChange={(data) => {
                            setCategory(data);
                        }}
                    />
                </Form.Item>

                <Row gutter={[20, 15]} align={"middle"} style={{ marginBottom: 10 }}>
                    <Col xs={16} sm={16} md={20} lg={20}>
                        {!newCust ? (
                            <Form.Item label="Business Partner" name="bp" style={{ margin: 0 }}>
                                <SelectBusPartner
                                    enabled
                                    session={session}
                                    selected={{
                                        label: cardCode?.name ?? "",
                                        value: cardCode?.id?.toString() ?? "",
                                    }}
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

                <Row justify={"end"} style={{ marginTop: 20 }}>
                    <Button
                        icon={<CloseOutlined rev={""} />}
                        loading={isLoading ?? loading}
                        onClick={() => {
                            setVisible(false)
                        }}
                        style={{ marginRight: 10 }}
                    >
                        Close
                    </Button>
                    <Button
                        icon={<FaPlus />}
                        type="primary"
                        loading={isLoading ?? loading}
                        onClick={() => {
                            handleSubmit()
                        }}
                    >
                        Save
                    </Button>
                </Row>
            </Form>
        </>
    );
}
export default FormEdit;
