import { AuthWrapper } from "../components/AuthWrapper";
export const Login = () => (
    <AuthWrapper title="Login to Your Account">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Login</button>
        </div>

        <div className="mt-6 flex items-center justify-between">
            <span className="border-t w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase">or login with</span>
            <span className="border-t w-1/5 lg:w-1/4"></span>
        </div>

        <div className="mt-4 flex flex-col gap-3">
            <button
                className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-100"
                onClick={() => {
                    window.location.href = "http://localhost:3000/auth/google"
                }}>
                {/* <img src="/icons/google.svg" alt="Google" className="w-5 h-5" /> */}
                Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-100">
                {/* <img src="/icons/github.svg" alt="GitHub" className="w-5 h-5" /> */}
                Continue with GitHub
            </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?
            <a href="/signup" className="text-blue-600 hover:underline ml-1">
                Sign up
            </a>
        </p>
    </AuthWrapper>
);
