import { Header } from "@/components/layout/header/Header";
import SuperAdminDashboard from "@/modules/dashboard/components/SuperAdminDashboard";

const Dashboard = () => {
  return (
    <div>
      <Header />
      Dashboard
      <SuperAdminDashboard />
    </div>
  );
};

export default Dashboard;
