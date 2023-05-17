import TableController from "./table-controller.mjs";

const tableController = new TableController();

document.getElementById("add-service").addEventListener("click", () => {
  document.getElementById("add-service-modal").classList.add("is-active");
});

document
  .getElementById("close-add-service-modal")
  .addEventListener("click", () => {
    document.getElementById("add-service-modal").classList.remove("is-active");
  });

document
  .getElementById("add-service-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const token = localStorage.getItem("token");

    fetch("/add-new-service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        serviceName: event.target.serviceName.value,
      }),
    })
      .then((data) => {
        if (data.status === 200) {
          document
            .getElementById("add-service-modal")
            .classList.remove("is-active");

          tableController.load();
        }
      })
      .catch((err) => console.error(err));
  });
