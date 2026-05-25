import {useState} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"

const Login = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleLogin = async event => {
  event.preventDefault()

  try {
    setLoading(true)

    const response = await axios.post(
      "http://https://healthsync-771s.onrender.com/api/login",
      formData
    )

    const loggedInUser = response.data.user

    localStorage.setItem(
      "healthsync_user",
      JSON.stringify(loggedInUser)
    )

    alert("Login Successful")

    // ROLE-BASED REDIRECT

    if (loggedInUser.role === "admin") {
      navigate("/")
    } else if (loggedInUser.role === "doctor") {
      navigate("/prescriptions")
    } else if (loggedInUser.role === "patient") {
      navigate("/appointments")
    } else {
      navigate("/")
    }
  } catch (error) {
    console.log(error)

    alert(
      error.response?.data?.message || "Login failed"
    )
  } finally {
    setLoading(false)
  }
}

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(to right, #0f172a, #1e3a8a)",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#ffffff",
          padding: "50px",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "64px",
            marginBottom: "10px",
            color: "#0f172a",
          }}
        >
          HealthSync
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "20px",
            marginBottom: "50px",
          }}
        >
          Hospital Management System
        </p>

        <div style={{marginBottom: "25px"}}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "600",
              fontSize: "18px",
              color: "#0f172a",
            }}
          >
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "14px",
              border: "1px solid #cbd5e1",
              fontSize: "18px",
              outline: "none",
            }}
          />
        </div>

        <div style={{marginBottom: "35px"}}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "600",
              fontSize: "18px",
              color: "#0f172a",
            }}
          >
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "14px",
              border: "1px solid #cbd5e1",
              fontSize: "18px",
              outline: "none",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "18px",
            border: "none",
            borderRadius: "14px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div
          style={{
            marginTop: "40px",
            backgroundColor: "#f1f5f9",
            padding: "24px",
            borderRadius: "16px",
          }}
        >
          <h3
            style={{
              marginBottom: "18px",
              color: "#0f172a",
            }}
          >
            Demo Accounts
          </h3>

          <p style={{marginBottom: "12px"}}>
            <strong>Admin:</strong>
            {" "}
            admin@healthsync.com / admin123
          </p>

          <p style={{marginBottom: "12px"}}>
            <strong>Doctor:</strong>
            {" "}
            doctor@healthsync.com / doctor123
          </p>

          <p>
            <strong>Patient:</strong>
            {" "}
            patient@healthsync.com / patient123
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login