// Progressive app
if (debug === false) {
    window.onload = () => {
        'use strict';

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('./pwa.js');
        }
    }
}
// Event handle on page load.
window.addEventListener('load', () => {
    // Resizes the canvas once the window loads
    resize();
    // Restore image from the localStorage if exists.
    /*
     * We can restore it but it will be better if we provide option to restore or not!
     * As in PWA we have to show some content at any cost.
     */
    //restoreFromLocalStorage();

    // On window resize handle.
    window.onresize = () => {
        saveToLocalStorage();
        resize();
        restoreFromLocalStorage();
    };

    // context menu
    const menu = document.querySelector(".menu");
    let menuVisible = false;
    const toggleMenu = (command) => {
        menu.style.display = command === "show" ? "block" : "none";
    };
    // hide menu on click
    window.addEventListener("click", e => {
        if (menuVisible) toggleMenu("hide");
        menuVisible = false;
    });
    // context menu handle
    window.addEventListener("contextmenu", e => {
        e.preventDefault();
        const origin = {
            left: e.clientX,
            top: e.clientY
        };
        setMenuPosition(origin);
        return false;
    });
    // get position for menu.
    const setMenuPosition =  ({ top, left }) => {
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        toggleMenu("show");
        menuVisible = true;
    };

    // handle mouse events.
    document.addEventListener('mousedown', startDraw);
    document.addEventListener('mouseup', endDraw);
    window.addEventListener("mousemove", (e) => {
        // Do not draw if menu is visible.
        if (!menuVisible) {
            // erase on shift key press.
            if (e.shiftKey)
                middleDraw(e, localStorage.getItem("bcolor"), parseInt(localStorage.getItem("font")) + 20);
            else
                middleDraw(e);
        }
    });
    // handle event for clear all.
    document.onkeydown =  (e) => {
        // clear on ctrl + x.
        if (e.ctrlKey && e.keyCode === 88) {
            localStorage.removeItem("board");
            resize();
        }
    };

    // handle touch events.
    document.addEventListener('touchstart', startDraw);
    document.addEventListener('touchend', endDraw);
    window.addEventListener("touchmove", (e) => {
        // Do not draw if menu is visible.
        if (!menuVisible) {
            // erase on double tap.
            if (e.touches.length === 2)
                middleDraw(e.touches[0], localStorage.getItem("bcolor"), parseInt(localStorage.getItem("font")) + 20);

            // Only allow to draw with one tap/finger
            if (e.touches.length === 1)
                middleDraw(e.touches[0]);

            // Open Menu upon three finger tap.
            if (e.touches.length === 3) {
                // get the menu position.
                const origin = {
                    left: e.touches[0].clientX,
                    top: e.touches[0].clientY
                };
                setMenuPosition(origin);
            }
            // On five finger remove all.
            if (e.touches.length === 5) {
                localStorage.removeItem("board");
                resize();
            }
        }
    });

});

/* Set default parameters. */
const refactor = () => {
    // If font not exists, make it default.
    if (!localStorage.getItem("font"))
        localStorage.setItem("font", 3);
    // If background color not exists make it default.
    if (!localStorage.getItem("bcolor"))
        localStorage.setItem("bcolor", "black");
    // If foreground/marker color not exists make it default.
    if (!localStorage.getItem("fcolor"))
        localStorage.setItem("fcolor", "white");
}
refactor();
/* Default variables. */
let coordinate = {x: 0, y: 0};
let draw = false;

// get board.
const board = document.getElementById("board");
// Change background color.
board.style.backgroundColor = localStorage.getItem("bcolor");

// get the modal and close btn.
const modal = document.getElementById("modal");
const close = document.getElementsByClassName("close")[0];

// close modal.
close.onclick = function() {
    modal.style.display = "none";
    document.getElementById("about").style.display = 'none';
    document.getElementById("help").style.display = 'none';
    document.getElementById("setting").style.display = 'none';

}
// Init canvas
const ctx = board.getContext("2d");
ctx.globalCompositeOperation = 'destination-over';

