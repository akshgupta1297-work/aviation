"use client";

import { useAppDispatch } from "@/lib/hooks";
import { loginUser } from "@/lib/services/api";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter()

  const userLogin = async () => {
    const login = await loginUser(dispatch, { email: "work.akshgupta@gmail.com", password: "Aksh1326@" })
    console.log(login);
    if (login.isLogin) {
      router.push("/dashboard")
    }

  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      Home

      <Button onClick={() => userLogin()} className={"bg-amber-400"}>
        Login
      </Button>

      <Link href={"/dashboard"}>Dashboard</Link>
    </div>
  );
}
