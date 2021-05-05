let flags = [];
let count = 0;

function start() {
    let canvas = document.querySelector("#canvas");
    let root = document.getElementById('root')
    circal1(0, canvas.width, 20, root)


}

function makeButton(x, y) {
    let canvas = document.querySelector("#canvas");
    let ctx = canvas.getContext("2d")
    const path = new Path2D()
    path.rect(x, y, 20, 20)
    ctx.fillStyle = "red"
    ctx.fill(path)
    ctx.stroke(path)
    return path



}

function getXY(canvas, event) { //shape
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top //mouse event
    const x = event.clientX - rect.left
    return {x: x, y: y}
}

function circal1(xstart, xend, y, dom) {
    flags[count]=false
    let ttemp = count

    let canvas = document.querySelector("#canvas")
    let ctx = canvas.getContext("2d")

    ctx.beginPath()
    ctx.arc((xstart + xend) / 2, y + 80, 30, 0, Math.PI * 2);
    ctx.stroke()
    ctx.font = "10px Arial"
    ctx.fillText(dom.tagName, (xstart + xend) / 2, y + 80, 50);
    let path = makeButton(((xstart + xend) / 2)-50,y+50)
    document.addEventListener("click", function (e) {
        if (!flags[ttemp]) {
            const XY = getXY(canvas, e)
            if (ctx.isPointInPath(path, XY.x, XY.y)) {
                ctx.beginPath()
                ctx.rect(xstart, y + 10, xstart + xend, canvas.height);
                ctx.fillStyle = "White"
                ctx.fill()
                flags[ttemp] = true
            }
        }else{
            /////////////////////////////////
            let d = (xend - xstart) / dom.childElementCount
            let tempStart = xstart
            let tempEnd = d + xstart
            y += 100
            flags[ttemp] = false
            for (let index = 0; index < dom.childElementCount; index++) {
                ctx.moveTo((xstart + xend) / 2, y + 10)
                ctx.lineTo((tempStart + tempEnd) / 2, y + 50)
                ctx.stroke()
                circal1(tempStart, tempEnd, y, dom.children[index]);
                tempStart += d
                tempEnd += d
            }

            ////////////////////////////////

        }

    }, false)
    count++



    let d = (xend - xstart) / dom.childElementCount
    let tempStart = xstart
    let tempEnd = d + xstart
    y += 100
    for (let index = 0; index < dom.childElementCount; index++) {

        ctx.moveTo((xstart + xend) / 2, y + 10)
        ctx.lineTo((tempStart + tempEnd) / 2, y + 50)
        ctx.stroke()
        circal1(tempStart, tempEnd, y, dom.children[index]);
        tempStart += d
        tempEnd += d
    }
}


window.addEventListener('load', start, false);