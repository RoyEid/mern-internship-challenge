import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mobileNumber: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const getItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error("Failed to get items:", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      name: item.name,
      description: item.description,
      mobileNumber: item.mobileNumber || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        const response = await axios.put(
          `${API_URL}/api/items/${editingId}`,
          formData,
        );

        setItems(
          items.map((item) => (item._id === editingId ? response.data : item)),
        );

        setEditingId(null);
      } else {
        const response = await axios.post(
          `${API_URL}/api/items`,
          formData,
        );
        setItems([...items, response.data]);
      }
      setFormData({
        name: "",
        description: "",
        mobileNumber: "",
      });
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  return (
    <div>
      <h1>MERN Internship Challenge</h1>

      <h2>Add Item</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number (optional)"
          value={formData.mobileNumber}
          onChange={handleChange}
        />

        <button type="submit">{editingId ? "Update Item" : "Add Item"}</button>
      </form>

      <h2>Items</h2>

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              <p>{item.mobileNumber || "No mobile number"}</p>
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
