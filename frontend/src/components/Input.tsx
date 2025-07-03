export default function Input({
  onChange,
  placeholder,
}: {
  onChange: () => void;
}) {
  return (
    <div className="mx-8 my-2">
      <input
        type="text"
        className="px-4 py-2 border rounded-md m-2"
        placeholder={placeholder}
        onChange={onChange}
      ></input>
    </div>
  );
}
