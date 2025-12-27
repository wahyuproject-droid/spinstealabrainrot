/* ===============================
   NAVIGATION
================================ */
const sections = ["home","login","spin","admin","adminLogin"];
function show(id){
  sections.forEach(s=>{
    const el=document.getElementById(s);
    if(el) el.classList.add("hide");
  });
  document.getElementById(id).classList.remove("hide");
}
const goHome=()=>show("home");
const goLogin=()=>show("login");
const openAdminLogin=()=>show("adminLogin");

/* ===============================
   STORAGE INIT
================================ */
if(!localStorage.users){
  localStorage.users = JSON.stringify({});
}
if(!localStorage.admin){
  localStorage.admin = JSON.stringify({
    user:"admin",
    pass:"admin123"
  });
}

let currentUser=null;
let adminLogged=false;

/* ===============================
   LOGIN USER
================================ */
function login(){
  const users=JSON.parse(localStorage.users);
  const u=loginUser.value;
  const p=loginPass.value;

  if(users[u] && users[u].pass===p){
    currentUser=u;
    updateCoin();
    show("spin");
  }else{
    alert("Username / Password salah");
  }
}

function logout(){
  currentUser=null;
  goHome();
}

/* ===============================
   SPIN CONFIG
================================ */
const reel=document.getElementById("reel");

/* ITEM + WINRATE */
const rewards=[
  {name:"maaf zonk",rate:99},
  {name:"secret random",rate:0.2},
  {name:"secret bebas pilih",rate:0.1}
];

function getReward(){
  let roll=Math.random()*100;
  let sum=0;
  for(let r of rewards){
    sum+=r.rate;
    if(roll<=sum) return r.name;
  }
  return "💎 DIAMOND";
}

/* ===============================
   COIN & DATA
================================ */
function updateCoin(){
  const users=JSON.parse(localStorage.users);
  coinText.innerText="Coin: "+users[currentUser].coin;
}

/* ===============================
   SPIN ENGINE
================================ */
function spin(){
  const users=JSON.parse(localStorage.users);
  const u=users[currentUser];

  if(u.coin<5){
    coinText.classList.add("shake");
    setTimeout(()=>coinText.classList.remove("shake"),400);
    return;
  }

  /* POTONG COIN */
  u.coin -= 10;
  u.spin += 1;
  localStorage.users = JSON.stringify(users);
  updateCoin();

  /* ANIMASI COIN */
  coinText.classList.add("flash");
  setTimeout(()=>coinText.classList.remove("flash"),400);

  /* SPIN MESIN */
  reel.classList.remove("win");
  reel.classList.add("spin");

  let rolling=setInterval(()=>{
    reel.innerText=rewards[Math.floor(Math.random()*rewards.length)].name;
  },70);

  setTimeout(()=>{
    clearInterval(rolling);
    reel.classList.remove("spin");

    const win=getReward();
    reel.innerText=win;
    reel.classList.add("win");

    u.rewards.push(win);
    localStorage.users=JSON.stringify(users);
  },2000);
}

/* ===============================
   ADMIN LOGIN
================================ */
function adminLogin(){
  const a=JSON.parse(localStorage.admin);
  if(adminUser.value===a.user && adminPass.value===a.pass){
    adminLogged=true;
    show("admin");
  }else{
    alert("Admin salah");
  }
}

function adminLogout(){
  adminLogged=false;
  goHome();
}

/* ===============================
   ADMIN ACTION
================================ */
function createUser(){
  const users=JSON.parse(localStorage.users);
  const u=newUser.value;
  const p=newPass.value;

  if(!u||!p) return alert("Isi semua");
  if(users[u]) return alert("User sudah ada");

  users[u]={
    pass:p,
    coin:0,
    spin:0,
    rewards:[]
  };
  localStorage.users=JSON.stringify(users);
  alert("User dibuat");
}

function addCoin(){
  const users=JSON.parse(localStorage.users);
  const u=coinUser.value;
  const c=Number(coinAmount.value);

  if(!users[u]) return alert("User tidak ada");
  users[u].coin=c;
  localStorage.users=JSON.stringify(users);
}

/* ===============================
   MONITOR REALTIME
================================ */
setInterval(()=>{
  if(!adminLogged) return;
  const users=JSON.parse(localStorage.users);
  monitorTable.innerHTML="";
  for(let u in users){
    monitorTable.innerHTML+=`
      <tr>
        <td>${u}</td>
        <td>${users[u].coin}</td>
        <td>${users[u].spin}</td>
        <td>${users[u].rewards.join(", ") || "-"}</td>
      </tr>
    `;
  }
},400);

/* ===============================
   WHATSAPP
================================ */
function chatWA(){
  const msg=encodeURIComponent(
    "Halo admin, saya mau beli koin. Mohon info list & harga."
  );
  window.open(
    "https://wa.me/6287778913867?text="+msg,
    "_blank"
  );
}
