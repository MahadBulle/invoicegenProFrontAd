import React from "react"
import { Redirect } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Customers from "pages/Customers/Customers"
import Items from "pages/Items/Items"
import Invoices from "pages/invoices/Invoices"
import Users from "pages/Users/Users"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"


// Dashboard
import Dashboard from "../pages/Dashboard/index"

const userRoutes = [
  { path: "/dashboard", component: Dashboard },
  {path:"/Customers",component:Customers},
  {path:"/Items",component:Items},
  {path:"/Invoices",component:Invoices},
  {path:"/Users",component:Users},

  // // //profile
  { path: "/profile", component: UserProfile },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const authRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
]

export { userRoutes, authRoutes }
