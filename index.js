let flags = new Array(10).fill(false);
let count = 0;
let root = document.getElementById('root')
let isredandt = false
let canvas = document.querySelector("#canvas")
let ctx = canvas.getContext("2d")
let parent = []
let levels =[]
let level = 0;
parent[0] = root
let child = []
circal1(0, canvas.width, 20, root)
console.log(getNodesPerLevel(1))


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
                    console.log(1)
                    child.push(parent[j].childNodes[k])
                }
            }
            levels.push(child.length);
            parent = child
            child = []
        }
    console.log(levels)
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


function getXY(canvas, event) { //shape
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top //mouse event
    const x = event.clientX - rect.left
    return {x: x, y: y}
}

function circal1(start, end, y, dom) {
    let ttemp = count
    ctx.beginPath()
    ctx.arc(((canvas.width/getNodesPerLevel(level))/2), y + 80, 30, 0, Math.PI * 2);
    ctx.stroke()
    ctx.fillStyle = "black"
    ctx.font = "10px Arial"
    ctx.fillText(ttemp + ' / ' + dom.tagName, ((start + end) / 2) - 10, y + 80, 50);
    let path = makeButton(((start + end) / 2) - 50, y + 50, flags[ttemp])
    let attr = makeattr(((start + end) / 2) - 50, y + 50, flags[ttemp])

    if (!isredandt) {
        document.addEventListener("click", function (e) {
            const XY = getXY(canvas, e)
            if (ctx.isPointInPath(path, XY.x, XY.y)) {
                if (!flags[ttemp]) {
                    flags[ttemp] = true
                    count = 0
                    isredandt = true
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    circal1(0, canvas.width, 20, root)
                } else {
                    isredandt = true
                    /////////////////////////////////
                    flags[ttemp] = false
                    count = 0
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    circal1(0, canvas.width, 20, root)
                }
            } else if (ctx.isPointInPath(attr, XY.x, XY.y)) {
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
        let d = (end - start) / dom.childNodes.length
        let tempStart = start
        let tempEnd = d + start
        y += 100
        for (let index = 0; index < dom.childNodes.length; index++) {

            ctx.moveTo((start + end) / 2, y + 10)

            if (dom.childNodes[index].nodeType === 1) {
                level++
                ctx.lineTo((tempStart + tempEnd) / 2, y + 50)
                ctx.stroke()
                circal1(tempStart, tempEnd, y, dom.childNodes[index])
            } else if (dom.childNodes[index].nodeType === 3 && dom.childNodes[index].data.trim() !== "") {
                level++
                ctx.lineTo(((tempStart + tempEnd) / 2) , y + 50)
                ctx.stroke()
                rectText(tempStart, tempEnd, y, dom.childNodes[index])
            }
            tempStart += d
            tempEnd += d
        }

    }
}

function rectText(start, end, y, dom) {
    ctx.beginPath()
    ctx.rect(((start + end) / 2)-25, y + 50, 50, 35,);
    ctx.stroke()
    ctx.font = "10px Arial"
    ctx.fillText(dom.data, ((start + end) / 2) -20, y + 70, 50);

}
