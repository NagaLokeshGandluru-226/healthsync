import {useEffect, useState} from "react"

import axios from "axios"

import {
  CalendarDays,
  Trash2,
  Search,
} from "lucide-react"

const statusColors = {
  Scheduled:
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",

  Completed:
    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",

  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",

  "No Show":
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",

  Rescheduled:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
}

const Appointments = () => {
  const [appointments, setAppointments] = useState([])

  const [formData, setFormData] = useState({
    patient_name: "",
    doctor_name: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
  })

  const [filters, setFilters] = useState({
    patient_name: "",
    doctor_name: "",
    status: "",
    appointment_date: "",
  })

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://https://healthsync-771s.onrender.com/api/appointments",
        {
          params: filters,
        }
      )

      setAppointments(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [filters])

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleFilterChange = event => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    })
  }

  const createAppointment = async event => {
    event.preventDefault()

    try {
      await axios.post(
        "http://https://healthsync-771s.onrender.com/api/appointments",
        formData
      )

      setFormData({
        patient_name: "",
        doctor_name: "",
        appointment_date: "",
        appointment_time: "",
        reason: "",
      })

      fetchAppointments()
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Something went wrong"
      )
    }
  }

  const deleteAppointment = async id => {
    const confirmDelete = window.confirm(
      "Delete appointment?"
    )

    if (!confirmDelete) {
      return
    }

    try {
      await axios.delete(
        `http://https://healthsync-771s.onrender.com/api/appointments/${id}`
      )

      fetchAppointments()
    } catch (error) {
      console.log(error)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://https://healthsync-771s.onrender.com/api/appointments/${id}/status`,
        {status}
      )

      fetchAppointments()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <CalendarDays
          className="text-blue-500"
          size={36}
        />

        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Appointments
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage clinic appointments efficiently
          </p>
        </div>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
          Create Appointment
        </h2>

        <form
          onSubmit={createAppointment}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            type="text"
            name="patient_name"
            placeholder="Patient Name"
            value={formData.patient_name}
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
          />

          <input
            type="text"
            name="doctor_name"
            placeholder="Doctor Name"
            value={formData.doctor_name}
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
          />

          <input
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
          />

          <input
            type="time"
            name="appointment_time"
            value={formData.appointment_time}
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
          />

          <input
            type="text"
            name="reason"
            placeholder="Reason"
            value={formData.reason}
            onChange={handleChange}
            className="md:col-span-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold rounded-2xl p-4"
          >
            Create Appointment
          </button>
        </form>
      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Search
            className="text-blue-500"
            size={24}
          />

          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Search & Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="patient_name"
            placeholder="Patient Name"
            value={filters.patient_name}
            onChange={handleFilterChange}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
          />

          <input
            type="text"
            name="doctor_name"
            placeholder="Doctor Name"
            value={filters.doctor_name}
            onChange={handleFilterChange}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
          />

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
          >
            <option value="">All Status</option>

            <option value="Scheduled">
              Scheduled
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

            <option value="No Show">
              No Show
            </option>

            <option value="Rescheduled">
              Rescheduled
            </option>
          </select>

          <input
            type="date"
            name="appointment_date"
            value={filters.appointment_date}
            onChange={handleFilterChange}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
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
                  Reason
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-300">
                  Status
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {appointments.map(appointment => (
                <tr
                  key={appointment.id}
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  <td className="p-5 text-slate-800 dark:text-white">
                    {appointment.patient_name}
                  </td>

                  <td className="p-5 text-slate-800 dark:text-white">
                    {appointment.doctor_name}
                  </td>

                  <td className="p-5 text-slate-800 dark:text-white">
                    {appointment.appointment_date}
                  </td>

                  <td className="p-5 text-slate-800 dark:text-white">
                    {appointment.appointment_time}
                  </td>

                  <td className="p-5 text-slate-800 dark:text-white">
                    {appointment.reason}
                  </td>

                  <td className="p-5">
                    <select
                      value={appointment.status}
                      onChange={event =>
                        updateStatus(
                          appointment.id,
                          event.target.value
                        )
                      }
                      className={`px-4 py-2 rounded-xl font-semibold outline-none ${statusColors[appointment.status]}`}
                    >
                      <option value="Scheduled">
                        Scheduled
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                      <option value="No Show">
                        No Show
                      </option>

                      <option value="Rescheduled">
                        Rescheduled
                      </option>
                    </select>
                  </td>

                  <td className="p-5">
                    <button
                      onClick={() =>
                        deleteAppointment(
                          appointment.id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 transition-all text-white p-3 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
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

export default Appointments