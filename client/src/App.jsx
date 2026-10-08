import { useEffect, useState } from "react";

import ItemForm from "./components/ItemForm.jsx";
import ItemList from "./components/ItemList.jsx";
import StatusMessage from "./components/StatusMessage.jsx";

import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "./services/itemService.js";

function App() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mobileNumber: "",
  });

  const fetchItems = async () => {
    try {
      const data = await getItems();

      setItems(data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load items";

      setError(message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (item) => {
    setError("");
    setSuccess("");

    setEditingId(item._id);

    setFormData({
      name: item.name,
      description: item.description,
      mobileNumber: item.mobileNumber || "",
    });
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");

    try {
      await deleteItem(id);

      setItems(
        items.filter((item) => item._id !== id)
      );

      setSuccess("Item deleted successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to delete item";

      setError(message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      if (editingId) {
        const updatedItem = await updateItem(
          editingId,
          formData
        );

        setItems(
          items.map((item) =>
            item._id === editingId
              ? updatedItem
              : item
          )
        );

        setEditingId(null);
        setSuccess("Item updated successfully");
      } else {
        const newItem = await createItem(formData);

        setItems([
          ...items,
          newItem
        ]);

        setSuccess("Item created successfully");
      }

      setFormData({
        name: "",
        description: "",
        mobileNumber: "",
      });

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to save item";

      setError(message);
    }
  };

  return (
    <div>
      <h1>MERN Internship Challenge</h1>

      <StatusMessage
        error={error}
        success={success}
      />

      <ItemForm
        formData={formData}
        editingId={editingId}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <h2>Items</h2>

      <ItemList
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;