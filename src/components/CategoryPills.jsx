export default function CategoryPills({ categories, selectedValue, onChange, className = "" }) {
  return (
    <div className={`chip-row ${className}`.trim()}>
      {categories.map((item) => (
        <button
          key={item.value ?? item.label}
          type="button"
          className={`chip-btn ${selectedValue === item.value ? "active" : ""}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
