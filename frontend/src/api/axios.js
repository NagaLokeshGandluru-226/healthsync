import axios from "axios"

const api = axios.create({
  baseURL: "https://healthsync-771s.onrender.com/api",
})

export default api