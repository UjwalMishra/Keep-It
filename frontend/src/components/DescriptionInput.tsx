interface DescriptionInputProps {
  id?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  error?: string;
  name?: string;
}

const DescriptionInput = ({
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  rows = 4,
  maxLength,
  error,
  name,
}: DescriptionInputProps) => {
  return (
    <div className="my-1 w-full">
      <textarea
        id={id}
        name={name}
        rows={rows}
        maxLength={maxLength}
        className={`px-4 py-3 border-2 rounded-xl w-full focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? "border-red-400 focus:ring-red-400 focus:border-red-400"
            : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
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
};

export default DescriptionInput;
