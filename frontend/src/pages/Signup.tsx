import { useRef, useState } from "react";
import Input from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function Signup() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function signupfxn(e: React.FormEvent) {
    e.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/auth/signup`, {
        username,
        password,
      });

      toast.success("Account Created! Please Login now");
      navigate("/signin");
    } catch (err: any) {
      console.error("Signup failed:", err.response?.data?.msg);
      const message = err.response?.data?.msg || "Please try again!";
      toast.error(message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <form onSubmit={signupfxn}>
          <div className="flex flex-col justify-center items-center space-y-4">
            <Input ref={usernameRef} placeholder="Email" required={true} />
            <Input ref={passwordRef} placeholder="Password" required={true} />
          </div>
          <div className="mt-6 flex justify-center">
            {!loading ? (
              <Button
                variant="primary"
                text="Submit"
                size="lg"
                fullWidth={true}
                type="submit"
              />
            ) : (
              <Loader color={"black"} />
            )}
          </div>
        </form>
        <div className="mt-4 text-center text-sm sm:text-base">
          Already have an Account?{" "}
          <a className="text-blue-500 cursor-pointer" href="/signin">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
