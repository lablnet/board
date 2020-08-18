// Progressive app
window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./pwa.js');
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

    // handle mouse events.
    document.addEventListener('mousedown', startDraw);
    document.addEventListener('mouseup', endDraw);
    window.addEventListener("mousemove", (e) => {
        // erase on shift key press.
        if (e.shiftKey)
            middleDraw(e, "black", 50)
        else
            middleDraw(e)
    });

    // handle touch events.
    document.addEventListener('touchstart', startDraw);
    document.addEventListener('touchend', endDraw);
    window.addEventListener("touchmove", (e) => {
        // erase on double tap.
        if (e.touches.length === 2)
            middleDraw(e.touches[0], "black", 50)

        // Only allow to draw with one tap/finger
        if (e.touches.length === 1)
            middleDraw(e.touches[0])

        // Open Menu upon three finger tap.
        if (e.touches.length === 3) {
            // get the menu position.
            const origin = {
                left: e.touches[0].clientX,
                top: e.touches[0].clientY
            };
            setMenuPosition(origin);

        }
    });

    // context menu
    const menu = document.querySelector(".menu");
    let menuVisible = false;
    const toggleMenu = (command) => {
        menu.style.display = command === "show" ? "block" : "none";
    };
    window.addEventListener("click", e => {
        if (menuVisible) toggleMenu("hide");
        menuVisible = false;
    });
    window.addEventListener("contextmenu", e => {
        e.preventDefault();
        const origin = {
            left: e.clientX,
            top: e.clientY
        };
        setMenuPosition(origin);
        return false;
    });
    const setMenuPosition =  ({ top, left }) => {
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        toggleMenu("show");
        menuVisible = true;
    };
});
const menuItem = (e) => {
    let type = e.getAttribute("content");
}
document.onkeydown = function (e) {
    // clear on ctrl + x.
    if (e.ctrlKey && e.which === 88) {
        localStorage.removeItem("board");
        resize()
    }
};
let coordinate = {x: 0, y: 0};
let draw = false;
const board = document.getElementById("board");
const ctx = board.getContext("2d", { alpha: false });

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
const position = (e) => {
    // positions.
    coordinate.x = (e.clientX - board.offsetLeft);
    coordinate.y = (e.clientY - board.offsetTop);

}
const startDraw = (e) => {
    draw = true;
    // update the position.
    position(e);
}
const endDraw = () => {
    draw = false;
}
const middleDraw = (e, color = "white", width = 3) => {
    // if stop drawing exit it.
    if (!draw) return;
    // resets the current path
    ctx.beginPath();
    // set width/size.
    ctx.lineWidth = width;
    // Sets the end of the lines drawn round to look better.
    ctx.lineCap = 'round';
    // set the line color.
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
