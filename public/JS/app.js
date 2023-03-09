const username = document.querySelector("#username");
const id = document.querySelector("#id");
const credit = document.querySelector("#credit");
const logout = document.querySelector("#logout");

logout.addEventListener('click', async () => {
    try {
        const { data } = await axios.get("/api/logout");

        if (data.success) {
            document.location = "/";
        } else {
            alert(data.message)
        }
    } catch (e) {
        alert(e.response.data.message)
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
            alert(data.message)
        }
    } catch (e) {
        alert(e.response.data.message)
    }
}

loadData();