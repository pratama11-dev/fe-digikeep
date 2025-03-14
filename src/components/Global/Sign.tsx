import { Button, Row } from "antd";
import { useRef } from "react";
import ReactSignatureCanvas from "react-signature-canvas";
import SignaturePad from 'react-signature-canvas'

const Sign = ({
    width,
    height,
    justify,
    onClear,
    onSubmit,
    name,
    loading,
    showName
}: {
    width: number;
    height: number;
    justify?: "start" | "end" | "center";
    onClear?: () => void;
    onSubmit?: (data: string | undefined) => void;
    name?: string;
    loading?: boolean;
    showName?: boolean;
}) => {
    const sigPad = useRef<ReactSignatureCanvas>(null);
    return (
        <>
            <Row justify={justify ?? "center"}>
                <div style={{ width: `${width}px`, height: `${height}px`, border: "1px solid #d9d9d9", borderRadius: "10px" }}>
                    <SignaturePad canvasProps={{ width, height }} ref={sigPad} />
                </div>
            </Row>
            {
                showName && (
                    <>
                        <div style={{height: "10px"}} />
                        <Row justify={justify ?? "center"}>
                            <p>Your Signs - {name}</p>
                        </Row>
                    </>
                )
            }

            <div style={{ height: "20px" }} />

            <Row justify="end">
                <Button
                    // type="primary"
                    loading={loading}
                    // ghost
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                        if (sigPad != null) {
                            sigPad.current?.clear()
                            if (onClear) onClear()
                        }
                    }}
                >
                    Clear
                </Button>

                <Button
                    type="primary"
                    loading={loading}
                    onClick={() => {
                        if (sigPad != null) {
                            const data = sigPad?.current?.getTrimmedCanvas().toDataURL()
                            if (onSubmit) onSubmit(data)
                        }
                    }}
                >
                    Submit
                </Button>
            </Row>
        </>
    )
}

export default Sign;