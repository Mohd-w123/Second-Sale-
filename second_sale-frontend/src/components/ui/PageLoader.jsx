import logo from "../../assets/logo-secondsale.png";

export default function PageLoader({ text = "Loading SecondSale..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md transition-all duration-500">
      <div className="flex flex-col items-center max-w-xs text-center px-4">
        {/* Brand Logo with gentle breathing pulse */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-blue-400/15 animate-ping opacity-60" />
          <img
            src={logo}
            alt="SecondSale"
            className="h-12 sm:h-14 w-auto object-contain relative z-10 drop-shadow-sm transition-transform duration-300"
          />
        </div>

        {/* Smooth indeterminate progress line */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner mb-3.5">
          <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-full w-24 animate-[shimmer_1.5s_infinite_linear]" 
               style={{
                 animation: 'loaderSlide 1.4s ease-in-out infinite'
               }}
          />
        </div>

        {/* Text */}
        <p className="text-xs font-bold text-slate-500 tracking-wide uppercase font-sans">
          {text}
        </p>
      </div>

      <style>{`
        @keyframes loaderSlide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
