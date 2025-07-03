import Input from "../components/Input";
import { Button } from "../components/ui/Button";

export default function Signin() {
  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-md w-[400px] p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign In
        </h2>
        <div>
          <div className="flex flex-col justify-center items-center">
            <Input placeholder="Email" />
            <Input placeholder="Password" />
          </div>
          <div className="my-1">
            <Button
              variant="primary"
              text="Submit"
              size="lg"
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
