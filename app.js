/* =========================
   GLOBAL DATA
========================= */
const ADMIN_USDT = "TXxxxxADMINADDRESS";
const APP_LINK = "https://shamsahmadzai06-source.github.io/GKStore/";

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let videos = JSON.parse(localStorage.getItem("videos")) || [];
let bookRequests = JSON.parse(localStorage.getItem("bookRequests")) || [];
let buyRequests = JSON.parse(localStorage.getItem("buyRequests")) || [];
let adminPass = localStorage.getItem("adminPass") || "admin123";

/* =========================
   DOM ELEMENTS
========================= */
const authScreen = document.getElementById("authScreen");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginPhone = document.getElementById("loginPhone");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPhone = document.getElementById("signupPhone");

const app = document.getElementById("app");

const videoFeed = document.getElementById("videoFeed");
const videoTemplate = document.getElementById("videoTemplate");

const tierButtons = document.querySelectorAll(".tier-btn");
const tierPage = document.getElementById("tierPage");
const tierVideosContainer = document.getElementById("tierVideos");
const tierTitle = document.getElementById("tierTitle");
const noTierVideos = document.getElementById("noTierVideos");
const backToAccount = document.getElementById("backToAccount");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");

const navHome = document.getElementById("navHome");
const navAccount = document.getElementById("navAccount");
const navProfile = document.getElementById("navProfile");
const navContact = document.getElementById("navContact");
const navAdmin = document.getElementById("navAdmin");

const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminPassInput = document.getElementById("adminPassInput");
const adminLoginBox = document.getElementById("adminLoginBox");
const adminContent = document.getElementById("adminContent");
const userCount = document.getElementById("userCount");
const onlineCount = document.getElementById("onlineCount");
const bookCount = document.getElementById("bookCount");

const uploadVideoBtn = document.getElementById("uploadVideoBtn");
const videoID = document.getElementById("videoID");
const videoTitle = document.getElementById("videoTitle");
const videoFile = document.getElementById("videoFile");
const videoPrice = document.getElementById("videoPrice");
const videoTier = document.getElementById("videoTier");

const oldPass = document.getElementById("oldPass");
const newPass = document.getElementById("newPass");
const changePassBtn = document.getElementById("changePassBtn");

const notificationContainer = document.getElementById("notificationContainer");
const installBtn = document.getElementById("installBtn");

/* =========================
   PWA INSTALL PROMPT
========================= */
let deferredPrompt;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});

installBtn.onclick = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add("hidden");
};

/* =========================
   SERVICE WORKER
========================= */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.error("SW Error", err));
}

/* =========================
   LOGIN / SIGNUP TABS
========================= */
tabLogin.onclick = () => {
  tabLogin.classList.add("active");
  tabSignup.classList.remove("active");
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
};

tabSignup.onclick = () => {
  tabSignup.classList.add("active");
  tabLogin.classList.remove("active");
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
};

/* =========================
   LOGIN
========================= */
loginBtn.onclick = () => {
  const phone = loginPhone.value.trim();
  if (!phone) return alert("Enter WhatsApp Number");

  const user = users.find(u => u.phone === phone);
  if (!user) return alert("User not found, please signup");

  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  authScreen.classList.add("hidden");
  app.classList.remove("hidden");

  updateProfile();
  loadHomeVideos();
  updateAdminStats();
};

/* =========================
   SIGNUP
========================= */
signupBtn.onclick = () => {
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const phone = signupPhone.value.trim();

  if (!name || !email || !phone) return alert("Fill all fields");
  if (users.find(u => u.phone === phone)) return alert("User already exists");

  const newUser = { name, email, phone };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  currentUser = newUser;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  authScreen.classList.add("hidden");
  app.classList.remove("hidden");

  updateProfile();
  loadHomeVideos();
  updateAdminStats();
};

/* =========================
   PROFILE
========================= */
function updateProfile() {
  if (!currentUser) return;
  profileName.textContent = currentUser.name;
  profileEmail.textContent = currentUser.email;
  profilePhone.textContent = currentUser.phone;
}

/* =========================
   NAVIGATION
========================= */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  videoFeed.classList.add("hidden");

  if (id === "home") {
    videoFeed.classList.remove("hidden");
    loadHomeVideos();
  } else {
    document.getElementById(id).classList.remove("hidden");
  }
}

navHome.onclick = () => showPage("home");
navAccount.onclick = () => showPage("account");
navProfile.onclick = () => showPage("profile");
navContact.onclick = () => showPage("contact");
navAdmin.onclick = () => showPage("admin");

/* =========================
   HOME VIDEOS
========================= */
function loadHomeVideos() {
  videoFeed.innerHTML = "";
  if (!videos.length) return;
  videos.forEach(v => videoFeed.appendChild(createVideo(v, true)));
}

/* =========================
   TIER PAGES
========================= */
tierButtons.forEach(btn => {
  btn.onclick = () => openTier(btn.dataset.tier);
});

backToAccount.onclick = () => showPage("account");

