type InputProps = {
  id?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  error?: string;
  name?: string;
};

export default function Input({
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  type = "text",
  autoComplete,
  maxLength,
  minLength,
  error,
  name,
}: InputProps) {
  return (
    <div className="my-1 w-full">
      <input
        id={id}
        name={name}
        type={type}
        className={`px-4 py-3 border-2 rounded-xl w-full focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? "border-red-400 focus:ring-red-400 focus:border-red-400"
            : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error && id ? `${id}-error` : undefined}
        aria-required={required}
      />
      {error ? (
        <p id={id ? `${id}-error` : undefined} className="mt-1.5 text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
