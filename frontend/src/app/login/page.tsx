"use client";

import { DEFAULT_AUTHED_REDIRECT } from "@/config/routes";
import { useAppDispatch } from "@/lib/hooks";
import { loginAdmin, loginUser } from "@/lib/services/api";
import { Button } from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const phoneRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex = /^[A-Za-z]+$/;
const schema = yup.object().shape({
    firstName: yup.string().matches(nameRegex, "Invalid first name").required("Required"),
    lastName: yup.string().matches(nameRegex, "Invalid last name").required("Required"),
    password: yup.string().matches(passwordRegex, "Invalid password").required("Required"),
    number: yup.string().matches(phoneRegex, "Invalid phone number (10 digits)").required("Required"),
    email: yup.string().matches(emailRegex, "Invalid email").required("Required"),
});

export default function Login() {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? DEFAULT_AUTHED_REDIRECT;
    const router = useRouter()

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            password: "",
            email: "",
            number: "",
        },
        mode: "onTouched",
    });

    const onSubmit = (data: any) => {
        console.log(data);

    };

    const adminLogin = async () => {
        const login = await loginAdmin(dispatch, { email: "work.akshgupta@gmail.com", password: "Aksh1326@" })
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
                {/* <Button onClick={() => adminLogin()} className={"bg-amber-400"}>
                    Login Admin
                </Button> */}
                {/* <br /> */}
                <Button onClick={() => userLogin()} className={"bg-amber-400"}>
                    Login User
                </Button>

                {/* <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-1/2 flex-1 gap-4">
                    <div className="">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" id="firstName" {...register("firstName")} className="w-3/4 px-3 py-2 border rounded-lg" />
                        {errors.firstName?.message && <p className="text-red-500">{errors.firstName.message}</p>}
                    </div>
                    <div className="">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" id="lastName" {...register("lastName")} className="w-3/4 px-3 py-2 border rounded-lg" />
                        {errors.lastName?.message && <p className="text-red-500">{errors.lastName.message}</p>}
                    </div>
                    <div className="">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" {...register("email")} className="w-3/4 px-3 py-2 border rounded-lg" />
                        {errors.email?.message && <p className="text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="">
                        <label htmlFor="number" className="block text-sm font-medium text-gray-700">Number</label>
                        <input type="text" id="number" {...register("number")} className="w-3/4 px-3 py-2 border rounded-lg" />
                        {errors.number?.message && <p className="text-red-500">{errors.number.message}</p>}
                    </div>
                    <div className="">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" {...register("password")} className="w-full px-3 py-2 border rounded-lg" />
                        {errors.password?.message && <p className="text-red-500">{errors.password.message}</p>}
                    </div>
                    <Button type="submit" className={"bg-amber-400"}>
                        Submit
                    </Button>
                </form> */}
            </div>
        </div>
    );
}
