const students = [
    { id: "STU001", name: "Rahul Sharma", username: "student1", password: "stud123" },
    { id: "STU002", name: "Amit Patil", username: "student2", password: "stud123" },
    { id: "STU003", name: "Priya Verma", username: "student3", password: "stud123" },
    { id: "STU004", name: "Sneha Gupta", username: "student4", password: "stud123" },
    { id: "STU005", name: "Rohit Kumar", username: "student5", password: "stud123" }
];

const teacher = {
    username: "teacher",
    password: "teach123"
};

let currentStudent = null;

let attendanceData = JSON.parse(
    localStorage.getItem("attendanceData") || "{}"
);

function login() {
    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    error.textContent = "";

    if (role === "teacher") {
        if (
            username === teacher.username &&
            password === teacher.password
        ) {
            document.getElementById("loginPage").classList.add("hidden");
            document.getElementById("teacherDashboard").classList.remove("hidden");

            document.getElementById("attendanceDate").value =
                new Date().toISOString().split("T")[0];

            showSection("home");
            updateDashboard();
        } else {
            error.textContent = "Invalid Teacher Username or Password!";
        }
    } else {
        const student = students.find(
            s => s.username === username && s.password === password
        );

        if (student) {
            currentStudent = student;

            document.getElementById("loginPage").classList.add("hidden");
            document.getElementById("studentDashboard").classList.remove("hidden");

            document.getElementById("studentWelcome").textContent =
                "Welcome, " + student.name;

            showStudentSection("studentHome");
            updateStudentDashboard();
        } else {
            error.textContent = "Invalid Student Username or Password!";
        }
    }
}

function logout() {
    currentStudent = null;

    document.getElementById("teacherDashboard").classList.add("hidden");
    document.getElementById("studentDashboard").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("error").textContent = "";
}

function showSection(sectionId) {
    document.querySelectorAll("#teacherDashboard .section")
        .forEach(section => section.classList.add("hidden"));

    document.getElementById(sectionId).classList.remove("hidden");

    if (sectionId === "attendance") {
        renderStudentList();
    }

    if (sectionId === "records") {
        renderRecords();
    }
}

function showStudentSection(sectionId) {
    document.querySelectorAll("#studentDashboard .section")
        .forEach(section => section.classList.add("hidden"));

    document.getElementById(sectionId).classList.remove("hidden");

    if (sectionId === "myAttendance") {
        renderMyRecords();
    }
}

function renderStudentList() {
    const list = document.getElementById("studentList");
    const date = document.getElementById("attendanceDate").value;

    list.innerHTML = "";

    students.forEach(student => {
        const savedStatus =
            attendanceData[date]?.[student.id] || "Present";

        const row = document.createElement("div");
        row.className = "student-row";

        const name = document.createElement("span");
        name.textContent = student.id + " - " + student.name;

        const select = document.createElement("select");
        select.id = "status-" + student.id;

        ["Present", "Absent", "Late"].forEach(status => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            select.appendChild(option);
        });

        select.value = savedStatus;

        row.appendChild(name);
        row.appendChild(select);
        list.appendChild(row);
    });
}

document.getElementById("attendanceDate").addEventListener("change", () => {
    renderStudentList();
});

function saveAttendance() {
    const date = document.getElementById("attendanceDate").value;

    if (!date) {
        alert("Please select a date!");
        return;
    }

    attendanceData[date] = {};

    students.forEach(student => {
        attendanceData[date][student.id] =
            document.getElementById("status-" + student.id).value;
    });

    localStorage.setItem(
        "attendanceData",
        JSON.stringify(attendanceData)
    );

    document.getElementById("saveMessage").textContent =
        "Attendance saved successfully!";

    updateDashboard();
}

function updateDashboard() {
    const today = new Date().toISOString().split("T")[0];
    const todayData = attendanceData[today] || {};

    document.getElementById("totalStudents").textContent =
        students.length;

    document.getElementById("presentCount").textContent =
        Object.values(todayData).filter(s => s === "Present").length;

    document.getElementById("absentCount").textContent =
        Object.values(todayData).filter(s => s === "Absent").length;
}

function renderRecords() {
    const container = document.getElementById("recordsList");

    let html = `
        <table>
        <tr>
            <th>Date</th>
            <th>Student ID</th>
            <th>Name</th>
            <th>Status</th>
        </tr>
    `;

    Object.keys(attendanceData).sort().reverse().forEach(date => {
        students.forEach(student => {
            const status = attendanceData[date][student.id];

            if (status) {
                html += `
                    <tr>
                        <td>${date}</td>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${status}</td>
                    </tr>
                `;
            }
        });
    });

    html += "</table>";
    container.innerHTML = html;
}

function updateStudentDashboard() {
    if (!currentStudent) return;

    const records = Object.values(attendanceData)
        .map(day => day[currentStudent.id])
        .filter(Boolean);

    const present = records.filter(s => s === "Present").length;
    const percentage = records.length
        ? Math.round((present / records.length) * 100)
        : 0;

    document.getElementById("attendancePercentage").textContent =
        percentage + "%";
}

function renderMyRecords() {
    if (!currentStudent) return;

    const container = document.getElementById("myRecords");

    let html = `
        <table>
        <tr>
            <th>Date</th>
            <th>Status</th>
        </tr>
    `;

    Object.keys(attendanceData).sort().reverse().forEach(date => {
        const status = attendanceData[date][currentStudent.id];

        if (status) {
            html += `
                <tr>
                    <td>${date}</td>
                    <td>${status}</td>
                </tr>
            `;
        }
    });

    html += "</table>";
    container.innerHTML = html;
    updateStudentDashboard();
}