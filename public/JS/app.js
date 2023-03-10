const username = document.querySelector("#username");
const id = document.querySelector("#id");
const credit = document.querySelector("#credit");
const subsUl = document.querySelector("#subs-ul");

// buttons
const logout = document.querySelector("#logout");
const increaseCreditBtn = document.querySelector("#increase-credit");

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
                loadData();
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
        const { data } = await axios.get("/api/subs");

        if (data.success) {
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