import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface InputTextProps<T extends FieldValues = any>{
    id?: string;
    label: string;
    nama?: Path<T> | string;
    type?: string;
    error?: string;
    register?: UseFormRegister<T>;
    value?: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    helperText?: React.ReactNode;
    step?: string | number;
    className?: string;
}

export const InputText = <T extends FieldValues = any> ({
    id,
    label,
    nama,
    type = "text",
    error,
    register,
    value,
    onChange,
    required,
    placeholder,
    disabled = false,
    readOnly = false,
    helperText,
    step,
    className
}: InputTextProps<T>) => {
    const elementId = id || (nama as string) || label;
    const registerProps = register && nama ? register(nama as Path<T>) : {};
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={elementId} className="text-xs font-bold text-gray-700">
                {label}
            </label>
            <input
                id={elementId}
                type={type}
                step={step || (type === "number" ? "any" : undefined)}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                {...registerProps}
                disabled={disabled}
                readOnly={readOnly}
                className={`w-full border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none transition-all font-semibold text-sm
                ${error ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'focus:border-black focus:ring-2 focus:ring-black/20'}
                ${disabled || readOnly ? 'bg-gray-100 text-gray-600' : 'bg-white text-gray-900'}
                ${disabled ? 'cursor-not-allowed text-gray-500' : ''} ${className || ''}`}
            />
            {helperText && !error && <div className="mt-1 text-xs text-gray-500">{helperText}</div>}
            {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
        </div>
    );
};
