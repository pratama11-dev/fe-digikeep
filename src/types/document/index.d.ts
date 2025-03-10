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
    document_attachment?: string
    document_category?: IDocumentCategory
    document_status?: IDocumentStatus
}

export interface IDocumentStatus {
    id?: number
    status?: string
}

export interface IDocumentCategory {
    id?: number
    category?: string
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