import useAuth from "@api/customHooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Row } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Sessions } from "types/Session";
import { IDocumentCategory } from "types/document/index";
import { CloseOutlined } from "@ant-design/icons";
import { FaPlus } from "react-icons/fa";
import useFetcher from "@api/customHooks/useFetcher";
import { showSuccess } from "@utils/helpers/AntdHelper";

const ModalCategories = ({
    session,
    visible,
    setVisible,
    data
}: {
    session: Sessions | undefined;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    data?: IDocumentCategory
}) => {
    const uq = useQueryClient();
    const [form] = Form.useForm();
    const { FetcherPost, isLoading } = useFetcher(session);

    const { handleLogout } = useAuth();

    const handleSubmit = () => {
        form.validateFields().then(async (d) => {
            console.log("asd", d);
            
            const params = {
                category: d?.category,
            };

            FetcherPost({
                url: `/api/document/categories/add`,
                api: "API",
                data: params,
            }).then((d) => {
                if (d.status === 200) {
                    showSuccess("Success", "Berhasil menambah Category!");

                    uq.invalidateQueries(["useDocumentCategoriesQuery"]);
                    uq.refetchQueries(["useDocumentCategoriesQuery"]);
                }
            });
            setVisible(false)
            form.resetFields()
        });
    }

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                category: data?.category,
            })

        }
    }, [data, visible])

    return (<>
        <Modal
            open={visible}
            onCancel={() => {
                setVisible(false);
                // form.resetFields();
            }}
            footer={false}
            title={`${data ? "Edit" : "Add"} Document`}
        >
            <Form form={form} layout="vertical" style={{ padding: 10 }}>
                <Form.Item
                    name="category"
                    label="Category"
                    required
                >
                    <Input />
                </Form.Item>

                <Row justify={"end"}>
                    <Button
                        icon={<CloseOutlined rev={""} />}
                        loading={isLoading}
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
                        loading={isLoading}
                        onClick={() => {
                            handleSubmit()
                        }}
                    >
                        Create
                    </Button>
                </Row>
            </Form>
        </Modal>
    </>);
}
export default ModalCategories;
