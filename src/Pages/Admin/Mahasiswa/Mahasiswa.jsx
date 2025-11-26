import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import Swal from "sweetalert2";

import TableMahasiswa from "./TableMahasiswa";
import ModalMahasiswa from "./ModalMahasiswa";

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  
  const fetchMahasiswa = async () => {
    try {
      const res = await getAllMahasiswa();
      setMahasiswa(res.data);
    } catch (err) {
      toastError("Gagal mengambil data mahasiswa");
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  
  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs); 
    setModalOpen(true);
  };

  
  const handleSubmit = async (formData) => {
  try {

    
    const nimSudahAda = mahasiswa.some((m) => {
      if (selectedMahasiswa && m.id === selectedMahasiswa.id) return false;
      return m.nim === formData.nim;
    });

    if (nimSudahAda) {
      toastError("NIM sudah digunakan!");
      return; // stop submit
    }

  
    if (selectedMahasiswa) {
      confirmUpdate(async () => {
        await updateMahasiswa(selectedMahasiswa.id, formData);
        setModalOpen(false);
        setSelectedMahasiswa(null);
        fetchMahasiswa();
      });

    } else {
      // show loading Swal while adding
      Swal.fire({
        title: "Menambahkan...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });
      try {
        await storeMahasiswa(formData);
        Swal.fire({
          title: "Berhasil",
          text: "Data berhasil ditambahkan",
          icon: "success",
          timer: 6000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        setModalOpen(false);
        fetchMahasiswa();
      } catch (err) {
        Swal.fire({
          title: "Gagal",
          text: "Terjadi kesalahan. Coba lagi.",
          icon: "error",
          showConfirmButton: true,
        });
      }
    }

  } catch (err) {
    toastError("Terjadi kesalahan. Coba lagi.");
  }
};

  
  const handleDelete = async (id) => {
    confirmDelete(async () => {
  await deleteMahasiswa(id);
  await fetchMahasiswa();
    });
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mahasiswa
        </Heading>
        <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
      </div>

      <TableMahasiswa
        data={mahasiswa}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
      />

      <ModalMahasiswa
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
      />
    </Card>
  );
};

export default Mahasiswa;