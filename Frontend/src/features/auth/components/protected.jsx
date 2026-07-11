import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import RingLoader from '../../../components/RingLoader'

const Protected = ({ children }) => {
  const { loading, user } = useAuth()



  if (loading) {
    return <RingLoader title="Verifying your session..." subtitle="Please wait a moment" />
  }

  if (!user) {
    return <Navigate to={'/login'} />
  }

  return children
}

export default Protected