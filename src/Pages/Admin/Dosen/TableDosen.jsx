import Button from "@/Pages/Layouts/Components/Button";

const TableDosen = ({ data = [], onEdit, onDelete, onDetail }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">NIDN</th>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                Tidak ada data dosen
              </td>
            </tr>
          ) : (
            data.map((d, index) => (
              <tr key={d.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="py-2 px-4">{d.nidn}</td>
                <td className="py-2 px-4">{d.nama}</td>

                <td className="py-2 px-4 text-center space-x-2">
                  <Button onClick={() => onDetail(d.id)}>Detail</Button>

                  <Button size="sm" variant="warning" onClick={() => onEdit(d)}>
                    Edit
                  </Button>

                  <Button size="sm" variant="danger" onClick={() => onDelete(d.id)}>
                    Hapus
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableDosen;
