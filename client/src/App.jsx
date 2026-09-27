import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Accommodations from './pages/Accommodations';
import Transportation from './pages/Transportation';
import TravelGuides from './pages/TravelGuides';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import ServerError from './pages/ServerError';

// Customer Flow (Phase 3)
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomizeBooking from './pages/customer/CustomizeBooking';
import BookingConfirmation from './pages/customer/BookingConfirmation';
import QueryDetail from './pages/customer/QueryDetail';

// Staff & Admin Workspaces (Phase 4)
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffPackages from './pages/staff/StaffPackages';
import StaffBookings from './pages/staff/StaffBookings';
import StaffQueries from './pages/staff/StaffQueries';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStaffManagement from './pages/admin/AdminStaffManagement';
import AdminBookings from './pages/admin/AdminBookings';
import AdminReports from './pages/admin/AdminReports';
import AdminAuditLog from './pages/admin/AdminAuditLog';

import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Home />} />
        <Route path="/app.html" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:slug" element={<PackageDetail />} />
        <Route path="/accommodations" element={<Accommodations />} />
        <Route path="/transportation" element={<Transportation />} />
        <Route path="/travel-guides" element={<TravelGuides />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Forbidden />} />
        <Route path="/server-error" element={<ServerError />} />

        {/* Customer Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:slug"
          element={
            <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
              <CustomizeBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/confirmation/:id"
          element={
            <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/queries/:id"
          element={
            <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
              <QueryDetail />
            </ProtectedRoute>
          }
        />

        {/* Staff Protected Routes */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/packages"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <StaffPackages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/bookings"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <StaffBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/queries"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <StaffQueries />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminStaffManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-log"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAuditLog />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
