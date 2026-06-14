"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

const totalJobs = document.getElementById("totalJobs");
const appliedJobs = document.getElementById("appliedJobs");
const interviewJobs = document.getElementById("interviewJobs");
const offerJobs = document.getElementById("offerJobs");
const rejectedJobs = document.getElementById("rejectedJobs");

const jobForm = document.getElementById("jobForm");

const companyInput = document.getElementById("companyInput");
const positionInput = document.getElementById("positionInput");
const statusInput = document.getElementById("statusInput");
const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll("[data-filter]");

const jobsGrid = document.getElementById("jobsGrid");

// ======================================================
// JOB STATE
// ======================================================

let jobs = [];

let currentFilter = "all";

// ======================================================
// STORAGE SYSTEM
// ======================================================

function saveJobs() {
  localStorage.setItem("jobTracker", JSON.stringify(jobs));
}

function loadJobs() {
  const storedJobs = localStorage.getItem("jobTracker");

  if (storedJobs) {
    jobs = JSON.parse(storedJobs);
  }
}

// ======================================================
// JOB ACTIONS
// ======================================================

function addJob() {
  const job = {
    id: Date.now(),
    company: companyInput.value.trim(),
    position: positionInput.value.trim(),
    status: statusInput.value,
  };

  jobs.push(job);

  saveJobs();
  renderJobs();
  renderStats();

  jobForm.reset();
}

function deleteJob(id) {
  jobs = jobs.filter((job) => {
    return job.id !== id;
  });

  saveJobs();
  renderJobs();
  renderStats();
}

function updateJobStatus(id, newStatus) {
  const job = jobs.find((job) => {
    return job.id === id;
  });

  if (!job) return;

  job.status = newStatus;

  saveJobs();
  renderJobs();
  renderStats();
}

// ======================================================
// FILTERING SYSTEM
// ======================================================

function getFilteredJobs() {
  let filteredJobs = [...jobs];

  const searchValue = searchInput.value.toLowerCase().trim();

  if (searchValue !== "") {
    filteredJobs = filteredJobs.filter((job) => {
      return (
        job.company.toLowerCase().includes(searchValue) ||
        job.position.toLowerCase().includes(searchValue)
      );
    });
  }

  if (currentFilter === "applied") {
    filteredJobs = filteredJobs.filter((job) => {
      return job.status === "applied";
    });
  }

  if (currentFilter === "interview") {
    filteredJobs = filteredJobs.filter((job) => {
      return job.status === "interview";
    });
  }

  if (currentFilter === "offer") {
    filteredJobs = filteredJobs.filter((job) => {
      return job.status === "offer";
    });
  }

  if (currentFilter === "rejected") {
    filteredJobs = filteredJobs.filter((job) => {
      return job.status === "rejected";
    });
  }

  return filteredJobs;
}

// ======================================================
// UI RENDERING
// ======================================================

function renderJobs() {
  jobsGrid.innerHTML = "";

  const filteredJobs = getFilteredJobs();

  if (filteredJobs.length === 0) {
    jobsGrid.innerHTML = `
    <div class="empty-jobs">
    <h3>No jobs found</h3>
    <p>Add your first application or try another search/filter.</p>
    </div>
    `;

    return;
  }

  filteredJobs.forEach((job) => {
    jobsGrid.innerHTML += `
       <article class="job-card ${job.status}">
        <h3 class="job-company">${job.company}</h3>

        <p class="job-position">${job.position}</p>

        <span class="status-badge ${job.status}">
          ${job.status}
        </span>

        <div class="job-actions">
          <select class="status-select" data-id="${job.id}">
            <option value="applied" ${job.status === "applied" ? "selected" : ""}>
              Applied
            </option>

            <option value="interview" ${job.status === "interview" ? "selected" : ""}>
              Interview
            </option>

            <option value="offer" ${job.status === "offer" ? "selected" : ""}>
              Offer
            </option>

            <option value="rejected" ${job.status === "rejected" ? "selected" : ""}>
              Rejected
            </option>
          </select>

          <button class="delete-job" data-id="${job.id}">
            Delete
          </button>
        </div>
      </article>
      `;
  });
}

function renderStats() {
  const appliedCount = jobs.filter((job) => {
    return job.status === "applied";
  }).length;

  const interviewCount = jobs.filter((job) => {
    return job.status === "interview";
  }).length;

  const offerCount = jobs.filter((job) => {
    return job.status === "offer";
  }).length;

  const rejectedCount = jobs.filter((job) => {
    return job.status === "rejected";
  }).length;

  totalJobs.textContent = jobs.length;
  appliedJobs.textContent = appliedCount;
  interviewJobs.textContent = interviewCount;
  offerJobs.textContent = offerCount;
  rejectedJobs.textContent = rejectedCount;
}
// ======================================================
// FORM HANDLING
// ======================================================

jobForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (companyInput.value.trim() === "" || positionInput.value.trim() === "") {
    return;
  }

  addJob();
});

// ======================================================
// EVENT LISTENERS
// ======================================================

searchInput.addEventListener("input", renderJobs);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderJobs();
  });
});

jobsGrid.addEventListener("change", (e) => {
  if (e.target.classList.contains("status-select")) {
    const id = Number(e.target.dataset.id);

    const newStatus = e.target.value;

    updateJobStatus(id, newStatus);
  }
});

jobsGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-job")) {
    const id = Number(e.target.dataset.id);

    deleteJob(id);
  }
});

// ======================================================
// INITIAL LOAD
// ======================================================

loadJobs();
renderJobs();
renderStats();
