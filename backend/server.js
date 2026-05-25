const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const cors = require("cors")
const bcrypt = require("bcryptjs")

const app = express()

// ==========================
// MIDDLEWARE
// ==========================

app.use(cors())
app.use(express.json())

// ==========================
// DATABASE CONNECTION
// ==========================

const db = new sqlite3.Database(
  "./healthsync.db",
  error => {
    if (error) {
      console.log(error.message)
    } else {
      console.log("Connected to SQLite database")
    }
  }
)

// ==========================
// CREATE TABLES
// ==========================

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      doctor_name TEXT NOT NULL,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'Scheduled'
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT,
      age TEXT,
      gender TEXT,
      diagnosis TEXT,
      prescription TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      doctor_name TEXT NOT NULL,
      medicines TEXT NOT NULL,
      dosage TEXT NOT NULL,
      instructions TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS billing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT,
      amount TEXT,
      payment_method TEXT,
      billing_date TEXT
    )
  `)
})

// ==========================
// CREATE DEFAULT USERS
// ==========================

const createDefaultUsers = async () => {
  const users = [
    {
      name: "Admin",
      email: "admin@healthsync.com",
      password: "admin123",
      role: "admin",
    },
    {
      name: "Doctor",
      email: "doctor@healthsync.com",
      password: "doctor123",
      role: "doctor",
    },
    {
      name: "Patient",
      email: "patient@healthsync.com",
      password: "patient123",
      role: "patient",
    },
  ]

  for (const user of users) {
    db.get(
      `SELECT * FROM users WHERE email = ?`,
      [user.email],
      async (err, row) => {
        if (!row) {
          const hashedPassword = await bcrypt.hash(
            user.password,
            10
          )

          db.run(
            `
            INSERT INTO users (
              name,
              email,
              password,
              role
            )
            VALUES (?, ?, ?, ?)
          `,
            [
              user.name,
              user.email,
              hashedPassword,
              user.role,
            ]
          )
        }
      }
    )
  }
}

createDefaultUsers()

// ==========================
// HEALTH CHECK
// ==========================

app.get("/", (req, res) => {
  res.send("HealthSync Backend Running")
})

// ==========================
// LOGIN API
// ==========================

app.post("/api/login", (req, res) => {
  const {email, password} = req.body

  db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    async (error, user) => {
      if (error) {
        return res.status(500).json({
          message: "Server error",
        })
      }

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
        })
      }

      const isMatch = await bcrypt.compare(
        password,
        user.password
      )

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        })
      }

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    }
  )
})

// ==========================
// APPOINTMENTS
// ==========================

app.get("/api/appointments", (req, res) => {
  db.all(
    `SELECT * FROM appointments ORDER BY id DESC`,
    [],
    (error, rows) => {
      if (error) {
        return res.status(500).json({
          error: error.message,
        })
      }

      res.json(rows)
    }
  )
})

app.post("/api/appointments", (req, res) => {
  const {
    patient_name,
    doctor_name,
    appointment_date,
    appointment_time,
    reason,
  } = req.body

  db.run(
    `
    INSERT INTO appointments (
      patient_name,
      doctor_name,
      appointment_date,
      appointment_time,
      reason,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [
      patient_name,
      doctor_name,
      appointment_date,
      appointment_time,
      reason,
      "Scheduled",
    ],
    function (error) {
      if (error) {
        return res.status(500).json({
          error: error.message,
        })
      }

      res.json({
        message: "Appointment created",
        appointmentId: this.lastID,
      })
    }
  )
})

// ==========================
// PATIENTS
// ==========================

app.get("/api/patients", (req, res) => {
  db.all(
    `SELECT * FROM patients ORDER BY id DESC`,
    [],
    (error, rows) => {
      if (error) {
        return res.status(500).json({
          error: error.message,
        })
      }

      res.json(rows)
    }
  )
})

// ==========================
// PRESCRIPTIONS
// ==========================

app.get("/api/prescriptions", (req, res) => {
  db.all(
    `SELECT * FROM prescriptions ORDER BY id DESC`,
    [],
    (error, rows) => {
      if (error) {
        return res.status(500).json({
          error: error.message,
        })
      }

      res.json(rows)
    }
  )
})

// ==========================
// BILLING
// ==========================

app.get("/api/billing", (req, res) => {
  db.all(
    `SELECT * FROM billing ORDER BY id DESC`,
    [],
    (error, rows) => {
      if (error) {
        return res.status(500).json({
          error: error.message,
        })
      }

      res.json(rows)
    }
  )
})

// ==========================
// DASHBOARD SUMMARY
// ==========================

app.get(
  "/api/dashboard/summary",
  (req, res) => {
    const analytics = {}

    db.get(
      `SELECT COUNT(*) AS totalAppointments FROM appointments`,
      [],
      (error, appointmentData) => {
        analytics.totalAppointments =
          appointmentData?.totalAppointments || 0

        db.get(
          `SELECT COUNT(*) AS totalPatients FROM patients`,
          [],
          (error, patientData) => {
            analytics.totalPatients =
              patientData?.totalPatients || 0

            db.get(
              `SELECT COUNT(*) AS totalPrescriptions FROM prescriptions`,
              [],
              (
                error,
                prescriptionData
              ) => {
                analytics.totalPrescriptions =
                  prescriptionData?.totalPrescriptions ||
                  0

                db.get(
                  `SELECT SUM(amount) AS totalRevenue FROM billing`,
                  [],
                  (
                    error,
                    billingData
                  ) => {
                    analytics.totalRevenue =
                      billingData?.totalRevenue ||
                      0

                    res.json(analytics)
                  }
                )
              }
            )
          }
        )
      }
    )
  }
)

// ==========================
// SERVER
// ==========================

const PORT =
  process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  )
})