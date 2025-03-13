import useAuth from "@api/customHooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { Sessions } from "types/Session";
import { IDocument } from "types/document/index";
import { IBusinessPartnerRawQ } from "types/business-partner/index";
import FormAdd from "./form/add";
import FormEdit from "./form/edit";

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

    const { handleLogout } = useAuth();

    const [cardCode, setCardCode] = useState<IBusinessPartnerRawQ>();

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
            {data ? (
                <>
                    <FormEdit
                        session={session}
                        visible={visible}
                        setVisible={setVisible}
                        data={data}
                    />
                </>
            ) : (
                <FormAdd
                    session={session}
                    visible={visible}
                    setVisible={setVisible}
                />
            )}
        </Modal>
    </>);
}
export default ModalDocument;
