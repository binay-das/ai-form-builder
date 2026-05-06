import { FieldTypeConfig } from "@/types/builder";

export const FIELD_TYPE_CONFIGS: FieldTypeConfig[] = [
  // Basic
  {
    type: "text",
    label: "Short Text",
    icon: "Type",
    description: "Single-line text input",
    group: "basic",
    defaultField: {
      type: "text",
      label: "Short Text",
      placeholder: "Enter text…",
      required: false,
    },
  },
  {
    type: "textarea",
    label: "Long Text",
    icon: "AlignLeft",
    description: "Multi-line text input",
    group: "basic",
    defaultField: {
      type: "textarea",
      label: "Long Text",
      placeholder: "Enter details…",
      required: false,
    },
  },
  {
    type: "email",
    label: "Email",
    icon: "Mail",
    description: "Email address field",
    group: "basic",
    defaultField: {
      type: "email",
      label: "Email",
      placeholder: "you@example.com",
      required: false,
    },
  },
  {
    type: "number",
    label: "Number",
    icon: "Hash",
    description: "Numeric input field",
    group: "basic",
    defaultField: {
      type: "number",
      label: "Number",
      placeholder: "0",
      required: false,
    },
  },
  {
    type: "phone",
    label: "Phone",
    icon: "Phone",
    description: "Phone number field",
    group: "basic",
    defaultField: {
      type: "phone",
      label: "Phone Number",
      placeholder: "+1 (555) 000-0000",
      required: false,
    },
  },
  // Choice
  {
    type: "radio",
    label: "Single Choice",
    icon: "Circle",
    description: "Radio button group",
    group: "choice",
    defaultField: {
      type: "radio",
      label: "Single Choice",
      required: false,
      options: [
        { id: "opt-1", label: "Option 1" },
        { id: "opt-2", label: "Option 2" },
      ],
    },
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: "CheckSquare",
    description: "Single checkbox toggle",
    group: "choice",
    defaultField: {
      type: "checkbox",
      label: "I agree",
      required: false,
    },
  },
  {
    type: "select",
    label: "Dropdown",
    icon: "ChevronDown",
    description: "Dropdown select menu",
    group: "choice",
    defaultField: {
      type: "select",
      label: "Dropdown",
      required: false,
      options: [
        { id: "opt-1", label: "Option 1" },
        { id: "opt-2", label: "Option 2" },
      ],
    },
  },
  {
    type: "toggle",
    label: "Toggle",
    icon: "ToggleLeft",
    description: "On/off switch",
    group: "choice",
    defaultField: {
      type: "toggle",
      label: "Enable feature",
      required: false,
    },
  },
  // Advanced
  {
    type: "date",
    label: "Date",
    icon: "Calendar",
    description: "Date picker",
    group: "advanced",
    defaultField: {
      type: "date",
      label: "Date",
      required: false,
    },
  },
  {
    type: "url",
    label: "URL",
    icon: "Link",
    description: "Website URL input",
    group: "advanced",
    defaultField: {
      type: "url",
      label: "Website URL",
      placeholder: "https://",
      required: false,
    },
  },
];

export const FIELD_GROUPS: { key: string; label: string }[] = [
  { key: "basic", label: "Basic" },
  { key: "choice", label: "Choice" },
  { key: "advanced", label: "Advanced" },
];