/* Export/Download canvas image. */
const downland = (withBg = false) => {
    const link = document.createElement('a');
    const locale = new Date().toLocaleString();
    const filename = `board${locale}.png`;
    link.download = filename;

    if (withBg) {
        ctx.globalCompositeOperation="destination-over";
        ctx.fillStyle = localStorage.getItem("bcolor");
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    link.href = board.toDataURL()
    link.click();
}
/* Menu handling. */
const menuItem = (e) => {
    let type = e.getAttribute("content");
    const title = document.getElementsByClassName("modal-heading")[0];
    const body = document.getElementsByClassName("modal-body")[0];

    const footer = document.getElementsByClassName("modal-footer")[0];

    // download menu
    if (type == 'download') {
        downland();
    }

    // download menu
    if (type == 'download-with-bg') {
        downland(true);
    }

    // about menu
    if (type == "about") {
        title.innerHTML = "About";
        modal.style.display = "block";
        document.getElementById("about").style.display = 'block';
        document.getElementById("version").innerHTML = version;
        modal.style.display = "block";
    }
    // help menu
    if (type == "help") {
        title.innerHTML = "Help";
        document.getElementById("help").style.display = 'block';
        modal.style.display = "block";
    }
    // settings menu
    if (type == "setting") {
        title.innerHTML = "Settings";
        document.getElementById("setting").style.display = 'block';
        // set font size value to default.
        document.getElementById("font").value = localStorage.getItem("font");
        // get elements.
        const f = document.getElementById("fcolor");
        const b = document.getElementById("bcolor");
        // reset to default.
        f.innerHTML = "";
        b.innerHTML = "";
        // loop through colors.
        for (let key of Object.keys(colors)) {
            // create required element.
            let opt = document.createElement('option');
            opt.value = colors[key];
            opt.innerHTML = key;
            // selected default or selected value.
            if (key == localStorage.getItem("bcolor"))
                opt.setAttribute("selected", true);
            b.appendChild(opt);
            // we need to recreate it, in order to append to both.
            opt = document.createElement('option');
            opt.value = colors[key];
            opt.innerHTML = key;
            // selected default or selected value.
            if (key == localStorage.getItem("fcolor"))
                opt.setAttribute("selected", true);
            f.appendChild(opt);
        }
        // get the button.
        const btn = document.getElementById("save");
        // open the modal.
        modal.style.display = "block";
        btn.onclick = (e) => {
            // get form values.
            const font = document.getElementById("font").value;
            const marker_color = f.options[f.selectedIndex].value;
            const background_color = b.options[b.selectedIndex].value;
            if (marker_color != background_color && font >= 1) {
                console.log(background_color);
                localStorage.setItem("bcolor", background_color);
                localStorage.setItem("fcolor", marker_color);
                localStorage.setItem("font", font);
                close.click();
                // Change background color.
                board.style.backgroundColor = localStorage.getItem('bcolor');
            } else {
                const error = "Wrong input are given";
                document.getElementById("error").innerText = error;
            }
        }
    }
}

/* Save to localStorage as image. */
const saveToLocalStorage = () => {
    // Get image base64 data.
    let canvasContents = board.toDataURL();
    // Make object of image data and time
    let data = {
        image: canvasContents,
        date: Date.now()
    };
    // Encode to json string
    let string = JSON.stringify(data);
    // Finally, store/update it.
    localStorage.setItem("board", string);
}

/* restore from localStorage as image. */
const restoreFromLocalStorage = () => {
    // If the image data exists.
    if (localStorage.getItem("board")) {
        // Get the image data, and decode it.
        let img = JSON.parse(localStorage.getItem("board"))['image'];
        var image = new Image();
        image.onload = function() {
            ctx.drawImage(image, 0, 0);
        };
        image.src = img;
    }
}

/* Resize. */
const resize = () => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    // If window is full screen
    if((window.fullScreen) ||
        (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        ctx.canvas.width = window.screen.width;
        ctx.canvas.height = window.screen.height;
    }

}

/* Get positions and store it to coordinate. */
const position = (e) => {
    // positions.
    coordinate.x = (e.clientX - board.offsetLeft);
    coordinate.y = (e.clientY - board.offsetTop);

}

/* Start the drawing. */
const startDraw = (e) => {
    draw = true;
    // update the position.
    position(e);
}

/* End the drawing. */
const endDraw = () => {
    draw = false;
}

/* drawing */
const middleDraw = (e, color = localStorage.getItem("fcolor"), width = localStorage.getItem("font")) => {
    // if stop drawing exit it.
    if (!draw) return;
    // resets the current path
    ctx.beginPath();
    // set width/size, get from local-storage.
    ctx.lineWidth = width;
    // Sets the end of the lines drawn round to look better.
    ctx.lineCap = 'round';
    // set the line color, get from local-storage.
    ctx.strokeStyle = color;

    /*
     * Default make the line solid.
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
     */
    ctx.setLineDash([]);

    // move the cursor accordingly the position of mouse or touch.
    ctx.moveTo(coordinate.x, coordinate.y);
    // update the position as we move around.
    position(e);
    // mark position of line
    ctx.lineTo(coordinate.x , coordinate.y);

    // Finally, draws the line.
    ctx.stroke();

    /*
    * Save it real time cause performance issue in some browser like in firefox.
    * So i think it will be better if we provide save button,
    * upon press we save it.
    */
    //saveToLocalStorage()
    return;
}
