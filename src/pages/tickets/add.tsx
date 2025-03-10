import { Sessions } from "types/Session";
import handleSessions from "@pages/api/GetSession";
import HeadPage from "@components/Global/Header/HeadPage";
import DashboardLayout from "@layouts/DashboardLayout";
import useNavbar from "@layouts/customHooks/useNavbar";
import { Button, Card, Col, Descriptions, Form, Input, Row, Segmented, Select, Steps, Upload } from "antd";
import useWindowSize from "@utils/helpers/ReactHelper";
import { useState } from "react";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import useAuth from "@api/customHooks/useAuth";
import SelectEvent from "@components/Global/SelectEvent";
import { IEvent } from "types/document/index";
import readFileAsDataURL from "@components/Util/readFileAsDataUrl";
import useFetcher from "@api/customHooks/useFetcher";
import { showSuccess } from "@utils/helpers/AntdHelper";
import { useQueryClient } from "@tanstack/react-query";
import { PushNavigateTo } from "@utils/helpers/Route";
import { validateDecimal } from "@utils/helpers/decimalHelper";

const TicketsAddPage = (session: Sessions) => {
    useNavbar(["tickets"], [{ name: "Tickets", url: "/tickets" }, { name: "Add Tickets", url: "/tickets/add" }]);
    const { isMobile } = useWindowSize();
    const [form] = Form.useForm();
    const uq = useQueryClient();
    const { FetcherPost, isLoading } = useFetcher(session);
    const { handleLogout } = useAuth();

    const [current, setCurrent] = useState<number>(0);
    const [event, setEvent] = useState<IEvent>()
    const [attachments, setAttachments] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        personalInfo: { name: '', email: '', no_doc: '', type_ticket: 'Regular', price: '', type_doc: 'NISN', already_paid: "" },
        ticketHolders: [{ name: '', email: '', no_doc: '', type_doc_type_holder: '' }],
        attachments: [{ upload: '' }]
    });

    const handleChange = <T extends keyof typeof formData>(
        step: T,
        key: keyof typeof formData[T],
        value: any
    ) => {
        setFormData((prevState) => {
            const updatedData = {
                ...prevState,
                [step]: {
                    ...prevState[step],
                    [key]: value
                }
            };

            if (step === 'personalInfo') {
                // Update ticketHolders with the new personalInfo data as the first index
                updatedData.ticketHolders = [
                    {
                        name: updatedData.personalInfo.name,
                        email: updatedData.personalInfo.email,
                        no_doc: updatedData.personalInfo.no_doc,
                        type_doc_type_holder: updatedData.personalInfo.type_doc,
                    },
                    ...updatedData.ticketHolders.slice(1)
                ];
            }

            return updatedData;
        });
    };

    const addTicketHolder = () => {
        setFormData((prevState) => ({
            ...prevState,
            ticketHolders: [...prevState.ticketHolders, { name: '', email: '', no_doc: '', type_doc_type_holder: '' }]
        }));
    };

    const removeTicketHolder = (index: number) => {
        setFormData((prevState) => ({
            ...prevState,
            ticketHolders: prevState.ticketHolders.filter((_, i) => i !== index)
        }));
    };

    const handleTicketHolderChange = (index: number, field: string, value: string) => {
        const updatedTicketHolders = [...formData.ticketHolders];
        updatedTicketHolders[index] = { ...updatedTicketHolders[index], [field]: value };
        setFormData({
            ...formData,
            ticketHolders: updatedTicketHolders
        });
    };

    const next = async () => {
        try {
            await form.validateFields(); // Validate fields of the current step
            setCurrent(current + 1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const prev = () => setCurrent(current - 1);

    const handleFileChange = async (info: any) => {
        // Get the latest file (the last one in the file list)
        const { fileList } = info;

        // Convert each file to base64
        const filesInBase64 = await Promise.all(
            fileList.map(async (file: any) => {
                const base64 = await readFileAsDataURL(file.originFileObj);
                return { upload: base64 };
            })
        );

        // Update the formData with the array of base64 files
        setFormData((prevState) => ({
            ...prevState,
            attachments: filesInBase64
        }));

        setAttachments(filesInBase64);
    };

    const handleSubmit = async () => {
        try {
            const params: {
                name: string,
                type_ticket: string,
                already_paid: string,
                email: string,
                no_doc: string,
                price: string,
                id_event: number,
                type_doc: string,
                ticketHolders?: {
                    name: string,
                    email: string,
                    no_doc: string
                }[],
                attachment?: {
                    upload?: string
                }[]
            } = {
                name: formData?.personalInfo?.name,
                type_ticket: formData?.personalInfo?.type_ticket,
                already_paid: formData.personalInfo.already_paid,
                type_doc: formData?.personalInfo?.type_doc,
                email: formData?.personalInfo?.email,
                no_doc: formData?.personalInfo?.no_doc,
                price: formData?.personalInfo?.price,
                id_event: event?.id ?? 0,
                ticketHolders: formData?.ticketHolders,
                attachment: formData?.attachments
            }

            const res = await FetcherPost({
                url: '/api/ticket/create',
                api: "API",
                data: params
            });

            if (res.status === 200) {
                showSuccess(
                    "Berhasil!",
                    `Berhasil Membuat Event!`
                );
                uq.invalidateQueries([
                    "useEventQuery",
                ])
                uq.refetchQueries([
                    "useEventQuery",
                ])
                PushNavigateTo("/tickets")
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const steps = [
        {
            title: 'Personal Info',
            content: (
                <Card style={{ marginTop: 20 }}>
                    <Row gutter={[20, 10]}>
                        <Col xs={24} md={24} lg={12} xl={12}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter your name' }]}
                            >
                                <Input
                                    placeholder="Name"
                                    value={formData.personalInfo.name}
                                    onChange={(e) => handleChange('personalInfo', 'name', e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { type: 'email', message: 'Please enter a valid email' },
                                    { required: true, message: 'Please enter your email' }
                                ]}
                            >
                                <Input
                                    placeholder="Email"
                                    value={formData.personalInfo.email}
                                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Type Doc"
                                rules={[
                                    { required: true, message: 'Please enter an Type ddoc' }
                                ]}
                            >
                                <Select
                                    placeholder="Select Type Doc"
                                    value={formData?.personalInfo?.type_doc}
                                    onChange={(value) => handleChange('personalInfo', 'type_doc', value)}
                                    options={[
                                        { label: 'NISN', value: 'NISN' },
                                        { label: 'NIK', value: 'NIK' }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Doc num"
                                name="no_doc"
                                rules={[{ required: true, message: 'Please enter your document number' }]}
                            >
                                <Input
                                    placeholder="Doc num"
                                    value={formData.personalInfo.no_doc}
                                    onChange={(e) => handleChange('personalInfo', 'no_doc', e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={12} xl={12}>
                            <Form.Item
                                label="Event"
                                name="event"
                                rules={[{ required: true, message: 'Please enter your document number' }]}
                            >
                                <SelectEvent
                                    session={session}
                                    onChange={(d) => {
                                        setEvent(d);
                                    }}
                                    enabled={true}
                                    selected={{
                                        label: event?.name ?? "",
                                        value: `${event?.id}`,
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Price per Ticket"
                                name="price"
                                required
                                initialValue={0}
                                rules={[
                                    { validator: validateDecimal },
                                    {
                                        required: true,
                                        message: "harap masukkan unit",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Price"
                                    value={formData.personalInfo.price}
                                    onChange={(e) => handleChange('personalInfo', 'price', e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Ticket Type"
                                name="type_ticket"
                                rules={[{ required: true, message: 'Please select a ticket type' }]}
                            >
                                <Select
                                    placeholder="Select Ticket Type"
                                    value={formData.personalInfo.type_ticket}
                                    onChange={(value) => handleChange('personalInfo', 'type_ticket', value)}
                                    options={[
                                        { label: 'Regular', value: 'Regular' },
                                        { label: 'Presale 1', value: 'Presale 1' }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Already paid"
                                name="already_paid"
                                // rules={[{ required: true, message: 'Please select a ticket type' }]}
                            >
                                <Segmented
                                    options={[
                                        {
                                            label: "Paid",
                                            value: 2,
                                        },
                                        {
                                            label: "Un-Paid",
                                            value: 1,
                                        },
                                    ]}
                                    value={formData.personalInfo.already_paid}
                                    onChange={(value) => handleChange('personalInfo', 'already_paid', value)}
                                    block
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            )
        },
        {
            title: 'Ticket Detail',
            content: (
                <Card style={{ marginTop: 20 }}>
                    {formData.ticketHolders.map((holder, index) => (
                        <Row key={index} gutter={16}>
                            <Col span={20}>
                                <Form.Item
                                    label="Name"
                                    rules={[{ required: true, message: 'Please enter a name' }]}
                                >
                                    <Input
                                        placeholder="Name"
                                        value={holder.name}
                                        onChange={(e) => handleTicketHolderChange(index, 'name', e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Email"
                                    rules={[
                                        { type: 'email', message: 'Please enter a valid email' },
                                        { required: true, message: 'Please enter an email' }
                                    ]}
                                >
                                    <Input
                                        placeholder="Email"
                                        value={holder.email}
                                        onChange={(e) => handleTicketHolderChange(index, 'email', e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Type Doc"
                                    rules={[
                                        { required: true, message: 'Please enter an Type ddoc' }
                                    ]}
                                >
                                    <Select
                                        placeholder="Select Type Doc"
                                        value={holder.type_doc_type_holder}
                                        onChange={(value) => handleTicketHolderChange(index, 'type_doc_type_holder', value)}
                                        options={[
                                            { label: 'NISN', value: 'NISN' },
                                            { label: 'NIK', value: 'NIK' }
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Doc num"
                                    rules={[{ required: true, message: 'Please enter a document number' }]}
                                >
                                    <Input
                                        placeholder="Doc num"
                                        value={holder.no_doc}
                                        onChange={(e) => handleTicketHolderChange(index, 'no_doc', e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Button
                                    danger
                                    type="primary"
                                    onClick={() => removeTicketHolder(index)}
                                    block
                                    icon={<MinusCircleOutlined rev={""} />}
                                />
                            </Col>
                        </Row>
                    ))}
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={addTicketHolder}
                            block
                            icon={<PlusOutlined rev={""} />}
                        >
                            Add Ticket Holder
                        </Button>
                    </Form.Item>
                </Card>
            )
        },
        {
            title: 'Attachment',
            content: (
                <Card style={{ marginTop: 20 }}>
                    <Form.Item
                        label="Photo"
                        name="photo"
                        required
                        rules={[
                            {
                                required: true,
                                message: "Photo is required",
                            },
                        ]}
                    >
                        <Upload
                            multiple
                            listType="picture"
                            onChange={handleFileChange} // Call handleFileChange on file upload
                            beforeUpload={() => false} // Prevent auto upload (for manual processing)
                            className="upload-list-inline"
                        >
                            <Button icon={<UploadOutlined rev={"icon"} />}>
                                Upload Photo
                            </Button>
                        </Upload>
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {attachments.map((file, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <img src={file.upload} alt={file.name} style={{ width: '100px', height: '100px' }} />
                            </div>
                        ))}
                    </div>
                </Card>
            )
        },
        {
            title: 'Confirmation',
            content: (
                <Card style={{ marginTop: 20 }}>
                    <p>Review your details and submit your ticket.</p>
                    <Descriptions title="Personal Info" bordered>
                        <Descriptions.Item label="Name">
                            {formData.personalInfo.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {formData.personalInfo.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Document Number">
                            {formData.personalInfo.no_doc}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ticket Type">
                            {formData.personalInfo.type_ticket}
                        </Descriptions.Item>
                        <Descriptions.Item label="Price">
                            {formData.personalInfo.price}
                        </Descriptions.Item>
                        <Descriptions.Item label="Event">
                            {event?.name || "No event selected"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Descriptions title="Ticket Holders" bordered style={{ marginTop: 20 }}>
                        {formData.ticketHolders.map((holder, index) => (
                            <Descriptions.Item key={index} label={`Ticket Holder ${index + 1}`}>
                                <p><b>Name:</b> {holder.name}</p>
                                <p><b>Email:</b> {holder.email}</p>
                                <p><b>Document Number:</b> {holder.no_doc}</p>
                            </Descriptions.Item>
                        ))}
                    </Descriptions>

                    <Descriptions title="Attachments" bordered style={{ marginTop: 20 }}>
                        {formData.attachments.length > 0 && formData.attachments[0].upload ? (
                            formData.attachments.map((file, index) => (
                                <Descriptions.Item key={index} label={`Attachment ${index + 1}`}>
                                    <img
                                        src={file.upload}
                                        alt={`Attachment ${index + 1}`}
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                </Descriptions.Item>
                            ))
                        ) : (
                            <Descriptions.Item label="Attachments">No files uploaded</Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>
            )
        }
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <>
            <HeadPage withDefaultCss title="Tickets" />
            <DashboardLayout session={session}>
                <Steps current={current} items={items} />
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        type_ticket: 'Regular',
                    }}
                >
                    <div>{steps[current].content}</div>
                </Form>
                <Row style={{ marginTop: 24 }} justify={"end"}>
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={prev}>
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={next}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" loading={isLoading} onClick={handleSubmit}>
                            Done
                        </Button>
                    )}
                </Row>
            </DashboardLayout>
        </>
    );
};

export async function getServerSideProps(context: any) {
    let checkSessions = await handleSessions(context);
    return checkSessions;
}

export default TicketsAddPage;
