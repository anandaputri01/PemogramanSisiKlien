import { useEffect, useState } from "react";
import Form from "@/Pages/Layouts/Components/Form";
import Input from "@/Pages/Layouts/Components/Input";
import Label from "@/Pages/Layouts/Components/Label";
import Button from "@/Pages/Layouts/Components/Button";

const ModalMataKuliah = ({ isModalOpen, onClose, onSubmit, selectedMK }) => {
  const [form, setForm] = useState({ kode: "", nama: "" });

  useEffect(() => {
    if (selectedMK) {
      setForm({ kode: selectedMK.kode, nama: selectedMK.nama });
    } else {
      setForm({ kode: "", nama: "" });
    }
  }, [selectedMK, isModalOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.kode.trim()) {
      alert("Kode wajib diisi!");
      return;
    }
    if (!form.nama.trim()) {
      alert("Nama wajib diisi!");
      return;
    }

    onSubmit(form);
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{selectedMK ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">&times;</button>
        </div>

        <Form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="kode">Kode</Label>
            <Input type="text" name="kode" value={form.kode} onChange={handleChange} readOnly={selectedMK !== null} placeholder="Masukkan Kode" required />
          </div>
          <div>
            <Label htmlFor="nama">Nama</Label>
            <Input type="text" name="nama" value={form.nama} onChange={handleChange} placeholder="Masukkan Nama" required />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ModalMataKuliah;
