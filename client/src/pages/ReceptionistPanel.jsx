// src/pages/ReceptionistPanel.jsx
import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function ReceptionistPanel() {
  const { logout } = useAuth();

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [formData, setFormData] = useState({
    cnic: "",
    name: "",
    phone: "",
    address: "",
    purpose: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load all beneficiaries created by this receptionist
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const res = await apiService.getBeneficiaries();
        // Backend returns { success, data: { beneficiaries, total, page } }
        setBeneficiaries(
          Array.isArray(res.data?.beneficiaries) ? res.data.beneficiaries : []
        );
      } catch (err) {
        console.error("Error fetching beneficiaries:", err);
        setBeneficiaries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiaries();
  }, []);

  // Add new beneficiary
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiService.createBeneficiary(formData);
      const res = await apiService.getBeneficiaries();
      setBeneficiaries(
        Array.isArray(res.data?.beneficiaries) ? res.data.beneficiaries : []
      );
      setFormData({
        cnic: "",
        name: "",
        phone: "",
        address: "",
        purpose: "",
      });
    } catch (err) {
      console.error(
        "Error creating beneficiary:",
        err.response?.data || err.message
      );
      alert(
        err.response?.data?.message ||
          "Failed to create beneficiary. Please check the form."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Receptionist Panel</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Add Beneficiary Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="CNIC"
            value={formData.cnic}
            onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Purpose"
            value={formData.purpose}
            onChange={(e) =>
              setFormData({ ...formData, purpose: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Add Beneficiary"}
          </button>
        </form>

        {/* Beneficiary List */}
        {loading ? (
          <p>Loading beneficiaries...</p>
        ) : beneficiaries.length === 0 ? (
          <p className="text-gray-500">No beneficiaries found.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Token ID</th>
                <th className="border p-2">CNIC</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Purpose</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((b) => (
                <tr key={b._id}>
                  <td className="border p-2">{b.tokenID}</td>
                  <td className="border p-2">{b.cnic}</td>
                  <td className="border p-2">{b.name}</td>
                  <td className="border p-2">{b.purpose}</td>
                  <td className="border p-2">{b.status}</td>
                  <td className="border p-2">
                    {b.createdAt ? new Date(b.createdAt).toLocaleString() : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
