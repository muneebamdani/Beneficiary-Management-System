import React, { useEffect, useState } from "react";
import { apiService } from "../services/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // ✅ Add password for new user
    role: "",
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const fetchUsers = async () => {
    try {
      const res = await apiService.getUsers();
      setUsers(res);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "" });
  };

  const handleUpdate = async () => {
    try {
      await apiService.updateUser(editingUser, formData);
      await fetchUsers();
      handleCancel();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Create new user handler
  const handleCreateUser = async () => {
    try {
      await apiService.createUser(formData); // must include password
      await fetchUsers();
      handleCancel();
    } catch (err) {
      console.error("User creation failed:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>

      {/* ✅ Add New User Form */}
      <div className="p-4 mb-6 border rounded-md bg-green-50 flex flex-col md:flex-row md:items-center gap-2">
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
        />
        <Input
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <Input
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
          type="password"
        />
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="receptionist">Receptionist</SelectItem>
            <SelectItem value="staff">Department Staff</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleCreateUser}>Add User</Button>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {users.map((user) =>
          editingUser === user._id ? (
            <div
              key={user._id}
              className="p-4 border rounded-md flex flex-col gap-2 md:flex-row md:items-center justify-between bg-yellow-50"
            >
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Name"
              />
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
              />
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="staff">Department Staff</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={handleUpdate}>Update</Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              key={user._id}
              className="p-4 border rounded-md flex flex-col gap-2 md:flex-row md:items-center justify-between"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm">{user.email}</p>
                <p className="text-xs capitalize">{user.role}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEditClick(user)}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
