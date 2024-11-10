
import Image from "next/image";
import { Github } from "lucide-react";
import { SignInButton } from "~/components/ThemeButton";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full space-y-8 p-8 bg-base-100 rounded-lg shadow-xl">
        <div className="text-center">
          <Image
            src="/assets/Hack hub (1).svg"
            alt="HackHub Logo"
            width={128}
            height={64}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold">Welcome to HackHub</h2>
          <p className="mt-2 text-sm text-base-content/70">
            Connect, collaborate, and create amazing projects
          </p>
        </div>

        <div className="mt-8 space-y-4">
            <SignInButton />
          <div className="text-center text-sm text-base-content/70">
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}