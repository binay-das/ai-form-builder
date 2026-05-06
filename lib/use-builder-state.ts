"use client";

import { useReducer, useCallback } from "react";
import { FormField } from "@/types/form";
import { BuilderState, BuilderAction } from "@/types/builder";
import { nanoid } from "nanoid";

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case "ADD_FIELD":
      return {
        ...state,
        fields: [...state.fields, action.payload],
        selectedFieldId: action.payload.id,
      };
    case "SELECT_FIELD":
      return { ...state, selectedFieldId: action.payload };
    case "UPDATE_FIELD":
      return {
        ...state,
        fields: state.fields.map((f) =>
          f.id === action.payload.id ? { ...f, ...action.payload.updates } : f
        ),
      };
    case "DELETE_FIELD":
      return {
        ...state,
        fields: state.fields.filter((f) => f.id !== action.payload),
        selectedFieldId:
          state.selectedFieldId === action.payload ? null : state.selectedFieldId,
      };
    case "REORDER_FIELDS":
      return { ...state, fields: action.payload };
    case "SET_FIELDS":
      return { ...state, fields: action.payload, selectedFieldId: null };
    default:
      return state;
  }
}

export function useBuilderState(initialFields: FormField[]) {
  const [state, dispatch] = useReducer(builderReducer, {
    fields: initialFields,
    selectedFieldId: null,
  });

  const addField = useCallback(
    (fieldDef: Omit<FormField, "id">) => {
      const field: FormField = { ...fieldDef, id: nanoid() };
      dispatch({ type: "ADD_FIELD", payload: field });
    },
    []
  );

  const selectField = useCallback((id: string | null) => {
    dispatch({ type: "SELECT_FIELD", payload: id });
  }, []);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    dispatch({ type: "UPDATE_FIELD", payload: { id, updates } });
  }, []);

  const deleteField = useCallback((id: string) => {
    dispatch({ type: "DELETE_FIELD", payload: id });
  }, []);

  const reorderFields = useCallback((fields: FormField[]) => {
    dispatch({ type: "REORDER_FIELDS", payload: fields });
  }, []);

  const selectedField = state.fields.find((f) => f.id === state.selectedFieldId) ?? null;

  return {
    fields: state.fields,
    selectedFieldId: state.selectedFieldId,
    selectedField,
    addField,
    selectField,
    updateField,
    deleteField,
    reorderFields,
  };
}
