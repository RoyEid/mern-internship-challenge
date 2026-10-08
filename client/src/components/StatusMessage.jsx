function StatusMessage({ error, success }) {
  if (error) {
    return <p>{error}</p>;
  }

  if (success) {
    return <p>{success}</p>;
  }

  return null;
}

export default StatusMessage;