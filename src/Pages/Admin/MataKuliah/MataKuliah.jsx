import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";

import TableMataKuliah from "./TableMataKuliah";
import ModalMataKuliah from "./ModalMataKuliah";

import {
  getAllMataKuliah,
  storeMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "@/Utils/Apis/MataKuliahApi";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import Swal from "sweetalert2";

const MataKuliah = () => {
  const [mataKuliah, setMataKuliah] = useState([]);
  const [selectedMK, setSelectedMK] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchMataKuliah = async () => {
    try {
      const res = await getAllMataKuliah();
      console.log("MataKuliah response:", res);
      setMataKuliah(res.data);
    } catch (err) {
      console.error("MataKuliah fetch error:", err);
      toastError(err?.message || "Gagal mengambil data mata kuliah");
    }
  };

  useEffect(() => {
    fetchMataKuliah();
  }, []);

  const openAddModal = () => {
    setSelectedMK(null);
    setModalOpen(true);
  };

  const openEditModal = (m) => {
    setSelectedMK(m);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      const kodeExists = mataKuliah.some((item) => {
        if (selectedMK && item.id === selectedMK.id) return false;
        return item.kode === formData.kode;
      });

      if (kodeExists) {
        toastError("Kode mata kuliah sudah digunakan!");
        return;
      }

      if (selectedMK) {
        confirmUpdate(async () => {
          await updateMataKuliah(selectedMK.id, formData);
          setModalOpen(false);
          setSelectedMK(null);
          fetchMataKuliah();
        });
      } else {
        Swal.fire({
          title: "Menambahkan...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading(),
        });
        try {
          await storeMataKuliah(formData);
          Swal.fire({
            title: "Berhasil",
            text: "Data berhasil ditambahkan",
            icon: "success",
            timer: 6000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setModalOpen(false);
          fetchMataKuliah();
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
      await deleteMataKuliah(id);
      await fetchMataKuliah();
    });
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mata Kuliah
        </Heading>
        <Button onClick={openAddModal}>+ Tambah Mata Kuliah</Button>
      </div>

      <TableMataKuliah
        data={mataKuliah}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onDetail={(id) => navigate(`/admin/matakuliah/${id}`)}
      />

      <ModalMataKuliah
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMK={selectedMK}
      />
    </Card>
  );
};

export default MataKuliah;
