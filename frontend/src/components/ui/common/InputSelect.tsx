import React from 'react';
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface InputSelectProps<T extends FieldValues = FieldValues> {
    id?: string;
    label?: React.ReactNode;
    nama?: Path<T> | string;
    options?: SelectOption[];
    children?: React.ReactNode;
    error?: string;
    register?: UseFormRegister<T>;
    disabled?: boolean;
    placeholder?: string;
    placeholderValue?: string | number;
    helperText?: React.ReactNode;
    value?: string | number;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    className?: string;
}

export const InputSelect = <T extends FieldValues = FieldValues>({
    id,
    label,
    nama,
    options = [],
    children,
    error,
    register,
    placeholder = "-- Pilih Opsi --",
    placeholderValue = 0,
    disabled = false,
    helperText,
    value,
    onChange,
    className
}: InputSelectProps<T>) => {
    const stringNama = typeof nama === 'string' ? nama : undefined;
    const elementId = id || stringNama;
    const registerProps = register && nama ? register(nama as Path<T>) : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        registerProps?.onChange?.(e);
        onChange?.(e);
    };

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label htmlFor={elementId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <select
                id={elementId}
                {...(registerProps || {})}
                {...(value !== undefined ? { value } : {})}
                {...(registerProps?.onChange || onChange ? { onChange: handleChange } : {})}
                disabled={disabled}
                className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none transition-all font-semibold text-sm cursor-pointer
                ${error ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'focus:border-black focus:ring-2 focus:ring-purple-500/20'}
                ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'} ${className || ''}`}
            >
                {placeholder && (
                    <option value={placeholderValue}>{placeholder}</option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
                {children}
            </select>
            {helperText && !error && <div className="mt-1 text-xs text-gray-500">{helperText}</div>}
            {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
        </div>
    );
};

