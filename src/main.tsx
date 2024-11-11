import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Toaster as ShadcnToaster } from "./components/ui/toaster";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import ErrorPage from "./error-page";
import "./index.css";
import AuthLayout from "./routes/auth/auth-layout";
import LoginPage from "./routes/auth/login";
import SignUpPage from "./routes/auth/sign-up";
import LandingPage from "./routes/Landing";
import HomeLayoutPage from "./routes/protected/home-layout";
import Dashboard from "./routes/protected/Dashboard";
import Teachers from "./routes/protected/teachers";
import Settings from "./routes/protected/settings";
import Profile from "./routes/protected/profile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StudentManagement from "./routes/protected/StudentManagement";
import SubjectManagement from "./routes/protected/SubjectManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "signup",
        element: <SignUpPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/",
    element: <HomeLayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/students",
        element: <StudentManagement />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/Teachers",
        element: <Teachers />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/subjects",
        element: <SubjectManagement />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/settings",
        element: <Settings />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
        <ShadcnToaster />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
