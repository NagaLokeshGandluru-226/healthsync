const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const cors = require("cors")
const bcrypt = require("bcryptjs")

const app = express()

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
      console.log(
        "Connected to SQLite database"
      )
    }
  }
)

// ==========================
// USERS TABLE
// ==========================

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )
`)

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
      `
      SELECT *
      FROM users
      WHERE email = ?
    `,
      [user.email],
      async (err, row) => {
        if (!row) {
          const hashedPassword =
            await bcrypt.hash(
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
// LOGIN API
// ==========================

app.post("/api/login", (req, res) => {
  const {email, password} = req.body

  db.get(
    `
    SELECT *
    FROM users
    WHERE email = ?
  `,
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

      const isMatch =
        await bcrypt.compare(
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
// APPOINTMENTS TABLE
// ==========================

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

// ==========================
// GET APPOINTMENTS
// ==========================

app.get("/api/appointments", (req, res) => {
  const {
    patient_name,
    doctor_name,
    status,
    appointment_date,
  } = req.query

  let query = `
    SELECT *
    FROM appointments
    WHERE 1 = 1
  `

  const params = []

  if (patient_name) {
    query += `
      AND patient_name LIKE ?
    `
    params.push(`%${patient_name}%`)
  }

  if (doctor_name) {
    query += `
      AND doctor_name LIKE ?
    `
    params.push(`%${doctor_name}%`)
  }

  if (status) {
    query += `
      AND status = ?
    `
    params.push(status)
  }

  if (appointment_date) {
    query += `
      AND appointment_date = ?
    `
    params.push(appointment_date)
  }

  query += `
    ORDER BY id DESC
  `

  db.all(query, params, (error, rows) => {
    if (error) {
      return res.status(500).json({
        error: error.message,
      })
    }

    res.json(rows)
  })
})

// ==========================
// CREATE APPOINTMENT
// ==========================

app.post("/api/appointments", (req, res) => {
  const {
    patient_name,
    doctor_name,
    appointment_date,
    appointment_time,
    reason,
  } = req.body

  if (
    !patient_name ||
    !doctor_name ||
    !appointment_date ||
    !appointment_time ||
    !reason
  ) {
    return res.status(400).json({
      error: "All fields are required",
    })
  }

  db.get(
    `
    SELECT *
    FROM appointments
    WHERE doctor_name = ?
    AND appointment_date = ?
    AND appointment_time = ?
  `,
    [
      doctor_name,
      appointment_date,
      appointment_time,
    ],
    (error, existingAppointment) => {
      if (existingAppointment) {
        return res.status(400).json({
          error:
            "Doctor already has appointment at this time",
        })
      }

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
            message:
              "Appointment created successfully",
            appointmentId: this.lastID,
          })
        }
      )
    }
  )
})

// ==========================
// UPDATE APPOINTMENT STATUS
// ==========================

app.put(
  "/api/appointments/:id/status",
  (req, res) => {
    const {id} = req.params
    const {status} = req.body

    db.run(
      `
      UPDATE appointments
      SET status = ?
      WHERE id = ?
    `,
      [status, id],
      function (error) {
        if (error) {
          return res.status(500).json({
            error: error.message,
          })
        }

        res.json({
          message:
            "Appointment status updated",
        })
      }
    )
  }
)

// ==========================
// UPDATE APPOINTMENT
// ==========================

app.put(
  "/api/appointments/:id",
  (req, res) => {
    const {id} = req.params

    const {
      patient_name,
      doctor_name,
      appointment_date,
      appointment_time,
      reason,
      status,
    } = req.body

    db.run(
      `
      UPDATE appointments
      SET
        patient_name = ?,
        doctor_name = ?,
        appointment_date = ?,
        appointment_time = ?,
        reason = ?,
        status = ?
      WHERE id = ?
    `,
      [
        patient_name,
        doctor_name,
        appointment_date,
        appointment_time,
        reason,
        status,
        id,
      ],
      function (error) {
        if (error) {
          return res.status(500).json({
            error: error.message,
          })
        }

        res.json({
          message:
            "Appointment updated successfully",
        })
      }
    )
  }
)

// ==========================
// DELETE APPOINTMENT
// ==========================

app.delete(
  "/api/appointments/:id",
  (req, res) => {
    const {id} = req.params

    db.run(
      `
      DELETE FROM appointments
      WHERE id = ?
    `,
      [id],
      function (error) {
        if (error) {
          return res.status(500).json({
            error: error.message,
          })
        }

        res.json({
          message:
            "Appointment deleted successfully",
        })
      }
    )
  }
)

// ==========================
// PATIENTS TABLE
// ==========================

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

// ==========================
// GET PATIENTS
// ==========================

app.get("/api/patients", (req, res) => {
  db.all(
    `
    SELECT *
    FROM patients
    ORDER BY id DESC
  `,
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
// CREATE PATIENT
// ==========================

app.post("/api/patients", (req, res) => {
  const {
    patient_name,
    age,
    gender,
    diagnosis,
    prescription,
  } = req.body

  db.run(
    `
    INSERT INTO patients (
      patient_name,
      age,
      gender,
      diagnosis,
      prescription
    )
    VALUES (?, ?, ?, ?, ?)
  `,
    [
      patient_name,
      age,
      gender,
      diagnosis,
      prescription,
    ],
    function (error) {
      if (error) {
        return res.status(500).json({
          error: error.message,
        })
      }

      res.json({
        message:
          "Patient added successfully",
        patientId: this.lastID,
      })
    }
  )
})

// ==========================
// UPDATE PATIENT
// ==========================

app.put("/api/patients/:id", (req, res) => {
  const {id} = req.params

  const {
    patient_name,
    age,
    gender,
    diagnosis,
    prescription,
  } = req.body

  db.run(
    `
    UPDATE patients
    SET
      patient_name = ?,
      age = ?,
      gender = ?,
      diagnosis = ?,
      prescription = ?
    WHERE id = ?
  `,
    [
      patient_name,
      age,
      gender,
      diagnosis,
      prescription,
      id,
    ],
    function (error) {
      if (error) {
        return res.status(500).json({
          error: error.message,
        })
      }

      res.json({
        message:
          "Patient updated successfully",
      })
    }
  )
})

// ==========================
// DELETE PATIENT
// ==========================

app.delete("/api/patients/:id", (req, res) => {
  const {id} = req.params

  db.run(
    `
    DELETE FROM patients
    WHERE id = ?
  `,
    [id],
    function (error) {
      if (error) {
        return res.status(500).json({
          error: error.message,
        })
      }

      res.json({
        message:
          "Patient deleted successfully",
      })
    }
  )
})

// ==========================
// PRESCRIPTIONS TABLE
// ==========================

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

// ==========================
// GET PRESCRIPTIONS
// ==========================

app.get("/api/prescriptions", (req, res) => {
  db.all(
    `
    SELECT *
    FROM prescriptions
    ORDER BY id DESC
  `,
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
// CREATE PRESCRIPTION
// ==========================

app.post(
  "/api/prescriptions",
  (req, res) => {
    const {
      patient_name,
      doctor_name,
      medicines,
      dosage,
      instructions,
    } = req.body

    if (
      !patient_name ||
      !doctor_name ||
      !medicines ||
      !dosage ||
      !instructions
    ) {
      return res.status(400).json({
        error: "All fields are required",
      })
    }

    db.run(
      `
      INSERT INTO prescriptions (
        patient_name,
        doctor_name,
        medicines,
        dosage,
        instructions
      )
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        patient_name,
        doctor_name,
        medicines,
        dosage,
        instructions,
      ],
      function (error) {
        if (error) {
          return res.status(500).json({
            error: error.message,
          })
        }

        res.json({
          message:
            "Prescription created successfully",
          prescriptionId: this.lastID,
        })
      }
    )
  }
)

