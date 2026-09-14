"use client";

import { Button, Tabs } from "@heroui/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Card from "@/components/common/Card";
import { DEFAULT_AUTHED_REDIRECT } from "@/config/routes";
import { useAppDispatch } from "@/lib/hooks";
import { loginAdmin, loginUser, userSignup } from "@/lib/services/api";
import sideImg from "../../assets/images/login-half.png";
import tajImg from "../../assets/images/login-taj.svg";
import towerImg from "../../assets/images/login-tower.svg";
import planImg from "../../assets/images/login-plan.svg";

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

const schemaLogin = yup.object().shape({
    password: yup.string().matches(passwordRegex, "Invalid password").required("Required"),
    email: yup.string().matches(emailRegex, "Invalid email").required("Required"),
});

export default function Login() {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? DEFAULT_AUTHED_REDIRECT;
    const router = useRouter()

    const { register: signupRegister, handleSubmit: signupSubmit, control: signupControl, watch: signupWatch, formState: { errors: signupErrors } } = useForm({
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
    const { register: loginUsers, handleSubmit: userLoginSubmit, control: userLoginControl, watch: userLoginWatch, formState: { errors: userLoginErrors } } = useForm({
        resolver: yupResolver(schemaLogin),
        defaultValues: {
            password: "",
            email: "",
        },
        mode: "onTouched",
    });

    const signup = async (data: any) => {
        console.log(data);
        const res = await userSignup(dispatch, data)
        console.log(res);
        if (res.isLogin) {
            if (callbackUrl === "/flights-review") {
                router.push(`${callbackUrl}?flight=${searchParams.get("flight")}&passengers=${searchParams.get("passengers")}`)
            } else {
                router.push(callbackUrl)
            }
        }
    };
    const login = async (data: any) => {
        console.log(data);
        const res = await loginUser(dispatch, data)
        console.log(res);
        if (res.isLogin) {
            if (callbackUrl === "/flights-review") {
                router.push(`${callbackUrl}?flight=${searchParams.get("flight")}&passengers=${searchParams.get("passengers")}`)
            } else {
                router.push(callbackUrl)
            }
        }
    }

    return (
        <div className="relative flex-1 grid grid-cols-1 md:grid-cols-2 min-h-[calc(100dvh-72px)] md:h-[calc(100dvh-72px)] w-full overflow-hidden bg-gray-50/50">
            {/* Plane Decorative Graphic */}
            <Image
                src={planImg}
                alt="Airplane illustration"
                className="pointer-events-none select-none absolute top-0 right-0 w-48 sm:w-36 md:w-44 lg:w-56 xl:w-72 opacity-60 md:opacity-90 z-0"
                priority={false}
            />

            {/* Left Column: Side Image (Desktop & Tablets) */}
            <div className="relative hidden md:block w-full h-full min-h-full overflow-hidden bg-gray-900">
                <Image
                    src={sideImg}
                    alt="Aviation Flight"
                    fill
                    priority
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center w-full h-full"
                />
            </div>

            {/* Right Column: Form Container */}
            <div className="flex flex-col justify-center items-center w-full px-4 sm:px-8 md:px-6 lg:px-12 py-8 overflow-y-auto relative z-10">
                <div className="w-full max-w-md mx-auto my-auto">
                    <div className="mb-6 text-center md:text-left">
                        <h1 className="font-bold text-2xl sm:text-3xl text-gray-900 tracking-tight">Welcome to Aviora</h1>
                        <p className="text-sm text-gray-500 mt-1">Sign in or create an account to manage your flights</p>
                    </div>

                    <Tabs className="w-full">
                        <Tabs.ListContainer className="mb-4">
                            <Tabs.List aria-label="Authentication Options" className="w-full grid grid-cols-2">
                                <Tabs.Tab id="login" className="py-2 text-sm font-semibold cursor-pointer">
                                    Login
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                                <Tabs.Tab id="signup" className="py-2 text-sm font-semibold cursor-pointer">
                                    Sign Up
                                    <Tabs.Indicator />
                                </Tabs.Tab>
                            </Tabs.List>
                        </Tabs.ListContainer>

                        <Tabs.Panel id="login">
                            <Card className="w-full p-6 shadow-sm border border-gray-100">
                                <form onSubmit={userLoginSubmit(login)} className="flex flex-col w-full gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="you@example.com"
                                            {...loginUsers("email")}
                                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                        />
                                        {userLoginErrors.email?.message && (
                                            <p className="text-xs text-red-500 font-medium">{userLoginErrors.email.message}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="••••••••"
                                            {...loginUsers("password")}
                                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                        />
                                        {userLoginErrors.password?.message && (
                                            <p className="text-xs text-red-500 font-medium">{userLoginErrors.password.message}</p>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full mt-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-gray-900 font-semibold py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                                    >
                                        Login
                                    </Button>
                                </form>
                            </Card>
                        </Tabs.Panel>

                        <Tabs.Panel id="signup">
                            <Card className="w-full p-6 shadow-sm border border-gray-100">
                                <form onSubmit={signupSubmit(signup)} className="flex flex-col w-full gap-3.5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="firstName" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                placeholder="John"
                                                {...signupRegister("firstName")}
                                                className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                            />
                                            {signupErrors.firstName?.message && (
                                                <p className="text-xs text-red-500 font-medium">{signupErrors.firstName.message}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="lastName" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                placeholder="Doe"
                                                {...signupRegister("lastName")}
                                                className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                            />
                                            {signupErrors.lastName?.message && (
                                                <p className="text-xs text-red-500 font-medium">{signupErrors.lastName.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="signupEmail" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="signupEmail"
                                            placeholder="you@example.com"
                                            {...signupRegister("email")}
                                            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                        />
                                        {signupErrors.email?.message && (
                                            <p className="text-xs text-red-500 font-medium">{signupErrors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="number" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="number"
                                            placeholder="9876543210"
                                            {...signupRegister("number")}
                                            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                        />
                                        {signupErrors.number?.message && (
                                            <p className="text-xs text-red-500 font-medium">{signupErrors.number.message}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="signupPassword" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="signupPassword"
                                            placeholder="••••••••"
                                            {...signupRegister("password")}
                                            className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                        />
                                        {signupErrors.password?.message && (
                                            <p className="text-xs text-red-500 font-medium">{signupErrors.password.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full mt-2 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-gray-900 font-semibold py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                                    >
                                        Create Account
                                    </Button>
                                </form>
                            </Card>
                        </Tabs.Panel>
                    </Tabs>
                </div>
            </div>

            {/* Background Decorative SVGs for Large Displays */}
            <Image
                src={tajImg}
                alt="Taj graphic"
                className="pointer-events-none select-none hidden md:block absolute bottom-0 left-[50%] -translate-x-1/2 w-40 opacity-50 z-0"
                priority={false}
            />
            <Image
                src={towerImg}
                alt="Tower graphic"
                className="pointer-events-none select-none hidden md:block absolute bottom-0 right-0 w-36 opacity-50 z-0"
                priority={false}
            />
        </div>
    );
}
