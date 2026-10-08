function ItemForm({ formData, editingId, categories, onChange, onSubmit }) {
  return (
    <>
      <h2>{editingId ? "Edit Item" : "Add Item"}</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Item name"
            value={formData.name}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>

          <input
            id="description"
            type="text"
            name="description"
            placeholder="Item description"
            value={formData.description}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label htmlFor="mobileNumber">Mobile Number</label>

          <input
            id="mobileNumber"
            type="tel"
            name="mobileNumber"
            placeholder="+961..."
            value={formData.mobileNumber}
            onChange={onChange}
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onChange}
            required
          >
            <option value="">Select a category</option>

            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">{editingId ? "Update Item" : "Add Item"}</button>
      </form>
    </>
  );
}

export default ItemForm;
