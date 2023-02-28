export function openNav() {
  document.getElementById("sidebar").style.width = "19rem";
  document.getElementById("detail").style.marginLeft = "19rem";
  document.getElementById("openSidebar").style.display = "none";
}

export function closeNav() {
  document.getElementById("sidebar").style.width = "0";
  document.getElementById("detail").style.marginLeft= "0";
  document.getElementById("openSidebar").style.display = "flex";
}