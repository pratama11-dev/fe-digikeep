import { IDefaultApi, IDefaultApiExclude } from "types/api/params";
import useQueryHooks from "../customHooks/useQueryHooks";
import { IBusinessPartnerRawQ } from "types/business-partner/index";

export const useBusPartner = (
    data: IDefaultApi
) => {
    const { enabled } = data;

    return useQueryHooks(data).config<IBusinessPartnerRawQ[], any>({
        data: ["pagination", "search", "filters"],
        api: "/api/bp",
        key: "useBusPartner",
        method: "POST",
        config: {
            enabled: enabled ?? false,
            refetchOnWindowFocus: true,
            keepPreviousData: false,
        },
    });
};