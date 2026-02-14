// Highlight active nav link
(function () {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();
// Button ripple effect
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function (e) {
    const circle = document.createElement("span");
    const diameter = Math.max(this.clientWidth, this.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - this.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - this.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = this.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    this.appendChild(circle);
  });
});
