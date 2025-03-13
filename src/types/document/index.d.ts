import { IOrderItem } from "../order"

export interface IDocument {
    id?: number
    title?: string
    id_category?: number
    id_status?: number
    created_by?: string
    updated_by?: string
    created_at?: string
    updated_at?: string
    nomer_pengajuan?: string
    bl_code?: string
    bs_code?: string
    business_partner?: IBusinessPartner
    document_attachment?: IDocumentAttachment[]
    document_category?: IDocumentCategory
    document_status?: IDocumentStatus
}

export interface IDashboardCount {
    created?: number
    decline?: number
    accept?: number
}

export interface IBusinessPartner {
    id?: number,
    address?: string,
    name?: string
}

export interface IDocumentStatus {
    id?: number
    status?: string
}

export interface IDocumentCategory {
    id?: number
    category?: string
    created_at?: string
    created_by?: string
    updated_att?: string
}

export interface IDocumentAttachment {
    id?: number
    id_doc?: number
    file_attachment?: string
    last_updated_by?: string
    created_by?: string
    updated_by?: string
    created_at?: string
    updated_at?: string
    document?: IDocument
}