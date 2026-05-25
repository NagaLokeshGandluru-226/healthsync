import {useEffect, useState} from "react"

import axios from "axios"

import {
  CalendarDays,
  Users,
  FileText,
  IndianRupee,
  Activity,
} from "lucide-react"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalPrescriptions: 0,
    totalRevenue: 0,
  })

  const [appointments, setAppointments] =
    useState([])

  useEffect(() => {
    fetchDashboard()
    fetchAppointments()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(
        "https:/api/dashboard/summary"
      )

      setSummary(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "https:/api/appointments"
      )

      setAppointments(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const cards = [
    {
      title: "Appointments",
      value: summary.totalAppointments,
      icon: <CalendarDays size={30} />,
      color:
        "from-blue-500 to-blue-700",
    },

    {
      title: "Patients",
      value: summary.totalPatients,
      icon: <Users size={30} />,
      color:
        "from-green-500 to-green-700",
    },

    {
      title: "Prescriptions",
      value: summary.totalPrescriptions,
      icon: <FileText size={30} />,
      color:
        "from-purple-500 to-purple-700",
    },

    {
      title: "Revenue",
      value: `₹${summary.totalRevenue}`,
      icon: <IndianRupee size={30} />,
      color:
        "from-orange-500 to-orange-700",
    },
  ]

  const analyticsData = [
    {
      name: "Appointments",
      value: summary.totalAppointments,
    },

    {
      name: "Patients",
      value: summary.totalPatients,
    },

    {
      name: "Prescriptions",
      value: summary.totalPrescriptions,
    },
  ]

  const pieData = [
    {
      name: "Revenue",
      value: Number(summary.totalRevenue),
    },

    {
      name: "Patients",
      value: summary.totalPatients,
    },
  ]

  const COLORS = [
    "#3B82F6",
    "#10B981",
  ]

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-blue-600 p-4 rounded-3xl">
          <Activity
            className="text-white"
            size={34}
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Dashboard
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Clinic analytics and overview
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {cards.map(card => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.color} rounded-3xl p-7 shadow-xl text-white`}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl">
                {card.icon}
              </div>
            </div>

            <h2 className="text-lg font-medium opacity-90">
              {card.title}
            </h2>

            <p className="text-4xl font-bold mt-3">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
        {/* BAR CHART */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white">
            Clinic Statistics
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={analyticsData}>
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#3B82F6"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white">
            Revenue Overview
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT APPOINTMENTS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Recent Appointments
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left p-5 text-slate-700 dark:text-slate-300">
                  Patient
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-300">
                  Doctor
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-300">
                  Date
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-300">
                  Time
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-300">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {appointments
                .slice(0, 5)
                .map(appointment => (
                  <tr
                    key={appointment.id}
                    className="border-t border-slate-200 dark:border-slate-800"
                  >
                    <td className="p-5 text-slate-800 dark:text-white">
                      {
                        appointment.patient_name
                      }
                    </td>

                    <td className="p-5 text-slate-800 dark:text-white">
                      {
                        appointment.doctor_name
                      }
                    </td>

                    <td className="p-5 text-slate-800 dark:text-white">
                      {
                        appointment.appointment_date
                      }
                    </td>

                    <td className="p-5 text-slate-800 dark:text-white">
                      {
                        appointment.appointment_time
                      }
                    </td>

                    <td className="p-5">
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-4 py-2 rounded-xl font-semibold">
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {appointments.length === 0 && (
            <div className="p-10 text-center text-slate-500 dark:text-slate-400">
              No appointments found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard