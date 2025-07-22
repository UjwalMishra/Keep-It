import { useRef } from "react";
import Input from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  async function signupfxn(e: React.FormEvent) {
    e.preventDefault(); // Prevent full page reload

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      await axios.post(`${BACKEND_URL}/auth/signup`, {
        username,
        password,
      });

      toast("Account Created! Please Login now");
      navigate("/signin");
    } catch (err: any) {
      console.error("Signup failed:", err.response.data.msg);
      const message = err.response.data.msg || "Please try again!";
      toast.error(message);
    }
  }

  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-md w-[400px] p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <form onSubmit={signupfxn}>
          <div className="flex flex-col justify-center items-center space-y-4">
            <Input ref={usernameRef} placeholder="Email" required={true} />
            <Input ref={passwordRef} placeholder="Password" required={true} />
          </div>
          <div className="mt-6">
            <Button
              variant="primary"
              text="Submit"
              size="lg"
              fullWidth={true}
              type="submit"
            />
          </div>
        </form>
        <div className="mt-2 text-center">
          Already have an Account ?{" "}
          <a className="text-blue-500 cursor-pointer" href="/signin">
            {" "}
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
