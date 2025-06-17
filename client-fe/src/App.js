import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./user/UserDashboard";
import RequireAuth from "./components/RequireAuth";
import LandingPage from "./pages/LandingPage";
import CreateQuestion from "./admin/CreateQuestion";
import TakeExam from "./user/TakeExam";
import EnterExamCode from "./user/EnterExamCode";
import UserResults from "./user/UserResults";
import UserProfile from "./user/UserProfile";
import PracticeQuiz from "./user/PracticeQuiz";
import AdminResults from "./admin/adminResult";
import AdminUsers from "./admin/AdminUsers"; // Import AdminUsers component
import AdminTests from "./admin/AdminTests";
import MainLayout from "./layout/mainlayout/MainLayout";
import "antd/dist/reset.css"; 



function App() {
  return (
    <Routes>
      {/* ❌ Không nằm trong layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<LandingPage />} />
      {/* <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route> */}
      <Route element={<RequireAuth allowedRoles={["user"]} />}>
        <Route path="/user" element={<UserDashboard />} />
      </Route>

      {/* ✅ Chỉ layout chính mới có Header/Footer */}
      <Route element={<MainLayout />}>
        <Route path="/admin/tests" element={<AdminTests />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/questions" element={<CreateQuestion />} />
        <Route path="/admin/results" element={<AdminResults />} />
         <Route path="/admin" element={<AdminDashboard />} />


        <Route path="/user/quiz" element={<EnterExamCode />} />
        <Route path="/user/quiz/:examId" element={<TakeExam />} />
        <Route path="/user/results" element={<UserResults />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/questions" element={<PracticeQuiz />} />




      </Route>
    </Routes>
  );
}
export default App;
