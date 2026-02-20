(()=>{function j(t){if(!t||typeof t!="string")return t;let e=t.trim();if(!e||/^(https?:)?\/\//i.test(e)||/^data:/i.test(e)||/^blob:/i.test(e))return e;let n="http://localhost:8080";return e.startsWith("/api/")?`${n}${e}`:e.startsWith("api/")?`${n}/${e}`:e}window.resolveAssetUrl=j;window.toastConfig={default:{maxMessageLength:160,showDelayMs:50,durationMs:2800,removeDelayMs:2800},admin:{maxMessageLength:160,showDelayMs:50,durationMs:2800,removeDelayMs:2800,top:"16px",right:"16px",maxWidth:"320px",padding:"10px 14px",borderRadius:"8px",fontSize:"14px",lineHeight:"1.35"}};function U(t){let e=t?window.toastConfig.admin:window.toastConfig.default,n=window.toastOverrides&&typeof window.toastOverrides=="object"?window.toastOverrides:{};return{...e,...n}}var I="3";window.showToast=function(e,n="success"){let a=window.location.pathname.includes("/other/admin"),o=U(a),s=String(e??"").replace(/\s+/g," ").trim().slice(0,o.maxMessageLength),r=document.createElement("div");r.className=`toast-notification ${n}`,r.textContent=s||"\u0413\u043E\u0442\u043E\u0432\u043E",a&&(r.classList.add("fw-admin-toast"),r.style.position="fixed",r.style.top=o.top,r.style.right=o.right,r.style.bottom="auto",r.style.left="auto",r.style.zIndex="10000",r.style.display="inline-block",r.style.height="auto",r.style.minHeight="0",r.style.maxHeight="none",r.style.maxWidth=o.maxWidth,r.style.width="auto",r.style.padding=o.padding,r.style.borderRadius=o.borderRadius,r.style.boxSizing="border-box",r.style.boxShadow="0 6px 18px rgba(0, 0, 0, 0.2)",r.style.color="#fff",r.style.fontWeight="500",r.style.fontSize=o.fontSize,r.style.lineHeight=o.lineHeight,r.style.whiteSpace="normal",r.style.overflowWrap="anywhere",r.style.wordBreak="break-word",r.style.opacity="0",r.style.transform="translateX(120%)",r.style.transition="opacity 0.25s ease, transform 0.25s ease"),document.body.appendChild(r),setTimeout(()=>{a?(r.style.opacity="1",r.style.transform="translateX(0)"):r.classList.add("show")},o.showDelayMs),setTimeout(()=>{a?(r.style.opacity="0",r.style.transform="translateX(120%)"):r.classList.remove("show"),setTimeout(()=>r.remove(),o.removeDelayMs)},o.durationMs)};document.addEventListener("DOMContentLoaded",()=>{document.body.classList.add("content-loaded");let t=document.getElementById("header-placeholder"),e=document.getElementById("footer-placeholder"),n=window.location.pathname.includes("/other/"),a="../",o=`fw_header_${I}`,s=`fw_footer_${I}`,r=sessionStorage.getItem(o),i=sessionStorage.getItem(s);r&&i&&(t.innerHTML=r,e.innerHTML=i),Promise.all([r?Promise.resolve(r):fetch(`${a}includes/header.html?v=${I}`).then(c=>c.text()),i?Promise.resolve(i):fetch(`${a}includes/footer.html?v=${I}`).then(c=>c.text())]).then(([c,m])=>{r||sessionStorage.setItem(o,c),i||sessionStorage.setItem(s,m),t.innerHTML=c,e.innerHTML=m;let u=document.getElementById("copyright-year");u&&(u.textContent=String(new Date().getFullYear())),q(),window.refreshCartState&&window.refreshCartState();let g=document.getElementById("hamburger"),y=document.getElementById("mobile-menu");g&&y&&g.addEventListener("click",()=>{y.classList.toggle("active")});let f=document.querySelector(".scroll-top");f&&(window.addEventListener("scroll",()=>{f.classList.toggle("visible",window.scrollY>400)}),f.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"})));let w=document.getElementById("auth-btn"),d=document.getElementById("user-sidebar"),v=document.getElementById("close-user-sidebar"),p=document.getElementById("user-logout");w&&d&&w.addEventListener("click",()=>{localStorage.getItem("isLoggedIn")==="true"?d.classList.add("active"):window.location.href="../other/login.html"}),v&&d&&v.addEventListener("click",()=>{d.classList.remove("active")}),p&&p.addEventListener("click",b=>{b.preventDefault(),confirm("\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430?")&&(localStorage.removeItem("isLoggedIn"),localStorage.removeItem("jwtToken"),localStorage.removeItem("userName"),localStorage.removeItem("userRole"),window.location.href="../pages/index.html")})}).catch(c=>console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 header/footer:",c))});document.addEventListener("click",async t=>{let e=t.target.closest(".add-to-cart");if(!e)return;let n=e.dataset.id;!n||!window.toggleCartItem||(t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),await window.toggleCartItem(n,1))},!0);function q(){let t=localStorage.getItem("isLoggedIn")==="true",e=localStorage.getItem("userName")||"\u0413\u043E\u0441\u0442\u044C",n=localStorage.getItem("userRole")||"USER",a=document.getElementById("auth-text"),o=document.getElementById("user-display-name"),s=document.getElementById("user-avatar");a&&(a.textContent=t?e:"\u0412\u043E\u0439\u0442\u0438"),o&&(o.textContent=e);let r=document.getElementById("admin-panel-menu-item"),i=document.getElementById("desktop-admin-link"),c=document.getElementById("mobile-admin-menu-item"),m=t&&n==="ADMIN";r&&(r.style.display=m?"":"none"),i&&(i.style.display=m?"":"none"),c&&(c.style.display=m?"":"none"),s&&(n==="ADMIN"?s.src="https://randomuser.me/api/portraits/men/1.jpg":s.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(e)}&background=e83e8c&color=fff`)}function h(t,e){if(!t)return;let n=t.dataset.originalText||t.textContent.trim()||"\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0443";t.dataset.originalText||(t.dataset.originalText=n),e?(t.textContent="\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0435",t.classList.add("in-cart")):(t.textContent=t.dataset.originalText||"\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0443",t.classList.remove("in-cart"))}function k(t,e){if(!t)return;let n=String(t);document.querySelectorAll(`.add-to-cart[data-id="${n}"]`).forEach(o=>{h(o,e)});let a=document.getElementById("add-to-cart-btn");a&&String(a.dataset.id)===n&&h(a,e)}function x(t){let e=document.getElementById("cart-count-sidebar");e&&(e.textContent=String(t??0))}window.applyCartState=function(e){if(!e){x(0),document.querySelectorAll(".add-to-cart").forEach(i=>h(i,!1));let r=document.getElementById("add-to-cart-btn");r&&h(r,!1);return}if(typeof e!="object"||(window.__lastCartState=e,e.totalItems!==void 0&&x(e.totalItems||0),!Array.isArray(e.items)))return;let n=e.items,a=new Set(n.map(r=>String(r.productId??""))),o=new Map(n.map(r=>[String(r.productId??""),String(r.id??"")]));window.__cartItemByProductId=o,document.querySelectorAll(".add-to-cart").forEach(r=>{let i=r.dataset.id;i&&h(r,a.has(String(i)))});let s=document.getElementById("add-to-cart-btn");s&&s.dataset.id&&h(s,a.has(String(s.dataset.id)))};window.toggleCartItem=async function(e,n=1){if(!e)return;if(!(typeof window.isLoggedIn=="function"?window.isLoggedIn():localStorage.getItem("isLoggedIn")==="true")){showToast("\u0412\u043E\u0439\u0434\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443","error"),window.location.href="../other/login.html";return}let s=(window.__cartItemByProductId||new Map).get(String(e));try{let r=null;s?(r=await window.api.removeFromCart(s),showToast("\u0422\u043E\u0432\u0430\u0440 \u0443\u0434\u0430\u043B\u0451\u043D \u0438\u0437 \u043A\u043E\u0440\u0437\u0438\u043D\u044B","info"),k(e,!1)):(r=await window.api.addToCart(e,n),showToast("\u0422\u043E\u0432\u0430\u0440 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443","success"),k(e,!0)),r&&window.applyCartState&&window.applyCartState(r),window.refreshCartState&&window.refreshCartState()}catch(r){showToast(r.message||"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043A\u043E\u0440\u0437\u0438\u043D\u0443","error")}};window.refreshCartState=async function(){if(!(typeof window.isLoggedIn=="function"?window.isLoggedIn():localStorage.getItem("isLoggedIn")==="true")){window.applyCartState(null);return}try{if(window.api&&typeof window.api.getCart=="function"){let a=await window.api.getCart();a&&typeof a=="object"&&window.applyCartState(a);return}let n=await fetch("http://localhost:8080/api/cart",{headers:{Authorization:`Bearer ${localStorage.getItem("jwtToken")}`}});if(n.ok){let a=await n.json();a&&typeof a=="object"&&window.applyCartState(a)}else window.applyCartState(null)}catch(n){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043A\u043E\u0440\u0437\u0438\u043D\u044B:",n),window.applyCartState(null)}};(function(){let e=window.location.hostname;if(!(e==="localhost"||e==="127.0.0.1")||document.querySelector("script[data-livereload]"))return;let a=document.createElement("script");a.src=`http://${e}:35729/livereload.js?snipver=1`,a.async=!0,a.setAttribute("data-livereload","true"),document.body.appendChild(a)})();var z="http://localhost:8080/api";function W(){return localStorage.getItem("userRole")==="ADMIN"&&localStorage.getItem("isLoggedIn")==="true"}function _(){return localStorage.getItem("jwtToken")}async function l(t,e={}){let n=_(),a={"Content-Type":"application/json",...n&&{Authorization:`Bearer ${n}`}},o=await fetch(`${z}${t}`,{...e,headers:{...a,...e.headers}});if(o.status===401||o.status===403)throw localStorage.removeItem("isLoggedIn"),localStorage.removeItem("jwtToken"),localStorage.removeItem("userRole"),window.location.href="../other/login.html",new Error("\u041D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u0430 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430");if(!o.ok){let r=await o.text().catch(()=>"\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430"),i=F(r,o.status);throw new Error(i||o.statusText)}if(o.status===204)return null;let s=await o.text();if(!s)return null;try{return JSON.parse(s)}catch{return s}}function F(t,e){let n=String(t||"").trim();return n?n.startsWith("<!DOCTYPE")||n.startsWith("<html")?`\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 (${e})`:n.length>220?`${n.slice(0,220)}...`:n:`\u041E\u0448\u0438\u0431\u043A\u0430 (${e})`}async function T(){try{let t=await l("/admin/dashboard");G(t)}catch(t){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u0430\u0448\u0431\u043E\u0440\u0434\u0430:",t);let e=document.getElementById("dashboard-stats");e&&(e.innerHTML=`<p class="error">\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: ${t.message}</p>`)}}function G(t){document.getElementById("stat-products").textContent=t.totalProducts||0,document.getElementById("stat-orders").textContent=t.totalOrders||0,document.getElementById("stat-users").textContent=t.totalUsers||0,document.getElementById("stat-revenue").textContent=`${(t.totalRevenue||0).toLocaleString()} \u20BD`;let e=document.getElementById("orders-by-status");e&&t.ordersByStatus&&(e.innerHTML=`
            <h3>\u0417\u0430\u043A\u0430\u0437\u044B \u043F\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0430\u043C</h3>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>\u0421\u0442\u0430\u0442\u0443\u0441</th>
                        <th>\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E</th>
                    </tr>
                </thead>
                <tbody>
                    ${t.ordersByStatus.map(a=>`
                        <tr>
                            <td>${H(a.status)}</td>
                            <td>${a.count}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `);let n=document.getElementById("popular-products");n&&t.popularProducts&&(n.innerHTML=`
            <h3>\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0442\u043E\u0432\u0430\u0440\u044B</h3>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>\u0422\u043E\u0432\u0430\u0440</th>
                        <th>\u041F\u0440\u043E\u0434\u0430\u0436</th>
                    </tr>
                </thead>
                <tbody>
                    ${t.popularProducts.map(a=>`
                        <tr>
                            <td>${a.name}</td>
                            <td>${a.orderCount}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `)}function H(t){return{PENDING:"\u041E\u0436\u0438\u0434\u0430\u0435\u0442",CONFIRMED:"\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0451\u043D",PROCESSING:"\u0412 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435",SHIPPED:"\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D",DELIVERED:"\u0414\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D",CANCELLED:"\u041E\u0442\u043C\u0435\u043D\u0451\u043D",NEW:"\u041D\u043E\u0432\u044B\u0439",COMPLETED:"\u0417\u0430\u0432\u0435\u0440\u0448\u0451\u043D"}[t]||t}async function B(){try{let t=await l("/admin/products");J(t)}catch(t){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0442\u043E\u0432\u0430\u0440\u043E\u0432:",t);let e=document.getElementById("admin-products-table");e&&(e.innerHTML=`<p class="error">\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: ${t.message}</p>`)}}async function J(t){let e=document.getElementById("admin-products-table");if(e){if(!t||t.length===0){e.innerHTML="<p>\u0422\u043E\u0432\u0430\u0440\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B</p>";return}e.innerHTML=`
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</th>
                    <th>\u0426\u0435\u043D\u0430</th>
                    <th>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F</th>
                    <th>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</th>
                </tr>
            </thead>
            <tbody>
                ${t.map(n=>`
                    <tr>
                        <td>${n.id}</td>
                        <td>${n.name}</td>
                        <td>${n.price.toLocaleString()} \u20BD</td>
                        <td>${n.category?.name||"\u0411\u0435\u0437 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438"}</td>
                        <td>
                            <button class="btn-small" onclick="editProduct(${n.id})">\u270F\uFE0F</button>
                            <button class="btn-small btn-danger" onclick="deleteProduct(${n.id})">\u{1F5D1}\uFE0F</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `}}async function V(t){if(confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u0442\u043E\u0432\u0430\u0440?"))try{await l(`/admin/products/${t}`,{method:"DELETE"}),showToast("\u0422\u043E\u0432\u0430\u0440 \u0443\u0434\u0430\u043B\u0451\u043D","success"),B(),P(),T()}catch(e){showToast(e.message,"error")}}window.editProduct=function(t){window.location.href=`../other/admin-product-edit.html?id=${t}`};window.deleteProduct=V;window.createNewProduct=function(){window.location.href="../other/admin-product-edit.html"};var E=[];function C(){let t=document.getElementById("category-id"),e=document.getElementById("category-name"),n=document.getElementById("category-description"),a=document.getElementById("category-image-path"),o=document.getElementById("category-sort-order"),s=document.getElementById("category-is-active");!t||!e||!n||!a||!o||!s||(t.value="",e.value="",n.value="",a.value="",o.value="0",s.checked=!0)}async function $(){try{let t=await l("/admin/categories");E=Array.isArray(t)?t:[],X(E)}catch(t){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0439:",t);let e=document.getElementById("admin-categories-table");e&&(e.innerHTML=`<p class="error">\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: ${t.message}</p>`)}}function X(t){let e=document.getElementById("admin-categories-table");if(e){if(!t.length){e.innerHTML="<p>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B</p>";return}e.innerHTML=`
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</th>
                    <th>Slug</th>
                    <th>\u041F\u043E\u0440\u044F\u0434\u043E\u043A</th>
                    <th>\u0410\u043A\u0442\u0438\u0432\u043D\u0430</th>
                    <th>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</th>
                </tr>
            </thead>
            <tbody>
                ${t.map(n=>`
                    <tr>
                        <td>${n.id}</td>
                        <td>${n.name||"-"}</td>
                        <td>${n.slug||"-"}</td>
                        <td>${n.sortOrder??0}</td>
                        <td>${n.isActive===!1?"\u041D\u0435\u0442":"\u0414\u0430"}</td>
                        <td>
                            <button class="btn-small" onclick="editCategory(${n.id})">\u270F\uFE0F</button>
                            <button class="btn-small btn-danger" onclick="deleteCategory(${n.id})">\u{1F5D1}\uFE0F</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `}}async function Y(t){t.preventDefault();let e=document.getElementById("category-id").value,n=document.getElementById("category-sort-order").value,a=Number(n),o={name:document.getElementById("category-name").value.trim(),description:document.getElementById("category-description").value.trim(),imagePath:document.getElementById("category-image-path").value.trim()||null,sortOrder:Number.isFinite(a)?a:0,isActive:document.getElementById("category-is-active").checked};if(!o.name){showToast("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438","error");return}try{e?(await l(`/admin/categories/${e}`,{method:"PUT",body:JSON.stringify(o)}),showToast("\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430","success")):(await l("/admin/categories",{method:"POST",body:JSON.stringify(o)}),showToast("\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u0441\u043E\u0437\u0434\u0430\u043D\u0430","success")),C(),$()}catch(s){showToast(s.message,"error")}}async function K(t){try{E.length||await $();let e=E.find(n=>String(n.id)===String(t));if(!e){showToast("\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430","error");return}document.getElementById("category-id").value=e.id,document.getElementById("category-name").value=e.name||"",document.getElementById("category-description").value=e.description||"",document.getElementById("category-image-path").value=e.imagePath||"",document.getElementById("category-sort-order").value=e.sortOrder??0,document.getElementById("category-is-active").checked=e.isActive!==!1}catch(e){showToast(e.message,"error")}}async function Q(t){if(confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E?"))try{await l(`/admin/categories/${t}`,{method:"DELETE"}),showToast("\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F \u0443\u0434\u0430\u043B\u0435\u043D\u0430","success"),C(),$()}catch(e){showToast(e.message,"error")}}window.editCategory=K;window.deleteCategory=Q;async function P(){try{let t=await l("/admin/products/archive");Z(t)}catch(t){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0430\u0440\u0445\u0438\u0432\u0430 \u0442\u043E\u0432\u0430\u0440\u043E\u0432:",t);let e=document.getElementById("archived-products-table");e&&(e.innerHTML=`<p class="error">\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: ${t.message}</p>`)}}function Z(t){let e=document.getElementById("archived-products-table");if(e){if(!t||t.length===0){e.innerHTML="<p>\u0410\u0440\u0445\u0438\u0432 \u043F\u0443\u0441\u0442</p>";return}e.innerHTML=`
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</th>
                    <th>\u0426\u0435\u043D\u0430</th>
                    <th>\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F</th>
                    <th>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</th>
                </tr>
            </thead>
            <tbody>
                ${t.map(n=>`
                    <tr>
                        <td>${n.id}</td>
                        <td>${n.name}</td>
                        <td>${n.price.toLocaleString()} \u20BD</td>
                        <td>${n.category?.name||"\u0411\u0435\u0437 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438"}</td>
                        <td>
                            <button class="btn-small" onclick="restoreProduct(${n.id})">\u0412\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `}}async function tt(t){try{await l(`/admin/products/${t}/restore`,{method:"POST"}),showToast("\u0422\u043E\u0432\u0430\u0440 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D","success"),P(),B(),T()}catch(e){showToast(e.message,"error")}}window.restoreProduct=tt;async function R(t=0,e=10){try{let n=await l(`/admin/orders?page=${t}&size=${e}`);et(n)}catch(n){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0437\u0430\u043A\u0430\u0437\u043E\u0432:",n);let a=document.getElementById("admin-orders-table");a&&(a.innerHTML=`<p class="error">\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: ${n.message}</p>`)}}async function et(t){let e=document.getElementById("admin-orders-table"),n=document.getElementById("orders-pagination");if(!e)return;let a=t.content||[];if(a.length===0){e.innerHTML="<p>\u0417\u0430\u043A\u0430\u0437\u043E\u0432 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</p>",n&&(n.innerHTML="");return}e.innerHTML=`
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>\u2116 \u0437\u0430\u043A\u0430\u0437\u0430</th>
                    <th>\u041A\u043B\u0438\u0435\u043D\u0442</th>
                    <th>\u0421\u0443\u043C\u043C\u0430</th>
                    <th>\u0421\u0442\u0430\u0442\u0443\u0441</th>
                    <th>\u0414\u0430\u0442\u0430</th>
                    <th>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</th>
                </tr>
            </thead>
            <tbody>
                ${a.map(o=>`
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.orderNumber||"#"+o.id}</td>
                        <td>${o.customerName||o.user?.name||"\u0413\u043E\u0441\u0442\u044C"}</td>
                        <td>${o.totalAmount?.toLocaleString()||0} \u20BD</td>
                        <td>
                            <select onchange="updateOrderStatus(${o.id}, this.value)">
                                ${nt(o.status)}
                            </select>
                        </td>
                        <td>${N(o.createdAt)}</td>
                        <td>
                            <button class="btn-small" onclick="viewOrder(${o.id})">\u{1F441}\uFE0F</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `,n&&(n.innerHTML=`
            <div class="pagination">
                <button ${t.first?"disabled":""} onclick="loadOrdersPage(${t.number-1})">\u2190 \u041D\u0430\u0437\u0430\u0434</button>
                <span>\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 ${t.number+1} \u0438\u0437 ${t.totalPages}</span>
                <button ${t.last?"disabled":""} onclick="loadOrdersPage(${t.number+1})">\u0412\u043F\u0435\u0440\u0451\u0434 \u2192</button>
            </div>
        `)}function nt(t){return["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"].map(n=>`<option value="${n}" ${n===t?"selected":""}>${H(n)}</option>`).join("")}function N(t){return t?new Date(t).toLocaleDateString("ru-RU",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}):"-"}window.viewOrder=function(t){window.location.href=`../other/admin-order-detail.html?id=${t}`};window.loadOrdersPage=function(t){R(t,10)};async function D(t=0,e=10){try{let n=await l(`/admin/users?page=${t}&size=${e}`);ot(n)}catch(n){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439:",n);let a=document.getElementById("admin-users-table");a&&(a.innerHTML=`<p class="error">\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: ${n.message}</p>`)}}async function ot(t){let e=document.getElementById("admin-users-table"),n=document.getElementById("users-pagination");if(!e)return;let a=t.content||[];if(a.length===0){e.innerHTML="<p>\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</p>",n&&(n.innerHTML="");return}e.innerHTML=`
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>\u0418\u043C\u044F</th>
                    <th>Email</th>
                    <th>\u0422\u0435\u043B\u0435\u0444\u043E\u043D</th>
                    <th>\u0420\u043E\u043B\u044C</th>
                    <th>\u0421\u0442\u0430\u0442\u0443\u0441</th>
                    <th>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</th>
                </tr>
            </thead>
            <tbody>
                ${a.map(o=>`
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.name}</td>
                        <td>${o.email}</td>
                        <td>${o.phone}</td>
                        <td>${o.role||"USER"}</td>
                        <td>
                            <span style="color: ${o.isActive?"#27ae60":"#e74c3c"}">
                                ${o.isActive?"\u0410\u043A\u0442\u0438\u0432\u0435\u043D":"\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D"}
                            </span>
                        </td>
                        <td>
                            <button class="btn-small" onclick="toggleUserStatus(${o.id}, ${!o.isActive})">
                                ${o.isActive?"\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C":"\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C"}
                            </button>
                            <button class="btn-small btn-danger" onclick="deleteUser(${o.id})">\u{1F5D1}\uFE0F</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `,n&&(n.innerHTML=`
            <div class="pagination">
                <button ${t.first?"disabled":""} onclick="loadUsersPage(${t.number-1})">\u2190 \u041D\u0430\u0437\u0430\u0434</button>
                <span>\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 ${t.number+1} \u0438\u0437 ${t.totalPages}</span>
                <button ${t.last?"disabled":""} onclick="loadUsersPage(${t.number+1})">\u0412\u043F\u0435\u0440\u0451\u0434 \u2192</button>
            </div>
        `)}window.loadUsersPage=function(t){D(t,10)};async function L(t=0,e=10){try{let n=await l(`/admin/reviews/pending?page=${t}&size=${e}`);rt(n)}catch(n){console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043E\u0442\u0437\u044B\u0432\u043E\u0432:",n);let a=document.getElementById("admin-reviews-table");a&&(a.innerHTML=`<p class="error">\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: ${n.message}</p>`)}}function rt(t){let e=document.getElementById("admin-reviews-table"),n=document.getElementById("reviews-pagination");if(!e)return;let a=t?.content||[];if(a.length===0){e.innerHTML="<p>\u041E\u0442\u0437\u044B\u0432\u043E\u0432 \u043D\u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u0438 \u043D\u0435\u0442</p>",n&&(n.innerHTML="");return}e.innerHTML=`
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>\u0410\u0432\u0442\u043E\u0440</th>
                    <th>\u0422\u043E\u0432\u0430\u0440</th>
                    <th>\u041E\u0446\u0435\u043D\u043A\u0430</th>
                    <th>\u0422\u0435\u043A\u0441\u0442</th>
                    <th>\u0414\u0430\u0442\u0430</th>
                    <th>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</th>
                </tr>
            </thead>
            <tbody>
                ${a.map(o=>`
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.authorName||"\u0410\u043D\u043E\u043D\u0438\u043C"}</td>
                        <td>${o.product?.name||"\u0422\u043E\u0432\u0430\u0440 \u0443\u0434\u0430\u043B\u0435\u043D"}</td>
                        <td>${o.rating||0}/5</td>
                        <td style="max-width: 320px; white-space: normal;">${o.text||""}</td>
                        <td>${N(o.createdAt)}</td>
                        <td>
                            <button class="btn-small" onclick="approveReview(${o.id})">\u041E\u0434\u043E\u0431\u0440\u0438\u0442\u044C</button>
                            <button class="btn-small btn-danger" onclick="rejectReview(${o.id})">\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `,n&&(n.innerHTML=`
            <div class="pagination">
                <button ${t.first?"disabled":""} onclick="loadReviewsPage(${t.number-1})">\u2190 \u041D\u0430\u0437\u0430\u0434</button>
                <span>\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 ${t.number+1} \u0438\u0437 ${t.totalPages}</span>
                <button ${t.last?"disabled":""} onclick="loadReviewsPage(${t.number+1})">\u0412\u043F\u0435\u0440\u0451\u0434 \u2192</button>
            </div>
        `)}async function at(t){try{await l(`/admin/reviews/${t}/approve`,{method:"POST"}),showToast("\u041E\u0442\u0437\u044B\u0432 \u043E\u0434\u043E\u0431\u0440\u0435\u043D","success"),L()}catch(e){showToast(e.message,"error")}}async function st(t){if(confirm("\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u043E\u0442\u0437\u044B\u0432?"))try{await l(`/admin/reviews/${t}/reject`,{method:"POST"}),showToast("\u041E\u0442\u0437\u044B\u0432 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D","info"),L()}catch(e){showToast(e.message,"error")}}window.approveReview=at;window.rejectReview=st;window.loadReviewsPage=function(t){L(t,10)};document.addEventListener("DOMContentLoaded",()=>{if(!W()){window.location.href="../other/login.html";return}let t=document.getElementById("logout-btn");t&&t.addEventListener("click",d=>{d.preventDefault(),localStorage.removeItem("isLoggedIn"),localStorage.removeItem("jwtToken"),localStorage.removeItem("userRole"),localStorage.removeItem("userName"),window.location.href="../other/login.html"});let e=document.getElementById("category-form");e&&e.addEventListener("submit",Y);let n=document.getElementById("category-cancel-btn");n&&n.addEventListener("click",C);let a=document.querySelectorAll(".admin-nav a:not(#logout-btn)"),o=document.querySelectorAll(".admin-section"),s=document.getElementById("admin-overlay");a.forEach(d=>{d.addEventListener("click",v=>{let p=d.getAttribute("href")||"";if(!p.startsWith("#"))return;v.preventDefault();let b=p.substring(1);a.forEach(S=>S.classList.remove("active")),d.classList.add("active"),o.forEach(S=>S.classList.remove("active"));let A=document.getElementById(b);A&&(A.classList.add("active"),O(b));let M=document.querySelector(".admin-sidebar");window.innerWidth<=768&&M&&(M.classList.remove("active"),s&&s.classList.remove("active"),document.body.classList.remove("menu-open"))})});let r=document.querySelector(".admin-header .hamburger"),i=document.querySelector(".admin-sidebar");r&&i&&r.addEventListener("click",()=>{i.classList.toggle("active"),s&&s.classList.toggle("active",i.classList.contains("active")),document.body.classList.toggle("menu-open",i.classList.contains("active"))}),s&&i&&s.addEventListener("click",()=>{i.classList.remove("active"),s.classList.remove("active"),document.body.classList.remove("menu-open")});let c=window.location.hash?window.location.hash.substring(1):"dashboard",u=new Set(["dashboard","products","orders","users","archive","categories","reviews"]).has(c)?c:"dashboard";a.forEach(d=>d.classList.remove("active"));let g=Array.from(a).find(d=>d.getAttribute("href")===`#${u}`||d.getAttribute("href")===`admin.html#${u}`);g&&g.classList.add("active"),o.forEach(d=>d.classList.remove("active"));let y=document.getElementById(u);y&&y.classList.add("active"),O(u);let f=localStorage.getItem("userName")||"\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440",w=document.querySelector("#dashboard h2");w&&(w.textContent=`\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C, ${f}`)});function O(t){switch(t){case"dashboard":T();break;case"products":B();break;case"orders":R();break;case"users":D();break;case"archive":P();break;case"categories":$();break;case"reviews":L();break}}})();
