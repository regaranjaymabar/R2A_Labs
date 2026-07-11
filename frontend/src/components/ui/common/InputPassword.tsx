import { useState } from "react";
import type {
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";
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

export const InputPassword = <T extends FieldValues>({
  label,
  nama,
  error,
  register,
  disabled = false,
  readOnly = false,
  placeholder,
  helperText,
}: InputPasswordProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <label
        htmlFor={nama}
        className="text-sm font-medium text-zinc-700"
      >
        {label}
      </label>

      {/* Input */}
      <div className="relative">
        <input
          id={nama}
          type={showPassword ? "text" : "password"}
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
            pr-12
            text-sm
            text-zinc-900
            placeholder:text-zinc-400
            outline-none
            transition-all
            duration-200

            ${
              error
                ? "border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-zinc-300 focus:border-black focus:ring-4 focus:ring-black/5"
            }

            ${
              disabled || readOnly
                ? "bg-zinc-100 text-zinc-500 cursor-not-allowed"
                : "bg-white"
            }
          `}
        />

        {/* Toggle Password */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-zinc-400
            hover:text-zinc-700
            transition-colors
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          {showPassword ? (
            <EyeOff size={20} strokeWidth={1.8} />
          ) : (
            <Eye size={20} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Helper */}
      {helperText && !error && (
        <p className="text-xs text-zinc-500">
          {helperText}
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};