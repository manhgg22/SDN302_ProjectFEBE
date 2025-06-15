import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy userId từ localStorage
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.warn("⚠️ Không tìm thấy userId trong localStorage");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/user/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("❌ Không lấy được thông tin người dùng", err.message);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <div className="p-4">Đang tải thông tin...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">👤 Thông tin tài khoản</h2>
      <div className="space-y-2">
        <p><strong>Tài khoản:</strong> {user.username}</p>
        <p><strong>Vai trò:</strong> {user.role}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Số điện thoại:</strong> {user.phone}</p>
        <p><strong>Địa chỉ:</strong> {user.address}</p>
      </div>
    </div>
  );
};

export default UserProfile;
