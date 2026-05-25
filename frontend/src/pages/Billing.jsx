import {useState, useEffect} from "react"
import axios from "axios"

const Billing = () => {
  const [bills, setBills] = useState([])

  const [formData, setFormData] = useState({
    patient_name: "",
    doctor_name: "",
    treatment: "",
    amount: "",
    status: "Paid",
    billing_date: "",
  })

  const fetchBills = async () => {
    try {
      const response = await axios.get(
        "https://healthsync-771s.onrender.com//healthsync-771s.onrender.com/api/billing"
      )

      setBills(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchBills()
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
        "https://healthsync-771s.onrender.com//healthsync-771s.onrender.com/api/billing",
        formData
      )

      fetchBills()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-6xl font-bold mb-2">
          Billing
        </h1>

        <p className="text-slate-400 text-2xl">
          Manage patient invoices
        </p>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-10 shadow-2xl">
        <h2 className="text-4xl font-bold mb-8">
          Create Invoice
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="patient_name"
              placeholder="Patient Name"
              value={formData.patient_name}
              onChange={handleChange}
              className="bg-[#0b1324] border border-slate-700 rounded-2xl p-5"
              required
            />

            <input
              type="text"
              name="doctor_name"
              placeholder="Doctor Name"
              value={formData.doctor_name}
              onChange={handleChange}
              className="bg-[#0b1324] border border-slate-700 rounded-2xl p-5"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="treatment"
              placeholder="Treatment"
              value={formData.treatment}
              onChange={handleChange}
              className="bg-[#0b1324] border border-slate-700 rounded-2xl p-5"
              required
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="bg-[#0b1324] border border-slate-700 rounded-2xl p-5"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-[#0b1324] border border-slate-700 rounded-2xl p-5"
            >
              <option>Paid</option>
              <option>Pending</option>
            </select>

            <input
              type="date"
              name="billing_date"
              value={formData.billing_date}
              onChange={handleChange}
              className="bg-[#0b1324] border border-slate-700 rounded-2xl p-5"
              required
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-2xl py-5 text-xl font-semibold">
            Create Bill
          </button>
        </form>
      </div>
    </div>
  )
}

export default Billing