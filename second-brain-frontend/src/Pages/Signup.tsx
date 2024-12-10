import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function signup() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        try {
            const response = await axios.post(BACKEND_URL + "/api/v1/signup", {
                username,
                password
            });
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            navigate("/dashboard"); // Redirect to dashboard after successful sign-up
        } catch (error) {
            console.error("Error signing up:", error);
            // Handle error (e.g., display an error message)
        }
    }

    return (
        <div className="h-screen w-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Create an Account</h1>
                    <p className="text-gray-600 mt-2">Please sign up to get started</p>
                </div>

                <div className="space-y-4">
                    <Input reference={usernameRef} placeholder="Username" className="focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <Input reference={passwordRef} placeholder="Password" type="password" className="focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="flex justify-center mt-6">
                    <Button onClick={signup} loading={false} variant="primary" text="Sign Up" fullWidth={true} />
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/signin" className="text-indigo-600 hover:text-indigo-800">
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}