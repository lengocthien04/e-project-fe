const specialInputs = ["email", "name", "password"] as const;

const inputNamesSet = new Set([...specialInputs] as const);

export const InputFieldNames = Array.from(inputNamesSet);

export type InputFieldName = (typeof InputFieldNames)[number];
