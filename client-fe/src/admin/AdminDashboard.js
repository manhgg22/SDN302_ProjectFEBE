import React from "react";
import MainLayout from "../layout/mainlayout/MainLayout";
import { Typography } from "antd";

const { Title } = Typography;

function AdminDashboard() {
  return (
    <MainLayout>
      <Title level={3}>🎓 Chào mừng Admin</Title>
      <p>Đây là trang quản trị.</p>
    </MainLayout>
  );
}

export default AdminDashboard;
