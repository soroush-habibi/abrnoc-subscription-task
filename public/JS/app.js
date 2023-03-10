const username = document.querySelector("#username");
const id = document.querySelector("#id");
const credit = document.querySelector("#credit");
const subsUl = document.querySelector("#subs-ul");
const invoicesUl = document.querySelector("#invoices-ul");
const invoicesTitle = document.querySelector("#invoice-title");
const subLoading = document.querySelector("#sub-loading");
const invoiceLoading = document.querySelector("#invoice-loading");

// buttons
const logout = document.querySelector("#logout");
const increaseCreditBtn = document.querySelector("#increase-credit");
const plan1 = document.querySelector("#plan1");
const plan2 = document.querySelector("#plan2");
const plan3 = document.querySelector("#plan3");
const plan4 = document.querySelector("#plan4");

logout.addEventListener('click', async () => {
    try {
        const { data } = await axios.get("/api/logout");

        if (data.success) {
            document.location = "/";
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert(e.response.data.message);
    }
});

increaseCreditBtn.addEventListener('click', async () => {
    try {
        const { data } = await axios.patch("/api/increase-credit", { price: 1000 });

        if (data.success) {
            let temp = Number(credit.innerHTML.slice(0, credit.innerHTML.indexOf("$")));
            temp += 1000;
            credit.innerHTML = String(temp) + "$";
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert(e.response.data.message);
    }
});

plan1.addEventListener('click', async () => {
    try {
        const { data } = await axios.post("/api/subscribe", {
            name: "VM - Plan1",
            price: 5
        });

        if (data.success) {
            loadData();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert(e.response.data.message);
    }
});

plan2.addEventListener('click', async () => {
    try {
        const { data } = await axios.post("/api/subscribe", {
            name: "VM - Plan2",
            price: 10
        });

        if (data.success) {
            loadData();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert(e.response.data.message);
    }
});

plan3.addEventListener('click', async () => {
    try {
        const { data } = await axios.post("/api/subscribe", {
            name: "VM - Plan3",
            price: 20
        });

        if (data.success) {
            loadData();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert(e.response.data.message);
    }
});

plan4.addEventListener('click', async () => {
    try {
        const { data } = await axios.post("/api/subscribe", {
            name: "VM - Plan4",
            price: 30
        });

        if (data.success) {
            loadData();
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert(e.response.data.message);
    }
});

subsUl.addEventListener('click', async (e) => {
    const element = e.target;
    const id = element.parentElement.dataset.id;

    if (element.classList.contains("active")) {
        const status = element.parentElement.querySelector(".status");
        if (status.classList.contains("text-bg-success")) {
            try {
                const { data } = await axios.patch("/api/deactive", { subId: id });

                if (data.success) {
                    status.classList.remove("text-bg-success");
                    status.classList.add("text-bg-danger");
                    status.innerHTML = "Inactive";
                    element.innerHTML = "Enable";
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert(e.response.data.message);
            }
        } else {
            try {
                const { data } = await axios.patch("/api/active", { subId: id });

                if (data.success) {
                    status.classList.add("text-bg-success");
                    status.classList.remove("text-bg-danger");
                    status.innerHTML = "Active";
                    element.innerHTML = "Disable";
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert(e.response.data.message);
            }
        }
    } else if (element.classList.contains("delete")) {
        try {
            const { data } = await axios.delete(`/api/delete?subId=${id}`);

            if (data.success) {
                await loadData();
            } else {
                alert(data.message);
            }
        } catch (e) {
            alert(e.response.data.message);
        }
    }
});

async function loadData() {
    //load profile
    try {
        const { data } = await axios.get("/api/profile");

        if (data.success) {
            username.innerHTML = data.body.username;
            id.innerHTML = "ID: " + data.body._id;
            credit.innerHTML = data.body.credit + "$";
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert(e.response.data.message);
    }

    //load subs
    try {
        subLoading.classList.remove("d-none");
        subsUl.classList.add("d-none");
        subLoading.innerHTML = "Loading..."
        const { data } = await axios.get("/api/subs");

        if (data.success) {
            if (data.body.length > 0) {
                let li = "";
                for (let i of data.body) {
                    li += `<li class="list-group-item d-flex bg-light" data-id="${i._id}">
                <span class="title flex-grow-1 d-flex align-items-center">
                    <label>${i.name}&nbsp;</label><span class="status badge rounded-pill ${i.active ? "text-bg-success" : "text-bg-danger"}">
                    ${i.active ? "Active" : "Inactive"}</span>
                </span>
                <span class="price badge text-bg-info me-3 align-self-center">${i.price}$</span>
                <button class="active btn btn-sm btn-primary me-3 active-btn">${i.active ? "Disable" : "Enable"}</button>
                <button class="delete btn btn-sm btn-danger delete-btn">Delete</button>
            </li>`;
                }

                subsUl.innerHTML = li;
                subLoading.classList.add("d-none");
                subsUl.classList.remove("d-none");
            } else {
                subLoading.classList.remove("d-none");
                subsUl.classList.add("d-none");
                subLoading.innerHTML = "You don't have any subscription.please add one from orange section above!"
            }
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert(e.response.data.message);
    }

    //load invoices
    try {
        invoiceLoading.classList.remove("d-none");
        invoicesUl.classList.add("d-none");
        invoiceLoading.innerHTML = "Loading..."
        invoicesTitle.innerHTML = ` - Invoices <span class="badge text-bg-success position-relative">Total:Loading...<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        ...
        <span class="visually-hidden">unread messages</span>
      </span></span>`;
        const { data } = await axios.get("/api/invoices");

        if (data.success) {
            if (data.body.length > 0) {
                let li = "";
                let price = 0;
                let count = 0;
                for (let i of data.body) {
                    count++;
                    price += i.price;
                    li += `<li class="list-group-item d-flex bg-light">
                    <span class="title flex-grow-1 d-flex align-items-center">
                        <label>Invoice for "${i.name}" subscription with subId: ${i.subId}</label>
                    </span>
                    <span class="price badge text-bg-info me-3 align-self-center">${i.price}$</span>
                    <span class="time badge text-bg-info align-self-center">Start:
                        ${moment(i.startTime).local().format("MMMM Do YYYY, h:mm:ss a")}<br />End:&nbsp;&nbsp;&nbsp;
                        ${moment(i.endTime).local().format("MMMM Do YYYY, h:mm:ss a")}</span>
                </li>`;
                }

                invoicesTitle.innerHTML = ` - Invoices <span class="badge text-bg-success position-relative">Total:${price}$<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                ${count}
                <span class="visually-hidden">unread messages</span>
              </span></span>`;
                invoicesUl.innerHTML = li;
                invoiceLoading.classList.add("d-none");
                invoicesUl.classList.remove("d-none");
            } else {
                invoicesTitle.innerHTML = ` - Invoices <span class="badge text-bg-success position-relative">Total:0$<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                0
                <span class="visually-hidden">unread messages</span>
              </span></span>`;
                invoiceLoading.classList.remove("d-none");
                invoicesUl.classList.add("d-none");
                invoiceLoading.innerHTML = "You don't have any Invoices!"
            }
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert(e.response.data.message);
    }
}

loadData();

setInterval(() => {
    loadData();
}, 1000 * 10);