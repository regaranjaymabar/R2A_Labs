import Select from "react-select";
import { Controller } from "react-hook-form";
import React from "react";

export interface SearchSelectOption {
  value: number | string;
  label: string;
}

export interface InputSearchSelectProps {
  label?: React.ReactNode;
  name?: string;
  control?: any;
  value?: number | string;
  onChange?: (value: any) => void;
  options: SearchSelectOption[];
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: React.ReactNode;
  isClearable?: boolean;
}

export function InputSearchSelect({
  label,
  name,
  control,
  value,
  onChange,
  options,
  placeholder = "Cari atau pilih...",
  isLoading = false,
  disabled = false,
  error,
  helperText,
  isClearable = true,
}: InputSearchSelectProps) {
  const customStyles = {
    control: (base: any, state: any) => ({
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
        : "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: error ? "#ef4444" : "#6366f1",
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#1f2937",
      fontWeight: "500",
    }),
    input: (base: any) => ({
      ...base,
      color: "#1f2937",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#9ca3af",
      fontSize: "0.875rem",
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "0.75rem",
      overflow: "hidden",
      zIndex: 9999,
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
    }),
    option: (base: any, state: any) => ({
      ...base,
      fontSize: "0.875rem",
      backgroundColor: state.isSelected
        ? "#4f46e5"
        : state.isFocused
        ? "#f3f4f6"
        : "transparent",
      color: state.isSelected ? "#ffffff" : "#1f2937",
      cursor: "pointer",
    }),
  };

  const findSelectedOption = (val: any) =>
    options.find(
      (opt) =>
        opt.value === val ||
        String(opt.value) === String(val) ||
        (!isNaN(Number(opt.value)) &&
          !isNaN(Number(val)) &&
          Number(opt.value) === Number(val))
    ) || null;

  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
          {label}
        </label>
      )}

      {control && name ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              options={options}
              isLoading={isLoading}
              isDisabled={disabled || isLoading}
              isSearchable={true}
              placeholder={placeholder}
              isClearable={isClearable}
              value={findSelectedOption(field.value)}
              onChange={(val: SearchSelectOption | null) => {
                field.onChange(val ? val.value : "");
              }}
              onBlur={field.onBlur}
              styles={customStyles}
            />
          )}
        />
      ) : (
        <Select
          options={options}
          isLoading={isLoading}
          isDisabled={disabled || isLoading}
          isSearchable={true}
          placeholder={placeholder}
          isClearable={isClearable}
          value={findSelectedOption(value)}
          onChange={(val: SearchSelectOption | null) => {
            if (onChange) onChange(val ? val.value : "");
          }}
          styles={customStyles}
        />
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && (
        <div className="text-[11px] text-gray-500">{helperText}</div>
      )}
    </div>
  );
}
