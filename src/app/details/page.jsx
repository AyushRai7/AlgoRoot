"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import { FaSortUp, FaSortDown } from "react-icons/fa";

export default function Details() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setUser(userEmail);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => setData(data?.users || []))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    item.firstName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });

      if (response.ok) {
        localStorage.removeItem("userEmail");
        toast.success("Logged out successfully!", { autoClose: 2000 });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }

    try {
      const response = await fetch("/api/delete_user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user }),
      });

      if (response.ok) {
        localStorage.removeItem("userEmail");
        toast.success("Account deleted successfully!", { autoClose: 2000 });
        setTimeout(() => router.push("/signup"), 2000);
      } else {
        toast.error("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 w-full">
      <div className="w-full max-w-6xl flex justify-between p-4">
        <h1 className="text-xl font-bold text-left">Dashboard</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="p-2 bg-gray-700 rounded-full"
          >
            <FaUser size={20} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2">
              <p className="text-sm text-left px-4 mb-2">{user}</p>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
              >
                Logout
              </button>
              <button
                onClick={handleDeleteAccount}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700"
              >
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
      <main className="w-full max-w-6xl mt-6 bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white focus:outline-none"
        />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    <span>ID</span>
                    <div className="flex flex-col ml-1">
                      <span>
                        {sortConfig.key === "id" &&
                        sortConfig.direction === "asc"
                          ? "🔼"
                          : "🔽"}
                      </span>
                    </div>
                  </div>
                </th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Gender</th>
                <th
                  className="p-2 cursor-pointer"
                  onClick={() => handleSort("age")}
                >
                  <div className="flex items-center">
                    <span>Age</span>
                    <div className="flex flex-col ml-1">
                      <span>
                        {sortConfig.key === "age" &&
                        sortConfig.direction === "asc"
                          ? "🔼"
                          : "🔽"}
                      </span>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id} className="border-t border-gray-700">
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">
                    {item.firstName} {item.lastName}
                  </td>
                  <td className="p-2 break-words">{item.email}</td>
                  <td className="p-2">{item.gender}</td>
                  <td className="p-2">{item.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
