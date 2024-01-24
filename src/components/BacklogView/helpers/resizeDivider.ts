export function resizeDivider() {
  const leftPanel: HTMLElement | null = document.querySelector(".left-panel");
  const rightPanel: HTMLElement | null = document.querySelector(".right-panel");
  const resizeHandle: HTMLElement | null =
    document.querySelector(".resize-handle");

  let isDragging = false;
  let currentX: number;
  let initialLeftWidth: number;
  let initialRightWidth: number;

  resizeHandle?.addEventListener("mousedown", (event) => {
    isDragging = true;
    currentX = event.clientX;
    initialLeftWidth = leftPanel!.offsetWidth;
    initialRightWidth = rightPanel!.offsetWidth;
  });

  document.addEventListener("mousemove", (event) => {
    if (!isDragging) {
      return;
    }

    const deltaX = event.clientX - currentX;
    const newLeftWidth = initialLeftWidth + deltaX;
    const newRightWidth = initialRightWidth - deltaX;

    leftPanel!.style.width = `${newLeftWidth}px`;
    rightPanel!.style.width = `${newRightWidth}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}
