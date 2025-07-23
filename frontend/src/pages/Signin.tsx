import { useRef, useState } from "react";
import Input from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function Signin() {
  const usernameRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function signinfxn(e: React.FormEvent) {
    e.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

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
      console.error("Signin failed:", err.response.data.msg);
      const message = err.response.data.msg || "Please try again!";
      toast.error(message);
    }
    setLoading(false);
  }

  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-md w-[400px] p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>
        <form onSubmit={signinfxn}>
          <div className="flex flex-col justify-center items-center space-y-4">
            <Input required={true} ref={usernameRef} placeholder="Email" />
            <Input required={true} ref={passwordRef} placeholder="Password" />
          </div>
          <div className="mt-6 flex justify-center">
            {loading === false ? (
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
        <div className="mt-2 text-center">
          Don't have an Account ?{" "}
          <a className="text-blue-500 cursor-pointer" href="/signup">
            {" "}
            Create One
          </a>
        </div>
      </div>
    </div>
  );
}
