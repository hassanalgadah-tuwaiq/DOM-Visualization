let flags = new Array(20).fill(false);
let count = 0;
let root = document.getElementById('root')
let isredandt = false
let canvas = document.querySelector("#canvas")
let ctx = canvas.getContext("2d")
let parent = []
let levels =[]
let places = new Array(20).fill(0);
let level = 0;
let place = 1
parent[0] = root
let child = []
drawElements( 20, root  , level)

function getNodesPerLevel(row) {
    return row <= 0 ? 1 : _getNodesPerLevel(document, row)
}
function _getNodesPerLevel(e, row) {
    if (row == 0)
        return "childNodes" in e ? nonEmptyNodes(e) : 0;
    else if (!("childNodes" in e))
        return 0;
    var total = 0
    for (let i = 0; i < e.childNodes.length; i++)
        total += _getNodesPerLevel(e.childNodes[i], row - 1)
    return total;
}
function nonEmptyNodes(e) {
    let total = 0
    for (let i = 0; i < e.childNodes.length; i++) {
        if (e.childNodes[i].nodeName == "#text" && e.childNodes[i].data.trim() == "") continue;
        else total++;
    }
    return total;
}


function makelevels(){
        for (let i = 0; i < parent.length; i++) {
            for (let j = 0; j < parent[i].childNodes.length; j++) {
                for (let k = 0; k < parent[j].childNodes.length; k++) {
                    child.push(parent[j].childNodes[k])
                }
            }
            levels.push(child.length);
            parent = child
            child = []
        }
}

function makeButton(x, y, flag) {
    const path = new Path2D()
    path.rect(x, y, 20, 20)
    if (flag) {
        ctx.fillStyle = "red"
    } else {
        ctx.fillStyle = "blue"
    }
    ctx.fill(path)
    ctx.stroke(path)
    return path
}

function makeattr(x, y) {
    const path = new Path2D()
    path.rect(x, y + 40, 20, 20)
    ctx.fillStyle = "black"
    ctx.fill(path)
    ctx.stroke(path)
    return path
}

function makehint(x,y) {
    const path = new Path2D()
    path.rect(x-20, y-20, 40, 40)
    ctx.stroke(path)
    return path
}

function getXY(canvas, event) { //shape
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top //mouse event
    const x = event.clientX - rect.left
    return {x: x, y: y}
}

function redraw() {
    count = 0
    isredandt = true
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    places = new Array(20).fill(0);
    level = 0
    drawElements(20, root, level )


}

function drawElements(y, dom, level) {
    places[level] += 1
    let ttemp = count
    let x = (((canvas.width/(getNodesPerLevel(level)+1)))*places[level])
    ctx.beginPath()
    ctx.arc(x, y + 80, 30, 0, Math.PI * 2);
    ctx.fillStyle = "black"
    ctx.strokeStyle= "gray"
    ctx.stroke()
    ctx.font = "10px Arial"
    ctx.fillText(ttemp +" / "+ dom.tagName, x-15, y + 80, 500);
    let path = makeButton(x - 50, y + 50,flags[ttemp])
    let attr = makeattr(x - 50, y + 50)
    let hint = makehint(x,y+80)
    if (!isredandt) {
        document.addEventListener("mouseover",(e)=>{
            const XY = getXY(canvas, e)
            if (ctx.isPointInPath(hint, XY.x, XY.y)) {
                console.log("hello everyboy")
            }
        },false)
        document.addEventListener("click", function (e) {
            const XY = getXY(canvas, e)
            if (ctx.isPointInPath(path, XY.x, XY.y)) {
                if (!flags[ttemp]) {
                    flags[ttemp] = true
                    redraw()
                } else {
                    flags[ttemp] = false
                    redraw()
                }
            } else if (ctx.isPointInPath(attr, XY.x, XY.y)) {
                isredandt = true
                let result = ""
                for (let i = 0; i < dom.attributes.length; i++) {
                    result += dom.attributes[i].name + ": " + dom.attributes[i].value + "\n"
                }
                alert(result)
            }
        }, false)
    }
    count++


    if (!flags[ttemp]) {

        y += 100
        level++
        for (let index = 0; index < dom.childNodes.length; index++) {
            ctx.beginPath()
            ctx.moveTo((((canvas.width/(getNodesPerLevel(level - 1 )+1)))*places[level-1]), y+10)
            if (dom.childNodes[index].nodeType === 1) {
                ctx.lineTo((((canvas.width/(getNodesPerLevel(level)+1)))*(places[level] + 1)), y + 50)
                ctx.stroke()
                ctx.closePath()

                drawElements(y, dom.childNodes[index], level)
            } else if (dom.childNodes[index].nodeType === 3 && dom.childNodes[index].data.trim() !== "") {
                ctx.lineTo((((canvas.width/(getNodesPerLevel(level)+1)))*(places[level] + 1))+25, y + 50)
                ctx.stroke()
                ctx.closePath()
                rectText(y, dom.childNodes[index],level)
            }
        }

    }
}

function rectText( y, dom , level) {
    places[level] += 1
    ctx.beginPath()
    ctx.rect(((((canvas.width/(getNodesPerLevel(level)+1)))*places[level])), y + 50, 50, 35)
    ctx.stroke()
    ctx.font = "10px Arial"
    ctx.fillText(dom.data, ((((canvas.width/(getNodesPerLevel(level)+1)))*places[level])), y + 70, 50);

}
