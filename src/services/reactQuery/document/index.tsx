import { IDefaultApi, IDefaultApiExclude } from "types/api/params";
import useQueryHooks from "../customHooks/useQueryHooks";
import { ICalendar } from "types/Calendar";
import { IDocument } from "types/document/index";

export const useDocumentQuery = (data: IDefaultApi) => {
  const { enabled } = data;

  return useQueryHooks(data).config<IDocument[], any>({
    data: ["pagination", "search", "filters"],
    api: "/api/document",
    key: "useDocumentQuery",
    method: "POST",
    config: {
      enabled: enabled ?? true,
      refetchOnWindowFocus: true,
      keepPreviousData: false,
    },
  });
};

export const useDocumentCategoriesQuery = (data: IDefaultApi) => {
  const { enabled } = data;

  return useQueryHooks(data).config<IDocument[], any>({
    data: ["pagination", "search", "filters"],
    api: "/api/document-categories",
    key: "useDocumentCategoriesQuery",
    method: "POST",
    config: {
      enabled: enabled ?? true,
      refetchOnWindowFocus: true,
      keepPreviousData: false,
    },
  });
};

interface props4 extends IDefaultApi { 
  id?: number,
}

export const useDetailDocumentQuery = (data: props4) => {
  const { enabled } = data;

  return useQueryHooks(data).config<ICalendar, any>({
    data: ["users"],
    api: `/api/document/detail/${data?.id}`,
    key: "useDetailDocumentQuery",
    method: "POST",
    config: {
      enabled: enabled ?? true,
      refetchOnWindowFocus: true,
      keepPreviousData: false,
    },
  });
};

