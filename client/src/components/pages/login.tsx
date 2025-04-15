import { useState } from "react";
import {
  Eye,
  EyeOff,
  Calendar,
  Heart,
  ArrowRight,
  Loader,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "@/lib/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";

export default function Login() {
  // Login states
  const [showPassword, setShowPassword] = useState(false);
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Forgot password flow states
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [newPasswordDialogOpen, setNewPasswordDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Validates login inputs
  const validateInputs = () => {
    let validationError = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailId.trim()) {
      validationError += "Email is required.\n";
    } else if (!emailRegex.test(emailId)) {
      validationError += "Enter a valid email.\n";
    }
    if (!password.trim()) {
      validationError += "Password is required.\n";
    } else if (password.length < 6) {
      validationError += "Password must be at least 6 characters.\n";
    }
    setErrors(validationError.trim());
    return validationError === "";
  };

  // Standard login handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors("");

    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/login`,
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/dashboard");
    } catch (error: any) {
      setErrors(
        error?.response?.data || "An unexpected error occurred."
      );
      console.error("Login failed:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handler that triggers OTP email and opens OTP dialog
  const handleForgotPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailId.trim()) {
      toast.error("Email is required.");
      return;
    }
    if (!emailRegex.test(emailId)) {
      toast.error("Enter a valid email.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/forgot_password`,
        { emailId },
        { withCredentials: true }
      );
      toast.success(response.data.message || "OTP sent to your email.");
      setOtpDialogOpen(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // OTP submission handler: validates OTP length and opens new password dialog
  const handleSubmitOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }
    setOtpDialogOpen(false);
    setNewPasswordDialogOpen(true);
  };

  // New password submission handler: updates password through API call
  const handleSubmitNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword.trim().length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/reset_password`,
        { emailId, newPassword, otp },
        { withCredentials: true }
      );
      toast.success(response.data.message || "Password reset successful.");
      setNewPasswordDialogOpen(false);
      setOtp("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Error resetting password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6 gap-2">
          <Calendar className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">MoodTrack</h1>
        </div>
        <Card className="w-full shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to continue your mood tracking journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 text-red-600 border-red-200"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={emailId}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-200 focus:border-purple-500 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 cursor-pointer"
                    variant="link"
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-200 focus:border-purple-500 pr-10 rounded-md shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" /> Processing...
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-purple-600 hover:text-purple-700"
              >
                Sign up
              </a>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Heart className="h-3 w-3 text-red-500" />
              <span>Track your emotions, improve your wellbeing</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="rounded-lg p-6 bg-white shadow-lg">
          <form onSubmit={handleSubmitOtp}>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Enter OTP
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Please enter the 6‑digit OTP sent to your email.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="text"
              placeholder="6 digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="mt-4 border-gray-300 focus:border-purple-500 rounded-md shadow-sm"
            />
            <Button
              type="submit"
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white w-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader className="animate-spin h-5 w-5 mr-2" />
              )}
              Submit OTP
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Password Dialog */}
      <Dialog open={newPasswordDialogOpen} onOpenChange={setNewPasswordDialogOpen}>
        <DialogContent className="rounded-lg p-6 bg-white shadow-lg">
          <form onSubmit={handleSubmitNewPassword}>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Reset Password
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Please enter your new password.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-4 border-gray-300 focus:border-purple-500 rounded-md shadow-sm"
            />
            <Button
              type="submit"
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white w-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader className="animate-spin h-5 w-5 mr-2" />
              )}
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
