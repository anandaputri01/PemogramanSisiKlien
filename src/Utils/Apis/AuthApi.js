import axios from "@/Utils/AxiosInstance";

export const login = async ( email, password ) => {
    const res = await axios.get("/user", { params: { email } });
    const user = res.data[0];

    if (!user) throw new Error("Email tidak ditemukan");
    if (user.password !== password) throw new Error("Password salah");

    return user;
};

// Registrasi user baru
export const register = async ({ name, email, password }) => {
  // Cek apakah email sudah terdaftar
  const res = await axios.get("/user", { params: { email } });
  if (res.data && res.data.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  const payload = { name, email, password };
  const createRes = await axios.post("/user", payload);
  return createRes.data;
};
