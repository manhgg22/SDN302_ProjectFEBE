const token = localStorage.getItem("token");
axios.get("http://localhost:9999/admin/accounts", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
