const username = document.querySelector("#username");
const id = document.querySelector("#id");
const credit = document.querySelector("#credit");
const subsUl = document.querySelector("#subs-ul");
const subLoading = document.querySelector("#sub-loading");

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
        if (element.classList.contains("btn-success")) {
            try {
                const { data } = await axios.patch("/api/deactive", { subId: id });

                if (data.success) {
                    element.classList.remove("btn-success");
                    element.classList.add("btn-secondary");
                    element.innerHTML = "Switch on";
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
                    element.classList.add("btn-success");
                    element.classList.remove("btn-secondary");
                    element.innerHTML = "Switch off";
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
                    <label>${i.name}</label>
                </span>
                <span class="price badge text-bg-info me-3 align-self-center">${i.price}$</span>
                <button class="active btn btn-sm ${i.active ? "btn-success" : "btn-secondary"} me-3 active-btn">${i.active ? "Switch off" : "Switch on"}</button>
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
}

loadData();

setInterval(() => {
    loadData();
}, 1000 * 10);