function openTier(tier) {
  showPage("tierPage");
  tierTitle.textContent = tier.toUpperCase() + " TIER";
  tierVideosContainer.innerHTML = "";

  const list = videos.filter(v => v.tier === tier);
  if (!list.length) {
    noTierVideos.classList.remove("hidden");
    return;
  }

  noTierVideos.classList.add("hidden");
  list.forEach(v => tierVideosContainer.appendChild(createVideo(v, false)));
}

/* =========================
   VIDEO CREATOR
========================= */
function createVideo(video, vertical) {
  const clone = videoTemplate.content.cloneNode(true);
  const vid = clone.querySelector("video");
  const info = clone.querySelector(".video-info");

  vid.src = video.url;
  vid.loop = true;
  vid.autoplay = true;
  vid.muted = vertical;
  vid.controls = !vertical;

  vid.onclick = () => (vid.paused ? vid.play() : vid.pause());

  info.textContent = `${video.title} • $${video.price}`;

  clone.querySelector(".btn-buy").onclick = () => openBuy(video);
  clone.querySelector(".btn-book").onclick = () => openBook(video);
  clone.querySelector(".btn-share").onclick = shareApp;

  return clone;
}

/* =========================
   BUY / BOOK POPUPS
========================= */
function openBuy(video) {
  showPopup("Buy Video", true, video);
}
function openBook(video) {
  showPopup("Book Video", false, video);
}

function showPopup(title, showUSDT, video) {
  let buyPopup = document.getElementById("buyPopup");
  if (!buyPopup) {
    buyPopup = document.createElement("div");
    buyPopup.id = "buyPopup";
    buyPopup.className = "popup hidden";
    buyPopup.innerHTML = `
      <div class="popup-box">
        <h3 id="popupTitle">${title}</h3>
        <div id="usdtText">Send USDT:</div>
        <div id="usdtAddress">${ADMIN_USDT}</div>
        <input id="buyerName" placeholder="Your Name">
        <input id="buyerWhats" placeholder="WhatsApp Number">
        <button id="confirmBtn">Confirm</button>
        <button id="cancelBtn">Cancel</button>
      </div>`;
    document.body.appendChild(buyPopup);
    document.getElementById("cancelBtn").onclick = () => buyPopup.classList.add("hidden");
  }

  buyPopup.classList.remove("hidden");
  document.getElementById("popupTitle").textContent = title;
  document.getElementById("usdtText").style.display = showUSDT ? "block" : "none";
  document.getElementById("usdtAddress").style.display = showUSDT ? "block" : "none";

  document.getElementById("confirmBtn").onclick = () => confirmAction(showUSDT, video);
}

function confirmAction(isBuy, video) {
  const name = document.getElementById("buyerName").value.trim();
  const whatsapp = document.getElementById("buyerWhats").value.trim();
  if (!name || !whatsapp) return alert("Fill all fields");

  const req = { videoTitle: video.title, name, whatsapp, date: Date.now() };

  if (isBuy) {
    buyRequests.push(req);
    localStorage.setItem("buyRequests", JSON.stringify(buyRequests));
    alert(`Send USDT to:\n${ADMIN_USDT}`);
  } else {
    bookRequests.push(req);
    localStorage.setItem("bookRequests", JSON.stringify(bookRequests));
    alert("Admin will contact you");
  }

  document.getElementById("buyPopup").classList.add("hidden");
  document.getElementById("buyerName").value = "";
  document.getElementById("buyerWhats").value = "";
}

/* =========================
   SHARE
========================= */
function shareApp() {
  if (navigator.share) {
    navigator.share({ title: "GK Store", url: APP_LINK });
  } else {
    navigator.clipboard.writeText(APP_LINK);
    alert("Link copied");
  }
}

/* =========================
   ADMIN PANEL
========================= */
adminLoginBtn.onclick = () => {
  if (adminPassInput.value === adminPass) {
    adminLoginBox.classList.add("hidden");
    adminContent.classList.remove("hidden");
    updateAdminStats();
    loadAllNotifications();
  } else {
    alert("Wrong password");
  }
};

function updateAdminStats() {
  userCount.textContent = users.length;
  bookCount.textContent = bookRequests.length;
  onlineCount.textContent = currentUser ? 1 : 0;
}

function loadAllNotifications() {
  notificationContainer.innerHTML = "";
}

/* =========================
   UPLOAD VIDEO
========================= */
uploadVideoBtn.onclick = () => {
  const file = videoFile.files[0];
  if (!file) return alert("Select video");

  const url = URL.createObjectURL(file);

  videos.push({
    id: videoID.value,
    title: videoTitle.value,
    price: videoPrice.value,
    tier: videoTier.value,
    url
  });

  localStorage.setItem("videos", JSON.stringify(videos));
  alert("Video uploaded");
  loadHomeVideos();
};

/* =========================
   CHANGE PASSWORD
========================= */
changePassBtn.onclick = () => {
  if (oldPass.value !== adminPass) return alert("Wrong password");
  adminPass = newPass.value;
  localStorage.setItem("adminPass", adminPass);
  alert("Password changed");
};

/* =========================
   INIT
========================= */
if (currentUser) {
  authScreen.classList.add("hidden");
  app.classList.remove("hidden");
  updateProfile();
  loadHomeVideos();
}
