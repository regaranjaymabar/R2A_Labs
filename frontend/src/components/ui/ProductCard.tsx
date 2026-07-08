import { Link } from "react-router-dom";

type ProductCardProps = {
  id: number;
  name: string;
  image: string;
  price: string;
  cpu: string;
  ram: string;
  storage: string;
};

export default function ProductCard({
  id,
  name,
  image,
  price,
  cpu,
  ram,
  storage,
}: ProductCardProps) {
  return (
    <div
      className="
      bg-white/10
      backdrop-blur-3xl
      border border-white/20
      rounded-3xl
      p-5
      hover:-translate-y-2
      hover:shadow-2xl
      transition-all
      duration-300
    "
    >
      <div className="h-60 flex items-center justify-center mb-6">
        <img
            src={image}
            alt={name}
            className="
            max-h-full
            w-auto
            object-contain
            transition-transform
            duration-300
            hover:scale-105
            "
        />
        </div>

      <h3 className="font-semibold text-lg">
        {name}
      </h3>

      <div className="space-y-3 mt-4 text-sm text-zinc-600">
        {/* CPU */}
        <p className="flex items-center gap-2">
            <img 
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNwdS1pY29uIGx1Y2lkZS1jcHUiPjxwYXRoIGQ9Ik0xMiAyMHYyIi8+PHBhdGggZD0iTTEyIDJ2MiIvPjxwYXRoIGQ9Ik0xNyAyMHYyIi8+PHBhdGggZD0iTTE3IDJ2MiIvPjxwYXRoIGQ9Ik0yIDEyaDIiLz48cGF0aCBkPSJNMiAxN2gyIi8+PHBhdGggZD0iTTIgN2gyIi8+PHBhdGggZD0iTTIwIDEyaDIiLz48cGF0aCBkPSJNMjAgMTdoMiIvPjxwYXRoIGQ9Ik0yMCA3aDIiLz48cGF0aCBkPSJNNyAyMHYyIi8+PHBhdGggZD0iTTcgMnYyIi8+PHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iMiIvPjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHJ4PSIxIi8+PC9zdmc+" 
            alt="CPU Icon" 
            className="w-4 h-4 object-contain opacity-70" 
            />
            <span>{cpu}</span>
        </p>

        {/* RAM */}
        <p className="flex items-center gap-2">
            <img 
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1lbW9yeS1zdGljay1pY29uIGx1Y2lkZS1tZW1vcnktc3RpY2siPjxwYXRoIGQ9Ik0xMiAxMnYtMiIvPjxwYXRoIGQ9Ik0xMiAxOHYtMiIvPjxwYXRoIGQ9Ik0xNiAxMnYtMiIvPjxwYXRoIGQ9Ik0xNiAxOHYtMiIvPjxwYXRoIGQ9Ik0yIDExaDEuNSIvPjxwYXRoIGQ9Ik0yMCAxOHYtMiIvPjxwYXRoIGQ9Ik0yMC41IDExSDIyIi8+PHBhdGggZD0iTTQgMTh2LTIiLz48cGF0aCBkPSJNOCAxMnYtMiIvPjxwYXRoIGQ9Ik04IDE4di0yIi8+PHJlY3QgeD0iMiIgeT0iNiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiByeD0iMiIvPjwvc3ZnPg==" 
            alt="RAM Icon" 
            className="w-4 h-4 object-contain opacity-70" 
            />
            <span>{ram}</span>
        </p>

        {/* Storage */}
        <p className="flex items-center gap-2">
            <img 
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWhhcmQtZHJpdmUtaWNvbiBsdWNpZGUtaGFyZC1kcml2ZSI+PHBhdGggZD0iTTEwIDE2aC4wMSIvPjxwYXRoIGQ9Ik0yLjIxMiAxMS41NzdhMiAyIDAgMCAwLS4yMTIuODk2VjE4YTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMnYtNS41MjdhMiAyIDAgMCAwLS4yMTItLjg5NkwxOC41NSA1LjExQTIgMiAwIDAgMCAxNi43NiA0SDcuMjRhMiAyIDAgMCAwLTEuNzkgMS4xMXoiLz48cGF0aCBkPSJNMjEuOTQ2IDEyLjAxM0gyLjA1NCIvPjxwYXRoIGQ9Ik02IDE2aC4wMSIvPjwvc3ZnPg==" 
            alt="Storage Icon" 
            className="w-4 h-4 object-contain opacity-70" 
            />
            <span>{storage}</span>
        </p>
        </div>

      <div className="flex justify-between items-center mt-6">
        <span className="font-bold text-xl">
          {price}
        </span>

        <Link
          to={`/product/${id}`}
          className="
          flex
          items-center
          justify-center
          w-11
          h-11
          rounded-full
          bg-black
          text-white
          hover:scale-110
          transition-all
          duration-300
        "
      >
        →
      </Link>
      </div>
    </div>
  );
}