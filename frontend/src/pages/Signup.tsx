import { useState } from "react";
import Input from "../components/Input";
import { Button } from "../components/ui/Button";
import Loader from "../components/Loader";
import { useSignup } from "../features/auth/hooks";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const signup = useSignup();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    signup.mutate({
      username: username.trim(),
      password,
    });
  }

  return (
    <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col justify-center items-center space-y-4">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or email"
              required
              autoComplete="username"
              maxLength={64}
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 characters)"
              required
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
            />
          </div>
          <div className="mt-6 flex justify-center">
            {signup.isPending ? (
              <Loader color="black" />
            ) : (
              <Button
                variant="primary"
                text="Submit"
                size="lg"
                fullWidth
                type="submit"
              />
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
