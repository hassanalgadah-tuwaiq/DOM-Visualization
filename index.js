let flags = new Array(10).fill(false);
let count = 0;
let root = document.getElementById('root')
let isredandt = false
let canvas = document.querySelector("#canvas")
let ctx = canvas.getContext("2d")
circal1(0, canvas.width, 20, root)



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

function circal1(start, end, y, dom) {
    let ttemp = count

    ctx.beginPath()
    ctx.arc((start + end) / 2, y + 80, 30, 0, Math.PI * 2);
    ctx.stroke()
    ctx.font = "10px Arial"
    ctx.fillText(ttemp+' / '+dom.tagName, ((start + end) / 2) - 10, y + 80, 50);
    let path = makeButton(((start + end) / 2)-50,y+50)

    if(!isredandt) {
        document.addEventListener("click", function (e) {
            if (!flags[ttemp]) {
                const XY = getXY(canvas, e)
                if (ctx.isPointInPath(path, XY.x, XY.y)) {
                    console.log(ttemp)
                    flags[ttemp] = true
                    count = 0
                    isredandt = true
                    console.log(flags)
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    circal1(0, canvas.width, 20, root)
                }
            } else {
                isredandt = true
                /////////////////////////////////
                console.log(2)
                flags[ttemp] = false
                count = 0
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                circal1(0, canvas.width, 20, root)
            }

        }, false)
    }
    count++


    if (!flags[ttemp]) {
        let d = (end - start) / dom.childNodes.length
        let tempStart = start
        let tempEnd = d + start
        y += 100
        for (let index = 0; index < dom.childNodes.length; index++) {

            console.log(dom.childNodes[index].nodeType)
            // circal1(tempStart, tempEnd, y, dom.children[index])
            ctx.moveTo((start + end) / 2, y + 10)

            if (dom.childNodes[index].nodeType === 1){
                ctx.lineTo((tempStart + tempEnd) / 2, y + 50)
                ctx.stroke()
                circal1(tempStart, tempEnd, y, dom.childNodes[index])
            }
            else if (dom.childNodes[index].nodeType === 3) {
                ctx.lineTo(((tempStart + tempEnd) / 2)+50, y + 80)
                ctx.stroke()
                rectText(tempStart, tempEnd, y, dom.childNodes[index])
            }
            tempStart += d
            tempEnd += d
        }

    }
}

function rectText(start,end,y,dom) {
    ctx.beginPath()
    ctx.rect((start + end) / 2, y + 80, 100, 70,);
    ctx.stroke()
    ctx.font = "10px Arial"
    ctx.fillText(' TEXT ', ((start + end) / 2) + 30, y + 110, 50);

}
