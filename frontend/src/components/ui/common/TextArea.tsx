import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface TextAreaProps<T extends FieldValues> {
    label: string;
    nama: Path<T>;
    register: UseFormRegister<T>;
    error?: string;
    placeholder?: string;
    className?: string; 
}

export const TextArea = <T extends FieldValues> ({
    label,
    nama,
    register,
    error,
    placeholder,
    className = ""
}: TextAreaProps<T>) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <textarea 
                {...register(nama)}
                placeholder={placeholder}
                className={`border rounded px-3 py-2 min-h-25 w-full outline-none transition-colors ${
                    error ? "border-blue-500 focus:ring-1 focus:ring-blue-500" : "border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
}