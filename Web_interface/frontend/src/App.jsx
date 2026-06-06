import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Chat from "./Pages/Chat";
import Libraries from "./Pages/Libraries";
import BlogPost from "./Pages/BlogPost";
import Admin from "./Pages/Admin";
import Profile from "./Pages/Profile";
import Signin from "./Auth/Signin";
import Register from "./Auth/Register";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--bg)] text-[color:var(--text-h)]">
      <Header />
      <main className="flex-1 pt-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <ContactUs />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "libraries", 
        element: <Libraries />, 
      },
      {
        path: "libraries/:slug",
        element: <BlogPost />,
      },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;