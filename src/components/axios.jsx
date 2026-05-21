import { useState, useEffect } from "react";
import axios from "axios";

export default function CrudAxios() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const API = "https://jsonplaceholder.typicode.com/users";


  //get all users

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  // ADD USER

  const addUser = async () => {
    if (!name) return;

    try {
      const res = await axios.post(API, {
        name: name,
      });

      setUsers([...users, { id: Date.now(), name: res.data.name }]);
      setName("");
    } catch (err) {
      console.log("Error adding user:", err);
    }
  };

  // ======================
  // DELETE USER
  // ======================
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);

      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.log("Error deleting user:", err);
    }
  };


  // START EDIT

  const startEdit = (user) => {
    setEditId(user.id);
    setName(user.name);
  };


  // UPDATE USER

  const updateUser = async () => {
    try {
      await axios.put(`${API}/${editId}`, {
        name: name,
      });

      setUsers(
        users.map((user) =>
          user.id === editId ? { ...user, name } : user
        )
      );

      setEditId(null);
      setName("");
    } catch (err) {
      console.log("Error updating user:", err);
    }
  };

  return (
    <div>
      <h3>CRUD App (Axios Version)</h3>

      {/* INPUT */}
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* BUTTON */}
      {editId ? (
        <button onClick={updateUser}>Update</button>
      ) : (
        <button onClick={addUser}>Add</button>
      )}

      {/* LIST */}
      <ul style={{ padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span>{user.name}</span>

            <div>
              <button onClick={() => startEdit(user)}>
                Edit
              </button>

              <button onClick={() => deleteUser(user.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}