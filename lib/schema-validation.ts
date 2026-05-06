import { FormField, FormSchema, FieldType } from "@/types/form"

const VALID_FIELD_TYPES: FieldType[] = [
  "text", "textarea", "email", "number", "phone", "date",
  "checkbox", "radio", "select", "toggle", "url"
]

export const CURRENT_SCHEMA_VERSION = "1.0"

export function validateField(field: unknown): field is FormField {
  if (typeof field !== "object" || field === null) return false

  const f = field as Record<string, unknown>

  if (typeof f.id !== "string" || !f.id) return false
  if (!VALID_FIELD_TYPES.includes(f.type as FieldType)) return false
  if (typeof f.label !== "string") return false
  if (typeof f.required !== "boolean") return false

  if (f.placeholder !== undefined && typeof f.placeholder !== "string") return false
  if (f.helpText !== undefined && typeof f.helpText !== "string") return false

  if (f.options !== undefined) {
    if (!Array.isArray(f.options)) return false
    for (const opt of f.options) {
      if (typeof opt !== "object" || opt === null) return false
      if (typeof (opt as Record<string, unknown>).id !== "string") return false
      if (typeof (opt as Record<string, unknown>).label !== "string") return false
    }
  }

  return true
}

export function validateSchema(schema: unknown): schema is FormSchema | FormField[] {
  if (schema === null || schema === undefined) return false

  if (Array.isArray(schema)) {
    return schema.every(validateField)
  }

  if (typeof schema === "object") {
    const s = schema as Record<string, unknown>
    if (typeof s.version !== "string") return false
    if (!Array.isArray(s.fields)) return false
    return s.fields.every(validateField)
  }

  return false
}

export function normalizeSchema(schema: unknown): FormSchema {
  if (Array.isArray(schema)) {
    return { version: CURRENT_SCHEMA_VERSION, fields: schema.filter(validateField) }
  }

  if (typeof schema === "object" && schema !== null) {
    const s = schema as Record<string, unknown>
    if (typeof s.version === "string" && Array.isArray(s.fields)) {
      return {
        version: s.version,
        fields: (s.fields as unknown[]).filter(validateField)
      }
    }
  }

  return { version: CURRENT_SCHEMA_VERSION, fields: [] }
}

export function migrateSchema(schema: FormSchema): FormSchema {
  const version = schema.version || "1.0"

  if (version === "1.0") {
    return schema
  }

  return { version: CURRENT_SCHEMA_VERSION, fields: schema.fields }
}
