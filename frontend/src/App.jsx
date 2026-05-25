import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"

import Sidebar from "./components/Sidebar"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Appointments from "./pages/Appointments"
import PatientRecords from "./pages/PatientRecords"
import Prescriptions from "./pages/Prescriptions"
import Billing from "./pages/Billing"
import Analytics from "./pages/Analytics"

import "./index.css"

const ProtectedLayout = ({
  children,
  allowedRoles = [],
}) => {
  const user = JSON.parse(
    localStorage.getItem("healthsync_user")
  )

  const darkMode =
    localStorage.getItem("healthsync_theme") ===
    "dark"

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // ROLE CHECK
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />
  }

  return (
    <div
      className={`flex min-h-screen ${
        darkMode
          ? "bg-[#020817]"
          : "bg-slate-100"
      }`}
    >
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedLayout
              allowedRoles={[
                "admin",
                "doctor",
                "patient",
              ]}
            >
              <Dashboard />
            </ProtectedLayout>
          }
        />

        {/* APPOINTMENTS */}
        <Route
          path="/appointments"
          element={
            <ProtectedLayout
              allowedRoles={[
                "admin",
                "doctor",
                "patient",
              ]}
            >
              <Appointments />
            </ProtectedLayout>
          }
        />

        {/* PATIENT RECORDS */}
        <Route
          path="/patients"
          element={
            <ProtectedLayout
              allowedRoles={[
                "admin",
                "doctor",
              ]}
            >
              <PatientRecords />
            </ProtectedLayout>
          }
        />

        {/* PRESCRIPTIONS */}
        <Route
          path="/prescriptions"
          element={
            <ProtectedLayout
              allowedRoles={[
                "admin",
                "doctor",
                "patient",
              ]}
            >
              <Prescriptions />
            </ProtectedLayout>
          }
        />

        {/* BILLING */}
        <Route
          path="/billing"
          element={
            <ProtectedLayout
              allowedRoles={["admin"]}
            >
              <Billing />
            </ProtectedLayout>
          }
        />

        {/* ANALYTICS */}
        <Route
          path="/analytics"
          element={
            <ProtectedLayout
              allowedRoles={["admin"]}
            >
              <Analytics />
            </ProtectedLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App