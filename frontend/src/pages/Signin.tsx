import { useRef } from "react";
import Input from "../components/Input";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../confit";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const usernameRef = useRef<any>("");
  const passwordRef = useRef<any>("");

  const navigate = useNavigate();

  async function signinfxn() {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const res = await axios.post(`${BACKEND_URL}/api/v1/auth/signin`, {
      username,
      password,
    });
    const jwt = res.data.token;
    localStorage.setItem("token", jwt);

    //redirect
    navigate("/");
  }

  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-md w-[400px] p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign In
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
              onClick={signinfxn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
