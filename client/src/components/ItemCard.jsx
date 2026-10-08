function ItemCard({ item, onEdit, onDelete }) {
  return (
    <li>
      <strong>{item.name}</strong>

      <p>{item.description}</p>

      <p>{item.mobileNumber || "No mobile number"}</p>

      <button onClick={() => onEdit(item)}>
        Edit
      </button>

      <button onClick={() => onDelete(item._id)}>
        Delete
      </button>
    </li>
  );
}

export default ItemCard;