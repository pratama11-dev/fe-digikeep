import { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { Sessions } from "types/Session";
import useDebounce from "@utils/helpers/customHooks/useDebounce";
import { useBusPartner } from "@services/reactQuery/businessPartner";
import { IBusinessPartnerRawQ } from "types/business-partner/index";

export type SelectValueType = { label?: string, value?: string } | undefined;
const SelectBusPartner = ({ session, onChange, enabled = false, selected }: { session?: Sessions, onChange?: (data: IBusinessPartnerRawQ | undefined) => void, enabled?: boolean, selected?: SelectValueType }) => {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce<string>(search, 500);
    const [selectedValue, setSelectedValue] = useState<SelectValueType>();

    const QueryData = useBusPartner({
        pagination: { current: 1, pageSize: 10, total: 0 },
        session,
        enabled,
        search: debouncedSearch === "" ? selected?.value : debouncedSearch
    })

    const options = QueryData.data?.data?.data?.map((d) => {
        return {
            label: `${d?.name}`,
            value: `${d?.id}`
        }
    });
    useEffect(() => {
        setSelectedValue(selected);
    }, [selected])

    return (
        <>
            <Select
                options={options}
                style={{ width: "100%" }}
                // mode="multiple"
                labelInValue
                showSearch
                allowClear
                filterOption={false}
                notFoundContent={QueryData.isLoading ? <Spin size="small" /> : null}
                placeholder="Input Bussiness Partner"
                value={selectedValue}
                onChange={(d: { label?: string; value?: string; }) => {
                    const data = QueryData.data?.data?.data?.find((e) => (e?.id)?.toString() === d?.value)
                    setSelectedValue(d);
                    if (onChange) onChange(data)
                }}
                onSearch={(text: string) => {
                    setSearch(text);
                }}
            />
        </>
    )
}
export default SelectBusPartner;