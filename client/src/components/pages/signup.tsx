import { useState } from "react";
import { Eye, EyeOff, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "@/lib/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/lib/constants";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !emailId || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the terms of service");
      return;
    }

    setError("");
    try {
      setIsLoading(true);
      // Make POST call to the /signup route with username, email, and password.
      const res = await axios.post(
        `${BASE_URL}/auth/signup`,
        {
          username: name, // sending username (or name) as required by the endpoint
          emailId,
          password,
        },
        { withCredentials: true }
      );
      // Check if the response data exists and dispatch user information to Redux store.
      if (res && res.data) {
        dispatch(addUser(res.data.data));
        navigate("/dashboard");
      } else {
        setError("Unexpected response from server");
      }
      setIsLoading(false);
    } catch (err: any) {
      setError(err?.response?.data || "An unexpected error occurred.");
      console.error("Signup failed:", err.message);
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
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Start your emotional wellbeing journey today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-gray-200 focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@email.com"
                  value={emailId}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-200 focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-200 focus:border-purple-500 pr-10"
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
                <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="border-gray-300 text-purple-600"
                />
                <label 
                  htmlFor="terms" 
                  className="text-sm text-gray-600 leading-tight"
                >
                  I agree to the{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                Create account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-purple-600 hover:text-purple-700">
                Sign in
              </a>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Track daily moods</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Visualize patterns</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Improve wellbeing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
