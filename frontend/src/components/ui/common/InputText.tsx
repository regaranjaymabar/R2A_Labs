import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface InputTextProps<T extends FieldValues> {
  id?: string;
  label: string;
  nama: Path<T>;
  type?: string;
  error?: string;
  register: UseFormRegister<T>;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  step?: string | number;
}

export const InputText = <T extends FieldValues>({
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
  step,
}: InputTextProps<T>) => {
  const elementId = id || nama;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={elementId}
        className="text-sm font-medium text-zinc-700"
      >
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
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          text-sm
          transition
          outline-none

          ${
            error
              ? "border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-zinc-300 focus:border-black focus:ring-4 focus:ring-black/5"
          }

          ${
            disabled || readOnly
              ? "bg-zinc-100 text-zinc-500 cursor-not-allowed"
              : "bg-white text-zinc-900 placeholder:text-zinc-400"
          }
        `}
      />

      {helperText && !error && (
        <p className="text-xs text-zinc-500">
          {helperText}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};