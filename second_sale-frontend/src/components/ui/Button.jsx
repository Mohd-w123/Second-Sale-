const variants = {
  primary: 'bg-gradient-to-r from-[#116466] via-[#087F8C] to-[#0EA5E9] hover:from-[#0D4E50] hover:via-[#066772] hover:to-[#0284C7] text-white shadow-[0_4px_14px_rgba(8,127,140,0.28)] hover:shadow-[0_6px_20px_rgba(8,127,140,0.38)]',
  secondary: 'bg-white border-2 border-[#087F8C] text-[#087F8C] hover:bg-[#E8F6F7]',
  ghost: 'bg-transparent text-text-muted hover:bg-gray-100 hover:text-text-primary',
};
const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-3.5 text-base rounded-xl',
};

export default function Button({ variant = 'primary', size = 'md', children, className = '', disabled, loading, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 cursor-pointer
        ${variants[variant]} ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}
        ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  );
}
