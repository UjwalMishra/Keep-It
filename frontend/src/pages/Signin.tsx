import { useState } from "react";
import Input from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function signinfxn(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/signin`, {
        username,
        password,
      });

      const jwt = res.data.token;
      localStorage.setItem("token", jwt);
      toast.success("Login successful!");
      navigate("/");
    } catch (err: any) {
      console.error("Signin failed:", err.response?.data?.msg);
      const message = err.response?.data?.msg || "Please try again!";
      toast.error(message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen w-full bg-gray-200 flex flex-col items-center justify-center p-4 gap-6">
      {/* Signin Form */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>
        <form onSubmit={signinfxn}>
          <div className="flex flex-col justify-center items-center space-y-4">
            <Input
              required={true}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email"
            />
            <Input
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
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
              <Loader color="black" />
            )}
          </div>
        </form>
        <div className="mt-4 text-center text-sm sm:text-base">
          Don&apos;t have an Account?{" "}
          <a className="text-blue-500 cursor-pointer" href="/signup">
            Create One
          </a>
        </div>
      </div>

      {/* Demo Info Box */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 sm:p-8 text-center">
        <p className="font-semibold mb-2">Demo login details:</p>
        <p>
          Email: <span className="font-mono">demo_user1@gmail.com</span>
        </p>
        <p>
          Password: <span className="font-mono">qwerty</span>
        </p>
      </div>
    </div>
  );
}
