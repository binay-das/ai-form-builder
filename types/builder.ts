import { FieldType, FormField } from "./form";

export interface FieldTypeConfig {
  type: FieldType;
  label: string;
  icon: string;
  description: string;
  group: "basic" | "choice" | "advanced";
  defaultField: Omit<FormField, "id">;
}

export interface BuilderState {
  fields: FormField[];
  selectedFieldId: string | null;
}

export type BuilderAction =
  | { type: "ADD_FIELD"; payload: FormField }
  | { type: "SELECT_FIELD"; payload: string | null }
  | { type: "UPDATE_FIELD"; payload: { id: string; updates: Partial<FormField> } }
  | { type: "DELETE_FIELD"; payload: string }
  | { type: "DUPLICATE_FIELD"; payload: { id: string; newId: string } }
  | { type: "MOVE_FIELD"; payload: { id: string; direction: "up" | "down" } }
  | { type: "REORDER_FIELDS"; payload: FormField[] }
  | { type: "SET_FIELDS"; payload: FormField[] };
