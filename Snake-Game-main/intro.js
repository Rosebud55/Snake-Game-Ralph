let currentScroll = 100;
let duration = 99999;
let startTime = null;

function scrollup(timestamp) {
  document.getElementById("crawlText").style.top = "100%";
  if (!startTime) {
    startTime = timestamp;
  }
  const elapsedTime = timestamp - startTime;

  if (elapsedTime < duration) {
    // Check if the duration has elapsed
    currentScroll++;
    crawlText.style.transform = `translate(-50%, calc(-50% - ${currentScroll}px))`;

    setTimeout(scrollup);
  }
}
scrollup();

function loadGameScreen(event) {
  if (event.keyCode === 13) {
    window.location.href = "index.html";
  }
}
document.addEventListener("keydown", loadGameScreen);
