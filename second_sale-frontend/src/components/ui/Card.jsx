export default function Card({ children, className = '', selected, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border transition-all duration-200
        ${selected ? 'border-2 border-primary bg-primary-light shadow-[0_8px_40px_rgba(8,127,140,0.12)]' : 'border-border shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
