import { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { Sessions } from "types/Session";
import useDebounce from "@utils/helpers/customHooks/useDebounce";
import { IEvent } from "types/document/index";
import { useEventQuery } from "@services/reactQuery/document";

export type SelectValueType = { label?: string; value?: string } | undefined;
const SelectEvent = ({
  session,
  onChange,
  enabled = false,
  search,
  selected,
}: {
  session?: Sessions;
  onChange: (data: IEvent | undefined) => void;
  enabled?: boolean;
  search?: string;
  selected?: SelectValueType;
}) => {
  const [searchVal, setSearch] = useState(search);
  const debouncedSearch = useDebounce(searchVal, 500);
  const [selectedValue, setSelectedValue] = useState<SelectValueType>();

  useEffect(() => {
    setSearch(search);
  }, [search]);

  useEffect(() => {
    setSelectedValue(selected);
  }, [selected]);

  const QueryData = useEventQuery({
    session,
    search: debouncedSearch === "" ? selected?.label : debouncedSearch,
    enabled,
    pagination: { pageSize: 999, current: 1 },
  });

  const options = QueryData.data?.data?.data?.map((d) => {
    return {
      label: `${d.name}`,
      value: `${d.id}`,
    };
  });

  return (
    <>
      <Select
        options={options}
        style={{ width: "100%" }}
        labelInValue
        showSearch
        filterOption={false}
        allowClear
        value={selectedValue?.label !== "" ? selectedValue : undefined}
        notFoundContent={QueryData.isLoading ? <Spin size="small" /> : null}
        placeholder="Input Workcenter"
        onChange={(d: { label?: string; value?: string }) => {
          const data = QueryData.data?.data?.data?.find(
            (e) => e?.id?.toString() === d?.value
          );
          onChange(data);
        }}
        //@ts-ignore
        onClear={() => onChange("")}
        onSearch={(text: string) => {
          setSearch(text);
        }}
      />
    </>
  );
};
export default SelectEvent;
