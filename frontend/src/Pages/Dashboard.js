import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../Styles/Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faUserMd,
  faEnvelope,
  faPhone,
  faVideo,
  faPhoneVolume,
  faTrash,
  faEdit,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.warning("Please login to access dashboard", {
        position: toast.POSITION.TOP_CENTER,
      });
      navigate("/login");
    }
  }, [navigate]);

  // Fetch appointments
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/appointments");
      const data = await response.json();

      if (data.success) {
        setAppointments(data.data);
        setFilteredAppointments(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointmentsData) => {
    const total = appointmentsData.length;
    const confirmed = appointmentsData.filter((a) => a.status === "confirmed").length;
    const pending = appointmentsData.filter((a) => a.status === "pending").length;
    const cancelled = appointmentsData.filter((a) => a.status === "cancelled").length;

    setStats({ total, confirmed, pending, cancelled });
  };

  // Filter appointments
  useEffect(() => {
    let filtered = appointments;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.patientNumber.includes(searchTerm) ||
          (apt.patientEmail && apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredAppointments(filtered);
  }, [filterStatus, searchTerm, appointments]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Appointment status updated!");
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment");
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/appointments/${appointmentId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          toast.success("Appointment deleted!");
          fetchAppointments();
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
        toast.error("Failed to delete appointment");
      }
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Appointments Dashboard</h1>
          <p>Manage and view all patient appointments</p>
        </div>

        {/* Statistics Cards */}
        <div className="dashboard-stats">
          <div className="stat-card total">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Appointments</p>
            </div>
          </div>

          <div className="stat-card confirmed">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faUserMd} />
            </div>
            <div className="stat-info">
              <h3>{stats.confirmed}</h3>
              <p>Confirmed</p>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card cancelled">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faTrash} />
            </div>
            <div className="stat-info">
              <h3>{stats.cancelled}</h3>
              <p>Cancelled</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-filters">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Appointments</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Appointments Table */}
        <div className="appointments-table-container">
          {filteredAppointments.length === 0 ? (
            <div className="no-appointments">
              <p>No appointments found</p>
            </div>
          ) : (
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Contact</th>
                  <th>Appointment Time</th>
                  <th>Mode</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="patient-name">{appointment.patientName}</td>
                    <td className="patient-contact">
                      <div>
                        <FontAwesomeIcon icon={faPhone} /> {appointment.patientNumber}
                      </div>
                      {appointment.patientEmail && (
                        <div>
                          <FontAwesomeIcon icon={faEnvelope} /> {appointment.patientEmail}
                        </div>
                      )}
                    </td>
                    <td className="appointment-time">{formatDate(appointment.appointmentTime)}</td>
                    <td className="appointment-mode">
                      <span className={`mode-badge ${appointment.preferredMode}`}>
                        <FontAwesomeIcon
                          icon={appointment.preferredMode === "video" ? faVideo : faPhoneVolume}
                        />
                        {appointment.preferredMode}
                      </span>
                    </td>
                    <td className="patient-gender">{appointment.patientGender}</td>
                    <td className="appointment-status">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                        className={`status-select ${appointment.status}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="appointment-actions">
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(appointment._id)}
                        title="Delete Appointment"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
