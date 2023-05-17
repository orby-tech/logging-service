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
      if (data.code === 401) {
        window.location.href = "/login";
      }

      return data;
    })
    .catch((err) => {
      if (err.coed === 401) {
        window.location.href = "/login";
      }
    });
};

export const loadLogs = async (page = 1) => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  }
  return await fetch(
    "/logs?" +
      new URLSearchParams({
        page,
      }),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 401) {
        window.location.href = "/login";
      }

      return data;
    })
    .catch((err) => {
      if (err.coed === 401) {
        window.location.href = "/login";
      }
    });
};
