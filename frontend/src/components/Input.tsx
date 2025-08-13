interface InputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}

export default function Input({
  placeholder,
  value,
  onChange,
  required = false,
  type = "text",
}: InputProps) {
  return (
    <div className="my-2 w-full">
      <input
        required={required}
        type={type}
        className="px-4 py-3 border-2 border-gray-200 rounded-xl my-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