// ==========================
// UPDATE PRESCRIPTION
// ==========================

app.put(
  "/api/prescriptions/:id",
  (req, res) => {
    const {id} = req.params

    const {
      patient_name,
      doctor_name,
      medicines,
      dosage,
      instructions,
    } = req.body

    db.run(
      `
      UPDATE prescriptions
      SET
        patient_name = ?,
        doctor_name = ?,
        medicines = ?,
        dosage = ?,
        instructions = ?
      WHERE id = ?
    `,
      [
        patient_name,
        doctor_name,
        medicines,
        dosage,
        instructions,
        id,
      ],
      function (error) {
        if (error) {
          return res.status(500).json({
            error: error.message,
          })
        }

        res.json({
          message:
            "Prescription updated successfully",
        })
      }
    )
  }
)

// ==========================
// DELETE PRESCRIPTION
// ==========================

app.delete(
  "/api/prescriptions/:id",
  (req, res) => {
    const {id} = req.params

    db.run(
      `
      DELETE FROM prescriptions
      WHERE id = ?
    `,
      [id],
      function (error) {
        if (error) {
          return res.status(500).json({
            error: error.message,
          })
        }

        res.json({
          message:
            "Prescription deleted successfully",
        })
      }
    )
  }
)

// ==========================
// BILLING TABLE
// ==========================

db.run(`
  CREATE TABLE IF NOT EXISTS billing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT,
    amount TEXT,
    payment_method TEXT,
    billing_date TEXT
  )
`)

// ==========================
// GET BILLING
// ==========================

app.get("/api/billing", (req, res) => {
  db.all(
    `
    SELECT *
    FROM billing
    ORDER BY id DESC
  `,
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
// CREATE BILL
// ==========================

app.post("/api/billing", (req, res) => {
  const {
    patient_name,
    amount,
    payment_method,
    billing_date,
  } = req.body

  db.run(
    `
    INSERT INTO billing (
      patient_name,
      amount,
      payment_method,
      billing_date
    )
    VALUES (?, ?, ?, ?)
  `,
    [
      patient_name,
      amount,
      payment_method,
      billing_date,
    ],
    function (error) {
      if (error) {
        return res.status(500).json({
          error: error.message,
        })
      }

      res.json({
        message: "Bill added successfully",
        billId: this.lastID,
      })
    }
  )
})

// ==========================
// DASHBOARD SUMMARY API
// ==========================

app.get(
  "/api/dashboard/summary",
  (req, res) => {
    const analytics = {}

    db.get(
      `
      SELECT COUNT(*) AS totalAppointments
      FROM appointments
    `,
      [],
      (error, appointmentData) => {
        analytics.totalAppointments =
          appointmentData?.totalAppointments ||
          0

        db.get(
          `
          SELECT COUNT(*) AS totalPatients
          FROM patients
        `,
          [],
          (error, patientData) => {
            analytics.totalPatients =
              patientData?.totalPatients || 0

            db.get(
              `
              SELECT COUNT(*) AS totalPrescriptions
              FROM prescriptions
            `,
              [],
              (
                error,
                prescriptionData
              ) => {
                analytics.totalPrescriptions =
                  prescriptionData?.totalPrescriptions ||
                  0

                db.get(
                  `
                  SELECT SUM(amount) AS totalRevenue
                  FROM billing
                `,
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

const PORT = 5000

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  )
})