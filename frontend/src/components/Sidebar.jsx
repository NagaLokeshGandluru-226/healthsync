import {Link, useLocation, useNavigate} from "react-router-dom"

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  LogOut,
  Moon,
  Sun,
} from "lucide-react"

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const user = JSON.parse(
    localStorage.getItem("healthsync_user")
  )

  const darkMode =
    localStorage.getItem("healthsync_theme") ===
    "dark"

  const toggleTheme = () => {
    if (darkMode) {
      localStorage.setItem(
        "healthsync_theme",
        "light"
      )
    } else {
      localStorage.setItem(
        "healthsync_theme",
        "dark"
      )
    }

    window.location.reload()
  }

  const logout = () => {
    localStorage.removeItem("healthsync_user")
    navigate("/login")
  }

  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={22} />,
      roles: ["admin", "doctor", "patient"],
    },

    {
      title: "Appointments",
      path: "/appointments",
      icon: <CalendarDays size={22} />,
      roles: ["admin", "doctor", "patient"],
    },

    {
      title: "Patients",
      path: "/patients",
      icon: <Users size={22} />,
      roles: ["admin", "doctor"],
    },

    {
      title: "Prescriptions",
      path: "/prescriptions",
      icon: <FileText size={22} />,
      roles: ["admin", "doctor", "patient"],
    },

    {
      title: "Billing",
      path: "/billing",
      icon: <CreditCard size={22} />,
      roles: ["admin"],
    },

    {
      title: "Analytics",
      path: "/analytics",
      icon: <BarChart3 size={22} />,
      roles: ["admin"],
    },
  ]

  return (
    <div
      className={`w-[300px] min-h-screen border-r flex flex-col justify-between p-7 ${
        darkMode
          ? "bg-[#081028] border-[#172036]"
          : "bg-white border-slate-200"
      }`}
    >
      <div>
        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-5xl font-black text-blue-600">
            HealthSync
          </h1>

          <p
            className={`mt-3 text-lg ${
              darkMode
                ? "text-slate-400"
                : "text-slate-600"
            }`}
          >
            Hospital Management
          </p>
        </div>

        {/* USER CARD */}
        <div
          className={`rounded-3xl p-6 mb-10 ${
            darkMode
              ? "bg-[#131c31]"
              : "bg-slate-100"
          }`}
        >
          <h2
            className={`text-3xl font-bold ${
              darkMode
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            {user?.name}
          </h2>

          <p className="text-blue-500 capitalize mt-2 text-lg">
            {user?.role}
          </p>
        </div>

        {/* MENU */}
        <div className="space-y-3">
          {menuItems
            .filter(item =>
              item.roles.includes(user?.role)
            )
            .map(item => {
              const active =
                location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                    active
                      ? "bg-blue-600 text-white"
                      : darkMode
                      ? "text-slate-300 hover:bg-[#131c31]"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.icon}
                  {item.title}
                </Link>
              )
            })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="space-y-4">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-semibold transition-all ${
            darkMode
              ? "bg-[#131c31] text-white hover:bg-[#1a2744]"
              : "bg-slate-100 text-slate-900 hover:bg-slate-200"
          }`}
        >
          {darkMode ? (
            <>
              <Sun size={22} />
              Light Mode
            </>
          ) : (
            <>
              <Moon size={22} />
              Dark Mode
            </>
          )}
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
        >
          <LogOut size={22} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar