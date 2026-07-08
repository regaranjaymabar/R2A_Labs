import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface InputTextProps<T extends FieldValues>{
    id?: string;
    label:string;
    nama:Path<T>;
    type?:string;
    error?:string;
    register:UseFormRegister<T>;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    helperText?: React.ReactNode;
    step?: string | number;
}

export const InputText = <T extends FieldValues> ({
    id,
    label,
    nama,
    type = "text",
    error,
    register,
    placeholder,
    disabled = false,
    readOnly = false,
    helperText,
    step
}: InputTextProps<T>) => {
    const elementId = id || nama;
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={elementId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <input
                id={elementId}
                type={type}
                step={step || (type === "number" ? "any" : undefined)}
                placeholder={placeholder || label}
                {...register(nama)}
                disabled={disabled}
                readOnly={readOnly}
                className={`w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 outline-none transition-all font-semibold text-sm
                ${error ? 'border-red-500 focus:ring-2 focus:ring-red-500 dark:border-red-500' : 'focus:border-black dark:focus:border-black focus:ring-2 focus:ring-black/20'}
                ${disabled || readOnly ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : 'bg-white dark:bg-[#181519] text-gray-900 dark:text-white'}
                ${disabled ? 'cursor-not-allowed text-gray-500' : ''}`}
            />
            {helperText && !error && <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</div>}
            {error && <p className="text-red-500 text-xs font-medium mt-1">{error}</p>}
        </div>
    );
};
