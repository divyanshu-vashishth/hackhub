import Image from "next/image";
import Link from "next/link";

import { Home, Users, FolderGit2, LogIn, UserCircle, BlocksIcon , NewspaperIcon } from "lucide-react";
import { SignOutButton, ThemeButton } from "./ThemeButton";
import { auth, signIn, signOut } from "~/server/auth";

export async function Navbar() {
  const session = await auth();

  return (
    <div className="navbar mx-auto flex max-w-6xl bg-base-100">
      <div className="flex-1">
        <Link href="/">
          <Image
            src="/assets/Hack hub (1).svg"
            alt="HackHub Logo"
            width={64}
            height={32}
          />
        </Link>
      </div>
      <div className="flex-none gap-4">
        {session ? (
          <>
            <Link href="/blogs" className="btn btn-ghost">
              <NewspaperIcon className="h-5 w-5" />
              Blogs
            </Link>
            <Link href="/projects" className="btn btn-ghost">
              <FolderGit2 className="h-5 w-5" />
              Projects
            </Link>
            <Link href="/communities" className="btn btn-ghost">
              <Users className="h-5 w-5" />
              Communities
            </Link>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
                <div className="w-10 rounded-full">
                  <Image
                    src={session.user.image ?? "/default-avatar.png"}
                    alt="Profile"
                    width={40}
                    height={40}
                  />
                </div>
              </label>
              <ul className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
                <li>
                  <Link className="my-2 py-2" href="/profile">
                    Profile
                  </Link>
                  <Link className="my-2 py-2" href="/points-table">
                    Points Table 
                  </Link>
                </li>
                <li>
                  <SignOutButton />
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/auth/signIn" className="btn btn-ghost">
            <LogIn className="h-5 w-5" />
            Sign In
          </Link>
        )}
        <ThemeButton />
      </div>
    </div>
  );
}
