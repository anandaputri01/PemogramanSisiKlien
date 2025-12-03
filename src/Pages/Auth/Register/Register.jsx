import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/Pages/Layouts/Components/Input";
import Label from "@/Pages/Layouts/Components/Label";
import Button from "@/Pages/Layouts/Components/Button";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Form from "@/Pages/Layouts/Components/Form";
import { register } from "@/Utils/Apis/AuthApi";
import { toastError, toastSuccess } from "@/Utils/Helpers/ToastHelpers";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (!name.trim() || !email.trim() || !password.trim()) {
      toastError("Semua field wajib diisi");
      return;
    }
    if (password !== confirmPassword) {
      toastError("Password dan konfirmasi harus sama");
      return;
    }

    try {
      await register({ name, email, password });
      toastSuccess("Registrasi berhasil, silakan login");
      navigate("/");
    } catch (err) {
      toastError(err.message || "Gagal registrasi");
    }
  };

  return (
    <Card className="max-w-md">
      <Heading as="h2">Register</Heading>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nama</Label>
          <Input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Masukkan nama" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Masukkan email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Masukkan password" required />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Konfirmasi password" required />
        </div>
        <Button type="submit" className="w-full">Daftar</Button>
      </Form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Sudah punya akun? <button onClick={() => navigate("/")} className="text-blue-500 hover:underline">Login</button>
      </p>
    </Card>
  );
};

export default Register;
