import { useRef } from "react";
import Input from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../confit";

export default function Signup() {
  const usernameRef = useRef<any>("");
  const passwordRef = useRef<any>("");

  async function signupfxn() {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
      username,
      password,
    });
    alert("signup done");
  }

  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-md w-[400px] p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <div>
          <div className="flex flex-col justify-center items-center">
            <Input ref={usernameRef} placeholder="Email" />
            <Input ref={passwordRef} placeholder="Password" />
          </div>
          <div className="my-1">
            <Button
              variant="primary"
              text="Submit"
              size="lg"
              fullWidth={true}
              onClick={signupfxn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
