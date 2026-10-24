type FieldLabelProps = {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  optionalHint?: string;
};

export function FieldLabel({
  htmlFor,
  children,
  required = false,
  optionalHint,
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      {children}
      {required ? (
        <span className="text-red-500 ml-0.5" aria-hidden="true">
          *
        </span>
      ) : optionalHint ? (
        <span className="text-gray-400 font-normal ml-1">({optionalHint})</span>
      ) : null}
    </label>
  );
}
