export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "phone"
  | "date"
  | "checkbox"
  | "radio"
  | "select"
  | "toggle"
  | "url"

export interface FieldOption {
  id: string
  label: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: FieldOption[]
  helpText?: string
}

export interface FormSchema {
  version: string
  fields: FormField[]
}

export interface FormData {
  title: string
  description?: string
  schema: FormSchema | FormField[]
}

export interface FormResponse {
  id: string
  title: string
  description: string | null
  schema: FormField[] | FormSchema
  isPublished: boolean
  submissionCount: number
  updatedAt: string
  createdAt: string
  userId: string
}
