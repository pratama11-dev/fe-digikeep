import { IDefaultApi, IDefaultApiExclude, IDefaultApiMinimum } from "types/api/params";
import useQueryHooks from "../customHooks/useQueryHooks";
import { ICalendar } from "types/Calendar";
import { IDashboardCount, IDocument, IDocumentCategory } from "types/document/index";

export const useDocumentQuery = (data: IDefaultApi & {mode?: "accept" | "decline" | "created"}) => {
  const { enabled } = data;

  return useQueryHooks(data).config<IDocument[], any>({
    data: ["pagination", "search", "filters", "mode"],
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

export const useDashboardCount = (
  data: IDefaultApiMinimum
) => {
  const { enabled } = data;

  return useQueryHooks(data).config<IDashboardCount, any>({
    data: [""],
    api: "/api/document/by-status",
    key: "useDashboardCount",
    method: "POST",
    config: {
      enabled: enabled ?? false,
      refetchOnWindowFocus: true,
      keepPreviousData: false,
    },
  });
};

export const useDocumentCategoriesQuery = (data: IDefaultApi) => {
  const { enabled } = data;

  return useQueryHooks(data).config<IDocumentCategory[], any>({
    data: ["pagination", "search", "filters"],
    api: "/api/document/categories",
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

