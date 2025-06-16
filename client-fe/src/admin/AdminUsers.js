import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  // Gọi API để lấy danh sách user
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:9999/admin/user", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // nếu bạn dùng token
        }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Gửi API để đổi trạng thái user
  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.patch(`http://localhost:9999/admin/user/${id}`, { status: nextStatus }, {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
}); 
      console.log(`Đã cập nhật trạng thái của người dùng ${id} thành ${nextStatus}`);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: nextStatus } : u
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">👥 Quản lý người dùng</h1>

      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2">Username</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Vai trò</th>
            <th className="border px-3 py-2">SĐT</th>
            <th className="border px-3 py-2">Địa chỉ</th>
            <th className="border px-3 py-2">Trạng thái</th>
            <th className="border px-3 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u._id}>
              <td className="border px-3 py-2">{idx + 1}</td>
              <td className="border px-3 py-2">{u.username}</td>
              <td className="border px-3 py-2">{u.email}</td>
              <td className="border px-3 py-2">{u.role}</td>
              <td className="border px-3 py-2">{u.phone}</td>
              <td className="border px-3 py-2">{u.address}</td>
              <td className="border px-3 py-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded text-white ${
                    u.status === "active"
                      ? "bg-green-500"
                      : u.status === "inactive"
                      ? "bg-gray-500"
                      : "bg-red-500"
                  }`}
                >
                  {u.status}
                </span>
              </td>
              <td className="border px-3 py-2">
                {u.role !== "admin" && (
                  <button
                    onClick={() => toggleStatus(u._id, u.status)}
                    className={`text-xs px-3 py-1 rounded font-medium ${
                      u.status === "active"
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {u.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
