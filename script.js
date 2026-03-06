import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js"; // Make sure Chart.js is imported if needed

// --------------------------
// Firebase Config
// --------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCM0H10wCLPALb5hg4UfNjrQx94QgvBWpA",
  authDomain: "livestock-monitor-ba87b.firebaseapp.com",
  databaseURL: "https://livestock-monitor-ba87b-default-rtdb.firebaseio.com",
  projectId: "livestock-monitor-ba87b",
  storageBucket: "livestock-monitor-ba87b.appspot.com",
  messagingSenderId: "1005114027856",
  appId: "1:1005114027856:web:a3437c80e4109deb0bc655",
  measurementId: "G-K3HK2923W6"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --------------------------
// Database References
// --------------------------
const healthRef = ref(db, 'health');
const activityRef = ref(db, 'activity');
const environmentRef = ref(db, 'environment');
const treatmentRef = ref(db, 'treatment');

// --------------------------
// Health Status
// --------------------------
onValue(healthRef, (snapshot) => {
  const healthContainer = document.querySelector('section.card:nth-child(1)');
  healthContainer.innerHTML = '<h2>Livestock Health Status</h2>'; // Reset content
  snapshot.forEach((child) => {
    const data = child.val();
    const div = document.createElement('div');
    div.className = `status ${data.status.toLowerCase()}`;
    div.innerHTML = `<span>${data.name}</span><span>${data.status} ●</span>`;
    healthContainer.appendChild(div);
  });
});

// --------------------------
// Activity Patterns
// --------------------------
onValue(activityRef, (snapshot) => {
  const ctx = document.getElementById('activityChart').getContext('2d');
  const labels = [];
  const values = [];
  snapshot.forEach((child) => {
    const data = child.val();
    labels.push(data.animal);
    values.push(data.activity);
  });

  // Destroy previous chart if exists
  if (window.activityChart) window.activityChart.destroy();

  window.activityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Activity Level',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
});

// --------------------------
// Environmental Conditions
// --------------------------
onValue(environmentRef, (snapshot) => {
  const ctx = document.getElementById('envChart').getContext('2d');
  const labels = [];
  const temps = [];
  const humidity = [];
  snapshot.forEach((child) => {
    const data = child.val();
    labels.push(data.location);
    temps.push(data.temperature);
    humidity.push(data.humidity);
  });

  // Destroy previous chart if exists
  if (window.envChart) window.envChart.destroy();

  window.envChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        { label: 'Temperature (°C)', data: temps, borderColor: 'red', fill: false },
        { label: 'Humidity (%)', data: humidity, borderColor: 'blue', fill: false }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
});

// --------------------------
// Treatment Records
// --------------------------
onValue(treatmentRef, (snapshot) => {
  const treatmentContainer = document.querySelector('section.card:nth-child(4)');
  treatmentContainer.innerHTML = '<h2>Treatment & Vaccination Records</h2>';
  snapshot.forEach((child) => {
    const data = child.val();
    const div = document.createElement('div');
    div.className = 'record';
    div.innerHTML = `<span>${data.animal} - ${data.treatment}</span><span>${data.status}</span>`;
    treatmentContainer.appendChild(div);
  });
});