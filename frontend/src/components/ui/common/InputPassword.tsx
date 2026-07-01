import { useState } from "react";
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { Eye, EyeOff } from "lucide-react";

interface InputPasswordProps<T extends FieldValues> {
    label: string;
    nama: Path<T>;
    error?: string;
    register: UseFormRegister<T>;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    helperText?: React.ReactNode;
}

export const InputPassword = <T extends FieldValues> ({
    label,
    nama,
    error,
    register,
    disabled = false,
    readOnly = false,
    placeholder,
    helperText
}: InputPasswordProps<T>) => {
    const [show, setShow] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={nama} className="text-sm font-medium text-gray-700">
                {label}
            </label>

            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    placeholder={placeholder || label}
                    {...register(nama)}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 outline-none transition-all 
                    ${error ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'focus:border-black'}
                    ${disabled || readOnly ? 'bg-gray-100 text-gray-600' : 'bg-white'}
                    ${disabled ? 'cursor-not-allowed text-gray-500' : ''}`}
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    disabled={disabled}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {helperText && !error && <div className="mt-1">{helperText}</div>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};
