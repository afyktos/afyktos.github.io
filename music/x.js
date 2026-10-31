const menuButton=document.querySelector(".menu-toggle");const nav=document.querySelector("#main-nav");if(menuButton && nav){menuButton.addEventListener("click",()=>{const isOpen=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(isOpen));});}const flipCard=document.querySelector(".flip-card");if(flipCard){flipCard.addEventListener("click",()=>{flipCard.classList.toggle("is-flipped");});}document.addEventListener("contextmenu",function(e){if(e.target.closest("img,.protect-media,.flip-card,.work-card,.project-image,.cover,.artwork-card"))e.preventDefault();});document.addEventListener("dragstart",function(e){if(e.target.matches("img")||e.target.closest(".protect-media,.flip-card,.work-card,.project-image,.cover,.artwork-card"))e.preventDefault();});document.addEventListener("selectstart",function(e){if(e.target.matches("img"))e.preventDefault();});document.querySelectorAll("img").forEach(function(i){i.setAttribute("draggable","false");i.setAttribute("oncontextmenu","return false");});(function(){
  "use strict";
  var active=null;
  function embed(id,title){var f=document.createElement("iframe");f.src="https://www.youtube-nocookie.com/embed/"+id+"?autoplay=1&rel=0&modestbranding=1&playsinline=1";f.title=title||"YouTube video";f.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";f.referrerPolicy="strict-origin-when-cross-origin";f.allowFullscreen=true;return f;}
  function facade(box){return '<img alt="" decoding="async" src="https://i.ytimg.com/vi/'+box.dataset.yt+'/hqdefault.jpg"/><button class="pc-play" type="button" aria-label="Play '+(box.dataset.title||"").replace(/"/g,"&quot;")+'"><span>▶ PLAY</span></button>';}
  document.addEventListener("click",function(e){
    var b=e.target.closest(".pc-play"); if(!b) return;
    var box=b.closest(".pc-video");
    if(active&&active!==box){active.innerHTML=facade(active);}
    if(frame && frame.getAttribute("src")){frame.dataset.resume=frame.src;frame.removeAttribute("src");} box.replaceChildren(embed(box.dataset.yt,box.dataset.title)); active=box;
  });
  /* DIGI SCALE tracklist switches the album player */
  var frame=document.querySelector(".player-frame iframe"),now=document.querySelector(".dg-now"),yt=document.querySelector(".player-fallback");
  document.querySelectorAll(".dg-track").forEach(function(t,i){
    t.addEventListener("click",function(){
      document.querySelectorAll(".dg-track[aria-current]").forEach(function(x){x.removeAttribute("aria-current");});
      t.setAttribute("aria-current","true");
      if(active){active.innerHTML=facade(active);active=null;}
      if(frame) frame.title="DIGI SCALE — "+t.querySelector("strong").textContent; if(frame) frame.src="https://www.youtube-nocookie.com/embed/"+t.dataset.yt+"?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      if(now) now.textContent=String(i+1).padStart(2,"0")+" / "+t.querySelector("strong").textContent.toUpperCase();
      if(yt) yt.href="https://www.youtube.com/watch?v="+t.dataset.yt;
    });
  });
  /* close the mobile menu after choosing a section */
  var nav=document.querySelector("#main-nav"),btn=document.querySelector(".menu-toggle");
  if(nav&&btn) nav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){nav.classList.remove("open");btn.setAttribute("aria-expanded","false");});});
})();
