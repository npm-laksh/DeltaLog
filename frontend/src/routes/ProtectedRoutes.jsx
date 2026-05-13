import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoutes = () => {
    const token = localStorage.getItem("token");

    // if no token exists, redirect to login
    if(!token) {
        return(
            <Navigate to="/login" replace/>
        )
    }
  return (
    // if token exists, render the child routes 
    <Outlet />
  )
}
