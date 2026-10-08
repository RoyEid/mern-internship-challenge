import { useEffect, useState } from "react";

import ItemForm from "./components/ItemForm.jsx";
import ItemList from "./components/ItemList.jsx";
import CategoryForm from "./components/CategoryForm.jsx";
import StatusMessage from "./components/StatusMessage.jsx";

import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "./services/itemService.js";

import { getCategories, createCategory } from "./services/categoryService.js";

import "./App.css";

function App() {
  const [items, setItems] = useState([]);

  const [categories, setCategories] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [categoryName, setCategoryName] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mobileNumber: "",
    category: "",
  });

  const fetchData = async () => {
    try {
      const [itemsData, categoriesData] = await Promise.all([
        getItems(),
        getCategories(),
      ]);

      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      const newCategory = await createCategory({
        name: categoryName,
      });

      setCategories((previousCategories) =>
        [...previousCategories, newCategory].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );

      setFormData((previousData) => ({
        ...previousData,
        category: newCategory._id,
      }));

      setCategoryName("");

      setSuccess("Category created successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create category");
    }
  };

  const handleEdit = (item) => {
    setError("");
    setSuccess("");

    setEditingId(item._id);

    setFormData({
      name: item.name,
      description: item.description,
      mobileNumber: item.mobileNumber || "",
      category: item.category?._id || "",
    });
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");

    try {
      await deleteItem(id);

      setItems((previousItems) =>
        previousItems.filter((item) => item._id !== id),
      );

      if (editingId === id) {
        setEditingId(null);

        setFormData({
          name: "",
          description: "",
          mobileNumber: "",
          category: "",
        });
      }

      setSuccess("Item deleted successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete item");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      if (editingId) {
        const updatedItem = await updateItem(editingId, formData);

        setItems((previousItems) =>
          previousItems.map((item) =>
            item._id === editingId ? updatedItem : item,
          ),
        );

        setEditingId(null);

        setSuccess("Item updated successfully");
      } else {
        const newItem = await createItem(formData);

        setItems((previousItems) => [...previousItems, newItem]);

        setSuccess("Item created successfully");
      }

      setFormData({
        name: "",
        description: "",
        mobileNumber: "",
        category: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save item");
    }
  };

  return (
    <>
      <h1>MERN Internship Challenge</h1>

      <StatusMessage error={error} success={success} />

      <CategoryForm
        categoryName={categoryName}
        onChange={handleCategoryChange}
        onSubmit={handleCategorySubmit}
      />

      <ItemForm
        formData={formData}
        editingId={editingId}
        categories={categories}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <h2>Items</h2>

      <ItemList items={items} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
}

export default App;
