import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import useLoginPage from "./hook";

export default function LoginPage() {
  const { control, error, onSubmit, showPassword, onToggle, loadingPage } =
    useLoginPage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and Features */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Academic Management System
                </h1>
                <p className="text-gray-600">
                  Manage students, teachers, and curriculum
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 w-full flex flex-col">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Student Management
                </h3>
                <p className="text-gray-600 text-sm">
                  Track student progress, grades, and academic status
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Curriculum Planning
                </h3>
                <p className="text-gray-600 text-sm">
                  Design and manage academic programs and courses
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Analytics & Reports
                </h3>
                <p className="text-gray-600 text-sm">
                  Generate insights and track institutional performance
                </p>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              Demo Credentials:
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>Viewer:</strong> viewer / viewer
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access the Academic Management System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        className="w-full"
                        disabled={loadingPage}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-red-600">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <div className="relative">
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full pr-10"
                          disabled={loadingPage}
                        />
                        <button
                          type="button"
                          onClick={onToggle}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          disabled={loadingPage}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {fieldState.error && (
                        <p className="text-sm text-red-600">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loadingPage}
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loadingPage}
              >
                {loadingPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Need help? Contact{" "}
              <a href="#" className="text-blue-600 hover:underline">
                IT Support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
