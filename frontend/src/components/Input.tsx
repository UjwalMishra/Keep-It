export default function Input({
  placeholder,
  ref,
}: {
  placeholder: string;
  ref: any;
}) {
  return (
    <div className="my-2 w-full">
      <input
        type="text"
        className="px-4 py-2 border rounded-md my-1  w-full"
        placeholder={placeholder}
        ref={ref}
      ></input>
    </div>
  );
}
