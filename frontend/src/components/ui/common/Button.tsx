interface ButtonProps {
    label?: string;
    variant?: "primary"  | "secondary" | "danger" | "warning" | "info" | "back" | "outline" | "ghost";
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    isLoading?: boolean;
    className? : string;
    icon? : React.ReactNode;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    label,
    variant = "primary",
    type = "button",
    onClick,
    isLoading = false,
    className = "",
    icon,
    disabled = false,
}) => {

    const baseStyle = "inline-flex items-center justify-center gap-2 font-semibold text-[15px] md:text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95";
    const varianStyle = {
        // Primary: Warna utama aplikasi (#151216) dengan hover charcoal elegan
        primary: "bg-[#151216] hover:bg-[#262128] text-white focus:ring-[#151216] rounded-lg px-5 py-2.5 shadow-sm",

        // Secondary: Batal / Aksi netral (Putih dengan garis pinggir abu-abu lembut)
        secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-200 rounded-lg px-5 py-2.5 shadow-sm",

        // Danger: Hapus / Peringatan keras (Menggunakan warna merah khas header-mu #C90003)
        danger: "bg-[#D62828] hover:bg-red-800 text-white focus:ring-[#C90003] rounded-lg px-5 py-2.5 shadow-sm",

        // Warning: Edit / Modifikasi (Oranye #F97316 / orange-500)
        warning: "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500 rounded-lg px-5 py-2.5 shadow-sm",

        // Info: Aksi sekunder/informasi (Biru #2563EB / blue-600)
        info: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 rounded-lg px-5 py-2.5 shadow-sm",

        // Outline: Transparan dengan garis border mengikuti warna primary
        outline: "bg-transparent hover:bg-gray-100 text-[#151216] border border-[#151216] focus:ring-gray-300 rounded-lg px-5 py-2.5 shadow-sm",

        // Ghost: Transparan tanpa border, muncul background halus saat dihover
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-[#151216] focus:ring-gray-200 rounded-lg px-5 py-2.5",

        // Back: Tombol panah kembali (Berbentuk bulat, tanpa background bawaan)
        back: "p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full focus:ring-gray-300"
    };
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`${baseStyle} ${varianStyle[variant]} ${className}`}
            title={label} 
        >
            {isLoading ? "Loading..." : (
                <>
                    {icon && <span className={label ? "mr-2" : ""}>{icon}</span>}
                    {label}
                </>
            )}
        </button>
    );
};

export default Button;