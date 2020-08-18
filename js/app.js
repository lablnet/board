// Progressive app
window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./pwa.js');
    }
}

window.addEventListener('load', () => {
    // Resizes the canvas once the window loads
    resize();
    // Restore image from the localStorage if exists.
    /*
     * We can restore it but it will be better if we provide option to restore or not!
     * As in PWA we have to show some content at any cost.
     */
    //restoreFromLocalStorage();

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
        else
            middleDraw(e.touches[0])
    });
});
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
}
const position = (e) => {
    // positions.
    coordinate.x = e.clientX;
    coordinate.y = e.clientY;
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
}
