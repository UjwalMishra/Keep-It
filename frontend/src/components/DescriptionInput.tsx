interface DescriptionInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
}

const DescriptionInput = ({
  placeholder,
  value,
  onChange,
  required = false,
  rows = 4,
}: DescriptionInputProps) => {
  return (
    <div className="my-2 w-full">
      <textarea
        rows={rows}
        required={required}
        className="px-4 py-3 border-2 border-gray-200 rounded-xl my-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  );
};

export default DescriptionInput;
