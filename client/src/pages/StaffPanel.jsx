"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import { apiService } from "../services/api";

export default function StaffPanel() {
  const [searchToken, setSearchToken] = useState("");
  const [beneficiary, setBeneficiary] = useState(null);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (!searchToken.trim()) {
      setMessage("Please enter a token to search.");
      setBeneficiary(null);
      return;
    }

    setLoading(true);
    setMessage("");
    setBeneficiary(null);

    try {
      // Call backend API to search by tokenID
      const res = await apiService.getBeneficiaryByToken(searchToken.trim());

      // Backend returns { success, data: { beneficiaries: [...] } } or similar
      // Assuming it returns array of matches
      const found = Array.isArray(res.data?.beneficiaries)
        ? res.data.beneficiaries[0]
        : null;

      if (found) {
        setBeneficiary(found);
        setStatus(found.status || "");
        setRemarks(found.remarks || "");
        setMessage("");
      } else {
        setMessage("Token not found");
      }
    } catch (error) {
      setMessage("Error fetching beneficiary");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!beneficiary) return;

    setLoading(true);
    setMessage("");

    try {
      // Update status and remarks via backend
      const res = await apiService.updateBeneficiary(beneficiary._id, {
        status,
        remarks,
      });

      if (res.success) {
        setBeneficiary(res.data);
        setMessage("Status updated successfully!");
      } else {
        setMessage("Failed to update status.");
      }
    } catch (error) {
      setMessage("Error updating status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout title="Staff Panel">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Search Token</h3>

          {message && (
            <div
              className={`px-4 py-3 rounded mb-4 ${
                message.toLowerCase().includes("error") ||
                message.toLowerCase().includes("not found")
                  ? "bg-red-100 border border-red-400 text-red-700"
                  : "bg-green-100 border border-green-400 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              placeholder="Enter token number (e.g., 20250809001)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {beneficiary && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-lg">{beneficiary.name}</h4>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    beneficiary.status
                  )}`}
                >
                  {beneficiary.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Token:</strong> {beneficiary.tokenID || beneficiary.token}
                </p>
                <p>
                  <strong>CNIC:</strong> {beneficiary.cnic}
                </p>
                <p>
                  <strong>Phone:</strong> {beneficiary.phone}
                </p>
                <p>
                  <strong>Address:</strong> {beneficiary.address}
                </p>
                <p>
                  <strong>Purpose:</strong> {beneficiary.purpose}
                </p>
                {beneficiary.remarks && (
                  <p>
                    <strong>Remarks:</strong> {beneficiary.remarks}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Update Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Update Status</h3>

          {beneficiary ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  placeholder="Add remarks or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Search for a token to update status
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
