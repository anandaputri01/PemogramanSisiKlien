import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";

import TableDosen from "./TableDosen";
import ModalDosen from "./ModalDosen";

import {
  getAllDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "@/Utils/Apis/DosenApi";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import Swal from "sweetalert2";

const Dosen = () => {
  const [dosen, setDosen] = useState([]);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchDosen = async () => {
    try {
      const res = await getAllDosen();
      console.log("Dosen response:", res);
      setDosen(res.data);
    } catch (err) {
      console.error("Dosen fetch error:", err);
      toastError(err?.message || "Gagal mengambil data dosen");
    }
  };

  useEffect(() => {
    fetchDosen();
  }, []);

  const openAddModal = () => {
    setSelectedDosen(null);
    setModalOpen(true);
  };

  const openEditModal = (d) => {
    setSelectedDosen(d);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      const nidnExists = dosen.some((item) => {
        if (selectedDosen && item.id === selectedDosen.id) return false;
        return item.nidn === formData.nidn;
      });

      if (nidnExists) {
        toastError("NIDN sudah digunakan!");
        return;
      }

      if (selectedDosen) {
        confirmUpdate(async () => {
          await updateDosen(selectedDosen.id, formData);
          setModalOpen(false);
          setSelectedDosen(null);
          fetchDosen();
        });
      } else {
        Swal.fire({
          title: "Menambahkan...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading(),
        });
        try {
          await storeDosen(formData);
          Swal.fire({
            title: "Berhasil",
            text: "Data berhasil ditambahkan",
            icon: "success",
            timer: 6000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setModalOpen(false);
          fetchDosen();
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
      await deleteDosen(id);
      await fetchDosen();
    });
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Dosen
        </Heading>
        <Button onClick={openAddModal}>+ Tambah Dosen</Button>
      </div>

      <TableDosen
        data={dosen}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onDetail={(id) => navigate(`/admin/dosen/${id}`)}
      />

      <ModalDosen
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedDosen={selectedDosen}
      />
    </Card>
  );
};

export default Dosen;
