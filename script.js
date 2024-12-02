let canvas = document.getElementById("canvas");
let currentElement = null;

let undoStack = [];
let redoStack = [];

function saveState() {
  undoStack.push(canvas.innerHTML);
  redoStack = [];
}

document.querySelector(".icon1").addEventListener("click", function () {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    canvas.innerHTML = undoStack[undoStack.length - 1];
    attachEventListeners();
  }
});

document.querySelector(".icon2").addEventListener("click", function () {
  if (redoStack.length > 0) {
    undoStack.push(redoStack.pop());
    canvas.innerHTML = undoStack[undoStack.length - 1];
    attachEventListeners();
  }
});

document.getElementById("add-text-btn").addEventListener("click", function () {
  let textElement = document.createElement("div");
  textElement.contentEditable = true;
  textElement.style.position = "absolute";
  textElement.style.fontSize = "20px";
  textElement.style.left = "50%";
  textElement.style.top = "50%";
  textElement.style.transform = "translate(-50%, -50%)";
  textElement.style.color = "black";
  textElement.textContent = "Type Here";
  textElement.className = "draggable";
  canvas.appendChild(textElement);
  currentElement = textElement;
  saveState();
  attachDragListeners(textElement);
});

document.getElementById("font-style").addEventListener("change", function () {
  if (currentElement) {
    currentElement.style.fontFamily = this.value;
    saveState();
  }
});

document
  .getElementById("font-size-btn")
  .addEventListener("click", function (event) {
    const target = event.target;
    const fontSizeElement = document.getElementById("font-size");
    let currentSize = parseInt(fontSizeElement.textContent);

    if (target.id === "decrease-font") {
      if (currentSize > 1) {
        fontSizeElement.textContent = currentSize - 1;
        if (currentElement) {
          currentElement.style.fontSize = currentSize - 1 + "px";
        }
      }
    } else if (target.id === "increase-font") {
      fontSizeElement.textContent = currentSize + 1;
      if (currentElement) {
        currentElement.style.fontSize = currentSize + 1 + "px";
      }
    }
  });

document.getElementById("bold-btn").addEventListener("click", function () {
  if (currentElement) {
    currentElement.style.fontWeight =
      currentElement.style.fontWeight === "bold" ? "normal" : "bold";
    saveState();
  }
});

document.getElementById("italic-btn").addEventListener("click", function () {
  if (currentElement) {
    currentElement.style.fontStyle =
      currentElement.style.fontStyle === "italic" ? "normal" : "italic";
    saveState();
  }
});

document.getElementById("underline-btn").addEventListener("click", function () {
  if (currentElement) {
    currentElement.style.textDecoration =
      currentElement.style.textDecoration === "underline"
        ? "none"
        : "underline";
    saveState();
  }
});

let alignStates = ["center-left", "center", "center-right"];
let currentAlignIndex = 0;

document.getElementById("align-btn").addEventListener("click", function () {
  if (currentElement) {
    currentAlignIndex = (currentAlignIndex + 1) % 3;
    let canvasWidth = canvas.offsetWidth;
    let elementWidth = currentElement.offsetWidth;

    switch (alignStates[currentAlignIndex]) {
      case "center-left":
        currentElement.style.left = "0";
        currentElement.style.transform = "translateX(0)";
        break;
      case "center":
        currentElement.style.left = "50%";
        currentElement.style.transform = "translateX(-50%)";
        break;
      case "center-right":
        currentElement.style.left = "100%";
        currentElement.style.transform = "translateX(-100%)";
        break;
    }
  }
});

function attachEventListeners() {
  document.querySelectorAll(".draggable").forEach(attachDragListeners);
}

function attachDragListeners(textElement) {
  let isDragging = false;
  textElement.addEventListener("mousedown", function (e) {
    let shiftX = e.clientX - textElement.getBoundingClientRect().left;
    let shiftY = e.clientY - textElement.getBoundingClientRect().top;
    isDragging = true;

    function moveAt(pageX, pageY) {
      let canvasRect = canvas.getBoundingClientRect();

      let newLeft = pageX - shiftX;
      let newTop = pageY - shiftY;

      if (newLeft < canvasRect.left) {
        newLeft = canvasRect.left;
      }
      if (newLeft + textElement.offsetWidth > canvasRect.right) {
        newLeft = canvasRect.right - textElement.offsetWidth;
      }

      if (newTop < canvasRect.top) {
        newTop = canvasRect.top;
      }
      if (newTop + textElement.offsetHeight > canvasRect.bottom) {
        newTop = canvasRect.bottom - textElement.offsetHeight;
      }

      textElement.style.left = newLeft - canvasRect.left + "px";
      textElement.style.top = newTop - canvasRect.top + "px";
    }

    function onMouseMove(event) {
      if (isDragging) moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    document.addEventListener(
      "mouseup",
      function () {
        if (isDragging) {
          isDragging = false;
          document.removeEventListener("mousemove", onMouseMove);
          saveState();
        }
      },
      { once: true }
    );
  });

  textElement.ondragstart = function () {
    return false;
  };
}

saveState();
