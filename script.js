let entries = JSON.parse(localStorage.getItem("entries") || "[]");
let hourlyRate = parseFloat(localStorage.getItem("hourlyRate")) || 0;

document.getElementById("hourlyRate").value = hourlyRate;

function saveRate() {
  hourlyRate = parseFloat(document.getElementById("hourlyRate").value);
  localStorage.setItem("hourlyRate", hourlyRate);
  updateTable();
}

function addEntry() {
  const date = document.getElementById("workDate").value;
  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;

  if (!date || !start || !end) return alert("Fill out all fields");

  const startTime = new Date(`${date}T${start}`);
  const endTime = new Date(`${date}T${end}`);

  const hours = (endTime - startTime) / (1000 * 60 * 60);
  if (hours <= 0) return alert("Invalid time range");

  entries.push({ date, hours });
  localStorage.setItem("entries", JSON.stringify(entries));

  updateTable();
}

function updateTable() {
  const tbody = document.getElementById("entriesTable");
  tbody.innerHTML = "";

  const weekStart = startOfWeek(new Date());
  let totalHours = 0;
  let totalPay = 0;

  entries.forEach(entry => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.hours.toFixed(2)}</td>
      <td>£${(entry.hours * hourlyRate).toFixed(2)}</td>
    `;
    tbody.appendChild(tr);

    const entryDate = new Date(entry.date);
    if (entryDate >= weekStart) {
      totalHours += entry.hours;
      totalPay += entry.hours * hourlyRate;
    }
  });

  document.getElementById("weeklyHours").innerText = totalHours.toFixed(2);
  document.getElementById("weeklyPay").innerText = totalPay.toFixed(2);
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  return new Date(d.setDate(diff));
}

updateTable();
