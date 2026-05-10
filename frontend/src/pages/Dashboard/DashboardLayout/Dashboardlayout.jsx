import { Outlet } from 'react-router-dom';
import Navbar from '../navBar/Navbar';
import Sidebar from '../navBar/Sidebar';
import './Dashboardlayout.css';

function DashboardLayout() {
  return (
    <div className="layout-root">
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-main">
          <div className="layout-glow" />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;