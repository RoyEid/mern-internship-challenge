function CategoryForm({ categoryName, onChange, onSubmit }) {
  return (
    <>
      <h2>Add Category</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="categoryName">Category Name</label>

          <input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={onChange}
            placeholder="Category name"
            required
          />
        </div>

        <button type="submit">Add Category</button>
      </form>
    </>
  );
}

export default CategoryForm;
