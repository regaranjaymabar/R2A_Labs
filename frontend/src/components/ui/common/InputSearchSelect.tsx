import Select from "react-select";
import { Controller } from "react-hook-form";

import React from "react";

export interface SearchSelectOption {
  value: number | string;
  label: string;
}

export interface InputSearchSelectProps {
  label?: React.ReactNode;
  name: string;
  control: any;
  options: SearchSelectOption[];
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export function InputSearchSelect({
  label,
  name,
  control,
  options,
  placeholder = "Cari atau pilih...",
  isLoading = false,
  disabled = false,
  error,
  helperText,
}: InputSearchSelectProps) {
  const isDark = () =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedOption =
            options.find(
              (opt) =>
                opt.value === field.value ||
                String(opt.value) === String(field.value) ||
                (!isNaN(Number(opt.value)) &&
                  !isNaN(Number(field.value)) &&
                  Number(opt.value) === Number(field.value))
            ) || null;

          return (
            <Select
              options={options}
              isLoading={isLoading}
              isDisabled={disabled || isLoading}
              placeholder={placeholder}
              isClearable
              value={selectedOption}
              onChange={(val: SearchSelectOption | null) => {
                field.onChange(val ? val.value : "");
              }}
              onBlur={field.onBlur}
              styles={{
                control: (base, state) => ({
                  ...base,
                  minHeight: "44px",
                  borderRadius: "0.75rem",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  backgroundColor: "transparent",
                  borderColor: error
                    ? "#ef4444"
                    : state.isFocused
                    ? "#4f46e5"
                    : isDark()
                    ? "#374151"
                    : "#d1d5db",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: error ? "#ef4444" : "#6366f1",
                  },
                }),
                singleValue: (base) => ({
                  ...base,
                  color: isDark() ? "#ffffff" : "#1f2937",
                  fontWeight: "500",
                }),
                input: (base) => ({
                  ...base,
                  color: isDark() ? "#ffffff" : "#1f2937",
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  zIndex: 9999,
                  backgroundColor: isDark() ? "#181519" : "#ffffff",
                  border: isDark() ? "1px solid #374151" : "1px solid #e5e7eb",
                }),
                option: (base, state) => ({
                  ...base,
                  fontSize: "0.875rem",
                  backgroundColor: state.isSelected
                    ? "#4f46e5"
                    : state.isFocused
                    ? isDark()
                      ? "#27232a"
                      : "#f3f4f6"
                    : "transparent",
                  color: state.isSelected
                    ? "#ffffff"
                    : isDark()
                    ? "#e5e7eb"
                    : "#1f2937",
                  cursor: "pointer",
                }),
              }}
            />
          );
        }}
      />

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="text-[11px] text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
