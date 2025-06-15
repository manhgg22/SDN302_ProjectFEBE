import React from "react";
import { Layout } from "antd";
import AppHeader from "../header/Header";
import AppFooter from "../footer/Footer";

const { Content } = Layout;

function MainLayout({ children }) {
  const role = localStorage.getItem("role");
  


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />

      

      <Content style={{ padding: "2rem" }}>{children}</Content>

      <AppFooter />
    </Layout>
  );
}

export default MainLayout;
