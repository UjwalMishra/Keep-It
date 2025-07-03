export default function Input({
  onChange,
  placeholder,
}: {
  placeholder: string;
  onChange: () => void;
}) {
  return (
    <div className="my-2 w-full">
      <input
        type="text"
        className="px-4 py-2 border rounded-md my-1 w-full"
        placeholder={placeholder}
        onChange={onChange}
      ></input>
    </div>
  );
}
