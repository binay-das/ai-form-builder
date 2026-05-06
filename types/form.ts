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

export const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: "text", label: "Short Text", icon: "Type" },
  { type: "textarea", label: "Long Text", icon: "AlignLeft" },
  { type: "email", label: "Email", icon: "Mail" },
  { type: "number", label: "Number", icon: "Hash" },
  { type: "phone", label: "Phone", icon: "Phone" },
  { type: "date", label: "Date", icon: "Calendar" },
  { type: "select", label: "Dropdown", icon: "List" },
  { type: "radio", label: "Multiple Choice", icon: "Circle" },
  { type: "checkbox", label: "Checkboxes", icon: "CheckSquare" },
  { type: "toggle", label: "Toggle", icon: "ToggleLeft" },
  { type: "url", label: "URL", icon: "Link" },
]
