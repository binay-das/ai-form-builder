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

    case "DELETE_FIELD": {
      const remaining = state.fields.filter((f) => f.id !== action.payload);
      // Auto-select the next/prev field after deletion so the panel doesn't go blank
      let nextSelected: string | null = null;
      if (state.selectedFieldId === action.payload && remaining.length > 0) {
        const deletedIdx = state.fields.findIndex((f) => f.id === action.payload);
        nextSelected =
          remaining[Math.min(deletedIdx, remaining.length - 1)]?.id ?? null;
      } else if (state.selectedFieldId !== action.payload) {
        nextSelected = state.selectedFieldId;
      }
      return { ...state, fields: remaining, selectedFieldId: nextSelected };
    }

    case "DUPLICATE_FIELD": {
      const { id, newId } = action.payload;
      const src = state.fields.find((f) => f.id === id);
      if (!src) return state;
      const clone: FormField = {
        ...src,
        id: newId,
        label: `${src.label} (copy)`,
        options: src.options
          ? src.options.map((o) => ({ ...o, id: nanoid() }))
          : undefined,
      };
      const idx = state.fields.findIndex((f) => f.id === id);
      const next = [...state.fields];
      next.splice(idx + 1, 0, clone);
      return { ...state, fields: next, selectedFieldId: newId };
    }

    case "MOVE_FIELD": {
      const { id, direction } = action.payload;
      const idx = state.fields.findIndex((f) => f.id === id);
      if (idx === -1) return state;
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= state.fields.length) return state;
      const next = [...state.fields];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...state, fields: next };
    }

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

  const addField = useCallback((fieldDef: Omit<FormField, "id">) => {
    const field: FormField = { ...fieldDef, id: nanoid() };
    dispatch({ type: "ADD_FIELD", payload: field });
  }, []);

  const selectField = useCallback((id: string | null) => {
    dispatch({ type: "SELECT_FIELD", payload: id });
  }, []);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    dispatch({ type: "UPDATE_FIELD", payload: { id, updates } });
  }, []);

  const deleteField = useCallback((id: string) => {
    dispatch({ type: "DELETE_FIELD", payload: id });
  }, []);

  const duplicateField = useCallback((id: string) => {
    dispatch({ type: "DUPLICATE_FIELD", payload: { id, newId: nanoid() } });
  }, []);

  const moveField = useCallback((id: string, direction: "up" | "down") => {
    dispatch({ type: "MOVE_FIELD", payload: { id, direction } });
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
    duplicateField,
    moveField,
    reorderFields,
  };
}
