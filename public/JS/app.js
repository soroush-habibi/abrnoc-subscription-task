const username = document.querySelector("#username");
const id = document.querySelector("#id");
const credit = document.querySelector("#credit");

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

async function loadData() {
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
}

loadData();