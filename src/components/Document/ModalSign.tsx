import useAuth from "@api/customHooks/useAuth";
import useFetcher from "@api/customHooks/useFetcher";
import Sign from "@components/Global/Sign";
import { handlingError } from "@pages/_app";
import { useQueryClient } from "@tanstack/react-query";
import { showSuccess } from "@utils/helpers/AntdHelper";
import { Form, Input, Modal, Segmented } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { Sessions } from "types/Session";

const ModalSign = ({
  session,
  visible,
  setVisible,
  nomor_document,
  id_doc
}: {
  session: Sessions | undefined;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  nomor_document?: string | undefined;
  id_doc?: number
}) => {
  const uq = useQueryClient();

  const [form] = Form.useForm();
  const { FetcherPost, isLoading } = useFetcher(session);
  const { handleLogout } = useAuth();
  const [desicion, setDesicion] = useState<"accept" | "decline">("accept")

  const handleSubmit = async (ttd: string | undefined) => {
    form
      .validateFields()
      .then(async (values) => {
        const { note } = values;

        const completeData = {
          id_doc, 
          note, 
          ttd,
          desicion
        }

        const url = `/api/document/desicion`

        const res = await FetcherPost({
          url: url,
          api: "API",
          data: completeData,
        });

        if (res.status === 200) {
          showSuccess(
            "Berhasil!",
            `Documen akan diupdate`
          );
          uq.invalidateQueries([]);
          uq.refetchQueries([]);
          
          setVisible(false);
        }
      })
      .catch((errorInfo) => {
        handlingError(errorInfo, handleLogout);
      });
  };

  return (
    <>
      <Modal
        open={visible}
        // width={"1200px"}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        footer={false}
        title={nomor_document}
      >
        <Form form={form} layout="vertical" style={{ padding: 10 }}>
          <Form.Item name="desicion" label="Desicion">
            <Segmented
              options={['accept', 'decline']}
              style={{ marginBottom: 10 }}
              onChange={(value) => {
                setDesicion(value as "accept" | "decline")
              }}
              block
            />
          </Form.Item>
          <Form.Item name="note" label="Keterangan">
            <Input.TextArea rows={4} cols={4} />
          </Form.Item>
          <Form.Item name="sign" label="Signature" required>
            <Sign
              width={300}
              height={200}
              loading={isLoading}
              showName={true}
              name={session?.data?.user?.name}
              onSubmit={(d) => {
                handleSubmit(d);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalSign;
