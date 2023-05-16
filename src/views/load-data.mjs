export const loadTableData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }
  return await fetch("/panel-data", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      if (data.code === 401) {
        window.location.href = "/login";
      }

      return data;
    })
    .catch((err) => {
      console.log(err);
      if (err.coed === 401) {
        window.location.href = "/login";
      }
    });
};
