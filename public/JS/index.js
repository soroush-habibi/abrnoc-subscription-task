const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const form = document.querySelector("#form");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

registerBtn.addEventListener("click", async () => {
    try {
        const response = await axios.post("/api/register", {
            username: usernameInput.value,
            password: passwordInput.value
        });

        const data = await response.data;

        if (data.success) {
            alert("Registerd successfully! Now login");
        } else {
            alert(data.message)
        }
    } catch (e) {
        alert(e.response.data.message);
    }
});

loginBtn.addEventListener("click", async () => {
    try {
        const response = await axios.get(`/api/login?username=${usernameInput.value}&password=${passwordInput.value}`);

        const data = await response.data;

        console.log(data);

        if (data.success) {
            window.location.href = "/app";
        } else {
            alert(data.message)
        }
    } catch (e) {
        alert(e.response.data.message);
    }
});