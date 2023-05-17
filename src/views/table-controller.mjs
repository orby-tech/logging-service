import { loadTableData as loadServicesData, loadLogs } from "./load-data.mjs";

export default class TableController {
  _data = JSON.parse(localStorage.getItem("data") || "[]");
  _ignoreList = JSON.parse(
    localStorage.getItem("ignoreList") || '["username"]'
  );
  _services = JSON.parse(localStorage.getItem("services") || "[]");
  _page = +JSON.parse(localStorage.getItem("page") || "1");

  set data(data) {
    this._data = data;
    this.draw();

    localStorage.setItem("data", JSON.stringify(data));
  }
  get data() {
    return this._data;
  }

  set ignoreList(ignoreList) {
    this._ignoreList = ignoreList;
    this.draw();

    localStorage.setItem("ignoreList", JSON.stringify(ignoreList));
  }
  get ignoreList() {
    return this._ignoreList;
  }

  set services(services) {
    this._services = services;
    this.drawServices();
  }
  get services() {
    return this._services;
  }

  set page(page) {
    this._page = page;
    this.drawTable();
    localStorage.setItem("page", JSON.stringify(page));
    this.loadLogs();
  }
  get page() {
    return this._page;
  }

  constructor() {
    this.load();
  }

  async load() {
    const data = await loadServicesData();

    this.loadLogs();
    this.services = data.services;
  }

  loadLogs = async () => {
    this.data = { ...this.data, ...(await loadLogs(this.page)) };
  };

  drawServices = () => {
    const { services } = this;
    const select = document.getElementById("services");
    this.clear(select);
    services.forEach((service, i) => {
      const li = document.createElement("li");
      li.innerText = `${i}) ${service.serviceName}`;

      const button = document.createElement("button");
      button.classList.add("button", "is-primary", "is-small");
      button.innerText = "Get secretkey";

      button.addEventListener("click", async () => {
        console.log("click");
      });
      li.appendChild(button);
      select.appendChild(li);
    });
  };

  draw = () => {
    this.drawTable();
    this.drawIgnored();
  };

  drawControls = () => {
    const { page } = this;
    const controls = document.getElementById("controls");
    this.clear(controls);
    const prevButton = document.createElement("button");
    prevButton.classList.add("button", "is-primary", "is-small");
    prevButton.innerText = "Prev";
    prevButton.onclick = () => {
      this.page = page - 1;
    };

    const pageSpan = document.createElement("span");
    pageSpan.innerText = page;

    const nextButton = document.createElement("button");
    nextButton.classList.add("button", "is-primary", "is-small");
    nextButton.innerText = "Next";
    nextButton.onclick = () => {
      this.page = page + 1;
    };
    controls.appendChild(prevButton);
    controls.appendChild(pageSpan);
    controls.appendChild(nextButton);
  };

  drawIgnored = () => {
    const { ignoreList } = this;
    const ignored = document.getElementById("ignored");
    this.clear(ignored);
    ignoreList.forEach((id) => {
      const li = document.createElement("li");
      li.classList.add("tag", "is-primary");
      li.innerText = id;
      li.appendChild(this.getDeleteFromIgnoredButton(id));
      ignored.appendChild(li);
    });
  };

  drawTable = () => {
    this.drawControls();

    const { data: _data } = this;

    const logs = _data[this.page];

    if (!logs) {
      console.error("drawTable: No logs");
      return;
    }

    const table = document.getElementById("table");
    this.clear(table);
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const allHeaders = Array.from(
      new Set(logs.map((item) => Object.keys(item)).flat())
    ).filter((header) => {
      return !this.ignoreList.includes(header);
    });

    const headers = allHeaders.map((header) => {
      const th = document.createElement("th");
      th.innerText = header;
      const deleteButton = this.getDeleteFromTableButton(header);
      th.appendChild(deleteButton);
      return th;
    });

    logs.forEach((item) => {
      const tr = document.createElement("tr");
      allHeaders.forEach((header) => {
        const td = document.createElement("td");
        let value = item[header] || "";

        if (header === "dateOnServer") {
          value = new Date(value).toLocaleString();
        } else if (header === "dateOnServiceSide") {
          value = new Date(value).toLocaleString();
        }

        td.innerText = value;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    headers.forEach((header) => {
      thead.appendChild(header);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
  };

  getDeleteFromIgnoredButton = (id) => {
    const button = this.getDeleteButton(id);
    button.onclick = () => {
      this.ignoreList = this.ignoreList.filter((item) => item !== id);
    };
    return button;
  };

  getDeleteFromTableButton = (id) => {
    const button = this.getDeleteButton(id);
    button.onclick = () => {
      this.ignoreList.push(id);
      this.ignoreList = [...this.ignoreList];
    };
    return button;
  };

  getDeleteButton = (id) => {
    const button = document.createElement("button");
    button.classList.add("delete", "is-small");
    return button;
  };

  clear = (el) => {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  };
}
