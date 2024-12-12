import { useRef } from "react";

import axios from "axios";
<<<<<<< HEAD

=======
>>>>>>> parent of f2b56bd (de bugging)
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

<<<<<<< HEAD
export function Signup() {
    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
=======
export default function Signin() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
>>>>>>> parent of f2b56bd (de bugging)
    const navigate = useNavigate();

    async function signup() {
        const username = usernameRef.current?.value;
        console.log(usernameRef.current)
        const password = passwordRef.current?.value;
<<<<<<< HEAD
        await axios.post(BACKEND_URL + "/api/v1/signup", {
            username,
            password
        })
        navigate("/signin")
        alert("You have signed up!")
    }

    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input reference={usernameRef} placeholder="Username" />
            <Input reference={passwordRef} placeholder="Password" />
            <div className="flex justify-center pt-4">
                <Button onClick={signup} loading={false} variant="primary" text="Signup" fullWidth={true} />
=======
        try {
            const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
                username,
                password
            });
            //@ts-ignore
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error signing in:", error);
            // Handle error (e.g., display an error message)
        }
    }

    return (
        <div className="h-screen w-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-600 mt-2">Please sign in to continue</p>
                </div>

                <div className="space-y-4">
                    <Input reference={usernameRef} placeholder="Username" className="focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <Input reference={passwordRef} placeholder="Password" type="password" className="focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="flex justify-center mt-6">
                    <Button onClick={signin} loading={false} variant="primary" text="Sign In" fullWidth={true} />
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-indigo-600 hover:text-indigo-800">
                            Sign up here
                        </a>
                    </p>
                </div>
>>>>>>> parent of f2b56bd (de bugging)
            </div>
        </div>
    </div>
}