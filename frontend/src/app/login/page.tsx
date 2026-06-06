"use client";

import { DEFAULT_AUTHED_REDIRECT } from "@/config/routes";
import { useAppDispatch } from "@/lib/hooks";
import { loginUser } from "@/lib/services/api";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";


export default function Login() {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? DEFAULT_AUTHED_REDIRECT;
    const router = useRouter()

    const adminLogin = async () => {
        const login = await loginUser(dispatch, { email: "work.akshgupta@gmail.com", password: "Aksh1326@" })
        console.log(login);
        if (login.isLogin) {
            router.push("/admin-dashboard")
        }

    }
    const userLogin = async () => {
        const login = await loginUser(dispatch, { email: "work.akshgupta@gmail.com", password: "Aksh1326@" })
        console.log(login);
        if (login.isLogin) {
            if (callbackUrl === "/flights-review") {
                router.push(`${callbackUrl}?flight=${searchParams.get("flight")}&passengers=${searchParams.get("passengers")}`)
            } else {
                router.push(callbackUrl)
            }
        }

    }

    return (
        <div className="m-5">
            <div className="flex flex-col flex-1 items-center justify-center font-sans">

                <h1 className="font-bold text-2xl">Welcome to Aviation App</h1>
                <h1 className="font-bold text-2xl">Login</h1>
                <br />
                <Button onClick={() => adminLogin()} className={"bg-amber-400"}>
                    Login Admin
                </Button>
                <br />
                <Button onClick={() => userLogin()} className={"bg-amber-400"}>
                    Login User
                </Button>
            </div>
        </div>
    );
}
