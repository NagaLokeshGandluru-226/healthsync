import {useState, useEffect} from "react"
import axios from "axios"

const PatientRecords = () => {
  const [patients, setPatients] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    diagnosis: "",
    prescription: "",
  })

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/patients"
      )

      setPatients(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await axios.post(
        "http://localhost:5000/api/patients",
        formData
      )

      setFormData({
        name: "",
        age: "",
        gender: "",
        diagnosis: "",
        prescription: "",
      })

      fetchPatients()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-6xl font-bold mb-2">
          Patient Records
        </h1>

        <p className="text-slate-400 text-2xl">
          Manage patient medical records
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-10 shadow-2xl mb-10">
        <h2 className="text-4xl font-bold mb-8">
          Add Patient
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Patient Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-[#0b1324] border border-slate-700 rounded-2xl p-5 text-lg outline-none"
              required
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="bg-[#0b1324] border border-slate-700 rounded-2xl p-5 text-lg outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="bg-[#0b1324] border border-slate-700 rounded-2xl p-5 text-lg outline-none"
              required
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>
            </select>

            <input
              type="text"
              name="diagnosis"
              placeholder="Diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="bg-[#0b1324] border border-slate-700 rounded-2xl p-5 text-lg outline-none"
              required
            />
          </div>

          <textarea
            name="prescription"
            placeholder="Prescription"
            value={formData.prescription}
            onChange={handleChange}
            rows="5"
            className="w-full bg-[#0b1324] border border-slate-700 rounded-2xl p-5 text-lg outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-2xl py-5 text-xl font-semibold"
          >
            Add Patient
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8">
          <h2 className="text-3xl font-bold">
            Patient List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="text-left p-5">
                  Name
                </th>

                <th className="text-left p-5">
                  Age
                </th>

                <th className="text-left p-5">
                  Gender
                </th>

                <th className="text-left p-5">
                  Diagnosis
                </th>
              </tr>
            </thead>

            <tbody>
              {patients.length > 0 ? (
                patients.map(patient => (
                  <tr
                    key={patient.id}
                    className="border-t border-slate-800"
                  >
                    <td className="p-5">
                      {patient.name}
                    </td>

                    <td className="p-5">
                      {patient.age}
                    </td>

                    <td className="p-5">
                      {patient.gender}
                    </td>

                    <td className="p-5">
                      {patient.diagnosis}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-10 text-slate-400"
                  >
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PatientRecords