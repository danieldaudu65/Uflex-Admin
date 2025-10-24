import React, { useState } from "react";
import { logo, success } from "../assets";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../components/modalParent";
import LogoLoader from "../components/LogoLoader";
import { apiRequest } from "../utils/api";
import { toast } from "react-hot-toast";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const MIN_LOADER_TIME = 3000; // minimum loader duration (3s)

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      const res = await apiRequest("/admin_auth/login", "POST", { email, password });

      // Save token & admin data
      localStorage.setItem("token", res.token);
      localStorage.setItem("admin", JSON.stringify(res.admin));

      // Enforce loader delay
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_LOADER_TIME) {
        await new Promise((r) => setTimeout(r, MIN_LOADER_TIME - elapsed));
      }

      toast.success("Login successful!");
      setModal(true);

      // 🚀 Navigate immediately (removed timeout delay)
      navigate("/dashboard");
    } catch (err: any) {
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_LOADER_TIME) {
        await new Promise((r) => setTimeout(r, MIN_LOADER_TIME - elapsed));
      }
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <LogoLoader isLoading={loading} />

      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl shadow-md rounded-2xl p-8 sm:p-10 md:p-12">
        {/* Logo + Title */}
        <div className="flex flex-col justify-center items-center mb-10">
          <img src={logo} alt="Logo" className="w-32 sm:w-40 md:w-48 mb-3" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
            Admin Login
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="flex flex-col text-sm">
            <label htmlFor="email" className="font-medium mb-1 text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border placeholder:text-xs outline-green-main hover:border-green-main border-gray-300 p-3 rounded-md text-gray-800"
            />
          </div>

          <div className="flex flex-col text-sm relative">
            <label htmlFor="password" className="font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border placeholder:text-xs outline-green-main hover:border-green-main border-gray-300 p-3 rounded-md text-gray-800 pr-16"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-[38px] text-green-main font-bold text-xs cursor-pointer select-none"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full bg-green-main text-black font-bold py-3 rounded-md mt-8 transition-all hover:opacity-90 ${loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* Footer link */}
          {/* <p className="text-sm text-center mt-3 text-gray-700">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-main font-semibold hover:underline">
              Create one
            </Link>
          </p> */}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ModalWrapper isOpen onClose={() => setModal(false)}>
          <div className="bg-white flex flex-col p-6 rounded-lg shadow-md w-[90%] max-w-md m-auto text-center">
            <img
              src={success}
              alt="success"
              className="w-20 h-20 flex justify-center items-center m-auto mb-6"
            />
            <h2 className="text-lg font-extrabold mb-2">Login Successful</h2>
            <p className="text-md text-gray-600 mb-6 px-6">
              You have successfully logged in. Redirecting to dashboard...
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(false)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-sm"
              >
                Close
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-[#65CE00] text-black font-bold rounded-lg py-2 text-sm"
              >
                Continue
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default Login;
