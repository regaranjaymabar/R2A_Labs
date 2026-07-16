import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
};

export default function InputRupiah({ value, onChange, placeholder, label }: Props) {
  const [display, setDisplay] = useState("");

  const format = (val: string) => {
    const num = val.replace(/\D/g, "");
    if (!num) return "";
    return "Rp " + Number(num).toLocaleString("id-ID");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setDisplay(format(raw));
    onChange(raw);
  };

  return (
    <div>
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        type="text"
        value={display || (value ? format(value) : "")}
        onChange={handleChange}
        placeholder={placeholder || "Rp 0"}
        className="w-full mt-1 px-4 py-3 rounded-full border border-white/20 bg-white/10 outline-none text-sm"
      />
    </div>
  );
}