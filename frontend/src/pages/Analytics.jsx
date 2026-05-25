const Analytics = () => {
  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-6xl font-bold mb-2">
          Analytics Dashboard
        </h1>

        <p className="text-slate-400 text-2xl">
          Overview of HealthSync system
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-xl">
          <p className="text-slate-400 text-xl">
            Total Appointments
          </p>

          <h2 className="text-5xl font-bold mt-4">
            120
          </h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-xl">
          <p className="text-slate-400 text-xl">
            Total Patients
          </p>

          <h2 className="text-5xl font-bold mt-4">
            86
          </h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-xl">
          <p className="text-slate-400 text-xl">
            Total Prescriptions
          </p>

          <h2 className="text-5xl font-bold mt-4">
            43
          </h2>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-xl">
          <p className="text-slate-400 text-xl">
            Total Revenue
          </p>

          <h2 className="text-5xl font-bold mt-4">
            ₹45,000
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8">
          <h2 className="text-3xl font-bold">
            Recent Appointments
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="text-left p-5">
                  Patient
                </th>

                <th className="text-left p-5">
                  Doctor
                </th>

                <th className="text-left p-5">
                  Date
                </th>

                <th className="text-left p-5">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t border-slate-800">
                <td className="p-5">
                  Rahul
                </td>

                <td className="p-5">
                  Dr. Sharma
                </td>

                <td className="p-5">
                  20 May 2026
                </td>

                <td className="p-5">
                  Completed
                </td>
              </tr>

              <tr className="border-t border-slate-800">
                <td className="p-5">
                  Priya
                </td>

                <td className="p-5">
                  Dr. Kumar
                </td>

                <td className="p-5">
                  21 May 2026
                </td>

                <td className="p-5">
                  Pending
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics