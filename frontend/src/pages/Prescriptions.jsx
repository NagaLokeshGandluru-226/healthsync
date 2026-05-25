import {useEffect, useState} from "react"

import axios from "axios"

import {
  FileText,
  Search,
  Trash2,
  Pill,
} from "lucide-react"

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] =
    useState([])

  const [formData, setFormData] = useState({
    patient_name: "",
    doctor_name: "",
    medicines: "",
    dosage: "",
    instructions: "",
  })

  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(
        "https://healthsync-771s.onrender.com//healthsync-771s.onrender.com/api/prescriptions"
      )

      setPrescriptions(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const createPrescription = async event => {
    event.preventDefault()

    try {
      await axios.post(
        "https://healthsync-771s.onrender.com//healthsync-771s.onrender.com/api/prescriptions",
        formData
      )

      setFormData({
        patient_name: "",
        doctor_name: "",
        medicines: "",
        dosage: "",
        instructions: "",
      })

      fetchPrescriptions()
    } catch (error) {
      console.log(error)
    }
  }

  const deletePrescription = async id => {
    const confirmDelete = window.confirm(
      "Delete prescription?"
    )

    if (!confirmDelete) {
      return
    }

    try {
      await axios.delete(
        `https://healthsync-771s.onrender.com//healthsync-771s.onrender.com/api/prescriptions/${id}`
      )

      fetchPrescriptions()
    } catch (error) {
      console.log(error)
    }
  }

  const filteredPrescriptions =
    prescriptions.filter(item =>
      item.patient_name
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-purple-600 p-4 rounded-3xl">
          <Pill className="text-white" size={34} />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Prescriptions
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Manage patient prescriptions and medicines
          </p>
        </div>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800 mb-10">
        <div className="flex items-center gap-3 mb-8">
          <FileText
            className="text-purple-500"
            size={28}
          />

          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Create Prescription
          </h2>
        </div>

        <form
          onSubmit={createPrescription}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <input
            type="text"
            name="patient_name"
            placeholder="Patient Name"
            value={formData.patient_name}
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
            required
          />

          <input
            type="text"
            name="doctor_name"
            placeholder="Doctor Name"
            value={formData.doctor_name}
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
            required
          />

          <textarea
            name="medicines"
            placeholder="Medicines"
            value={formData.medicines}
            onChange={handleChange}
            rows="4"
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
            required
          />

          <textarea
            name="dosage"
            placeholder="Dosage Details"
            value={formData.dosage}
            onChange={handleChange}
            rows="4"
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
            required
          />

          <textarea
            name="instructions"
            placeholder="Instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows="4"
            className="md:col-span-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
            required
          />

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 transition-all text-white font-semibold rounded-2xl p-4"
          >
            Create Prescription
          </button>
        </form>
      </div>

      {/* SEARCH */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <Search
            className="text-purple-500"
            size={24}
          />

          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Search Prescriptions
          </h2>
        </div>

        <input
          type="text"
          placeholder="Search by patient name..."
          value={search}
          onChange={event =>
            setSearch(event.target.value)
          }
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 outline-none text-slate-800 dark:text-white"
        />
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
                  Medicines
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-300">
                  Dosage
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-300">
                  Instructions
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPrescriptions.map(
                prescription => (
                  <tr
                    key={prescription.id}
                    className="border-t border-slate-200 dark:border-slate-800"
                  >
                    <td className="p-5 text-slate-800 dark:text-white">
                      {
                        prescription.patient_name
                      }
                    </td>

                    <td className="p-5 text-slate-800 dark:text-white">
                      {
                        prescription.doctor_name
                      }
                    </td>

                    <td className="p-5 text-slate-800 dark:text-white">
                      {
                        prescription.medicines
                      }
                    </td>

                    <td className="p-5 text-slate-800 dark:text-white">
                      {prescription.dosage}
                    </td>

                    <td className="p-5 text-slate-800 dark:text-white">
                      {
                        prescription.instructions
                      }
                    </td>

                    <td className="p-5">
                      <button
                        onClick={() =>
                          deletePrescription(
                            prescription.id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 transition-all text-white p-3 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {filteredPrescriptions.length ===
            0 && (
            <div className="p-10 text-center text-slate-500 dark:text-slate-400">
              No prescriptions found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Prescriptions