/**
 * Reusable card, the 4xor.de card style.
 */
export default function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card p-4 ${onClick ? "cursor-pointer transition-transform active:scale-[0.98]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
