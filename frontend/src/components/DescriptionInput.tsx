const DescriptionInput = ({
  placeholder,
  ref,
  required,
}: {
  placeholder: string;
  ref: any;
  required: boolean;
}) => {
  return (
    <div className="my-2 w-full">
      <textarea
        rows={4}
        required={required}
        className="px-4 py-2 border rounded-md my-1  w-full"
        placeholder={placeholder}
        ref={ref}
      ></textarea>
    </div>
  );
};

export default DescriptionInput;
