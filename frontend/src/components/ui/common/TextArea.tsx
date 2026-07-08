import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface TextAreaProps<T extends FieldValues> {
    label: string;
    nama: Path<T>;
    register: UseFormRegister<T>;
    error?: string;
    placeholder?: string;
    className?: string;
    rows?: number;
    helperText?: React.ReactNode;
}

export const TextArea = <T extends FieldValues> ({
    label,
    nama,
    register,
    error,
    placeholder,
    className = "",
    rows = 4,
    helperText,
}: TextAreaProps<T>) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label htmlFor={nama} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <textarea 
                id={nama}
                rows={rows}
                {...register(nama)}
                placeholder={placeholder || label}
                className={`w-full border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-3 outline-none transition-all font-semibold text-sm bg-white dark:bg-[#181519] text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 dark:focus:border-purple-500 ${
                    error ? "border-red-500 focus:ring-red-500" : ""
                }`}
            />
            {error && <p className="text-xs font-semibold text-red-500 dark:text-red-400 animate-fadeIn">{error}</p>}
            {helperText && !error && <div className="text-xs text-gray-500 dark:text-gray-400">{helperText}</div>}
        </div>
    );
};