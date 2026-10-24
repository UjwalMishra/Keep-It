import { useState } from "react";
import Input from "../components/Input";
import { Button } from "../components/ui/Button";
import Loader from "../components/Loader";
import { useSignin } from "../features/auth/hooks";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const signin = useSignin();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    signin.mutate({
      username: username.trim(),
      password,
    });
  }

  return (
    <div className="min-h-screen w-full bg-gray-200 flex flex-col items-center justify-center p-4 gap-6">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col justify-center items-center space-y-4">
            <Input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or email"
              autoComplete="username"
              maxLength={64}
            />
            <Input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              maxLength={72}
            />
          </div>
          <div className="mt-6 flex justify-center">
            {signin.isPending ? (
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
          Don&apos;t have an Account?{" "}
          <a className="text-blue-500 cursor-pointer" href="/signup">
            Create One
          </a>
        </div>
      </div>
    </div>
  );
}
