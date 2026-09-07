const sections = document.querySelectorAll(".section");
const navItems = document.querySelectorAll(".nav-item");
const sidebar = document.getElementById("sidebar");

function showSection(id){
  sections.forEach(s => s.classList.toggle("active", s.id === id));
  navItems.forEach(n => n.classList.toggle("active", n.dataset.section === id));
  window.scrollTo({top:0, behavior:"smooth"});
  if(window.innerWidth <= 800) sidebar.classList.remove("open");
}

navItems.forEach(item => item.addEventListener("click", () => showSection(item.dataset.section)));
document.getElementById("menuBtn").addEventListener("click", () => sidebar.classList.toggle("open"));

function notify(message){
  const toast=document.getElementById("toast");
  toast.textContent=message;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2500);
}

function openModal(html){
  document.getElementById("modalContent").innerHTML=html;
  document.getElementById("modal").classList.add("show");
}
function closeModal(){document.getElementById("modal").classList.remove("show");}
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal();});

function openTransaction(){
  openModal(`
    <h2>Registrar movimiento</h2>
    <p style="color:#697386;font-size:12px">Añade un ingreso o gasto para mantener tu presupuesto actualizado.</p>
    <form class="form" onsubmit="saveTransaction(event)">
      <label>Tipo</label>
      <select id="movementType"><option value="income">Ingreso</option><option value="expense">Gasto</option></select>
      <label>Descripción</label>
      <input id="movementName" required placeholder="Ej. Venta de productos">
      <label>Valor (COP)</label>
      <input id="movementValue" required type="number" min="1" placeholder="50000">
      <button type="submit">Guardar movimiento</button>
    </form>
  `);
}

function money(n){return "$"+Number(n).toLocaleString("es-CO")+" COP";}

function saveTransaction(e){
  e.preventDefault();
  const type=document.getElementById("movementType").value;
  const name=document.getElementById("movementName").value;
  const value=Number(document.getElementById("movementValue").value);
  const row=document.createElement("div");
  row.innerHTML=`<span>${type==="income"?"💼":"🛒"} ${name}</span><b class="${type==="income"?"income":"expense"}">${type==="income"?"+":"-"}${money(value)}</b>`;
  document.getElementById("transactions").prepend(row);
  closeModal();
  notify("Movimiento guardado correctamente ✓");
}

function simulate(name, investment, profit){
  const total=investment+profit;
  openModal(`
    <h2>Simulación: ${name}</h2>
    <p style="color:#697386;font-size:13px">Esta simulación es educativa. Una ganancia real puede ser menor, igual, mayor o incluso existir una pérdida.</p>
    <div style="background:#f5faf7;border-radius:12px;padding:18px;margin:15px 0">
      <p>Inversión inicial <b style="float:right">${money(investment)}</b></p>
      <p>Ganancia estimada <b style="float:right;color:#16a765">${money(profit)}</b></p>
      <hr style="border:0;border-top:1px solid #dfe9e3">
      <p><strong>Capital final estimado</strong><b style="float:right">${money(total)}</b></p>
    </div>
    <button class="form" style="border:0;background:#16a765;color:#fff;border-radius:9px;padding:11px;width:100%;font-weight:700" onclick="closeModal();notify('Simulación guardada en tu progreso ✓')">Entendido</button>
  `);
}

function filterCards(risk, button){
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  button.classList.add("active");
  document.querySelectorAll(".growth-card").forEach(card=>{
    card.style.display=(risk==="all"||card.dataset.risk===risk)?"block":"none";
  });
}

function addGoal(){
  openModal(`
    <h2>Crear una meta</h2>
    <form class="form" onsubmit="saveGoal(event)">
      <label>Nombre de la meta</label>
      <input id="goalName" required placeholder="Ej. Comprar una bicicleta">
      <label>Valor objetivo (COP)</label>
      <input id="goalValue" required type="number" min="1" placeholder="800000">
      <button type="submit">Crear meta</button>
    </form>
  `);
}
function saveGoal(e){
  e.preventDefault();
  const name=document.getElementById("goalName").value;
  const value=Number(document.getElementById("goalValue").value);
  const box=document.querySelector(".goal-list");
  const div=document.createElement("div");
  div.className="goal-large";
  div.innerHTML=`<div class="goal-icon">🎯</div><div class="grow"><h2>${name}</h2><p>Meta: ${money(value)} · Ahorrado: $0</p><div class="progress-track"><div class="progress-fill" style="width:0%"></div></div></div><strong>0%</strong>`;
  box.appendChild(div);
  closeModal();
  notify("Nueva meta creada ✓");
}

function learn(title){
  openModal(`<h2>${title}</h2><p style="line-height:1.7;color:#697386">Aquí podrás colocar una explicación corta, ejemplos y un pequeño ejercicio relacionado con este tema. Esta sección convierte la aplicación en una herramienta educativa, no solo en un registro de gastos.</p><button style="border:0;background:#16a765;color:#fff;border-radius:9px;padding:11px 18px;font-weight:700" onclick="closeModal()">Continuar</button>`);
}

document.getElementById("searchInput").addEventListener("input", e=>{
  const q=e.target.value.toLowerCase().trim();
  if(!q)return;
  const match=[...navItems].find(n=>n.textContent.toLowerCase().includes(q));
  if(match)showSection(match.dataset.section);
});

window.showSection=showSection;
window.openTransaction=openTransaction;
window.closeModal=closeModal;
window.simulate=simulate;
window.filterCards=filterCards;
window.addGoal=addGoal;
window.learn=learn;
window.notify=notify;
