let flags = new Array(20).fill(false);
let count = 0;
let root = document.getElementById('root')
let isredandt = false
let canvas = document.querySelector("#canvas")
let ctx = canvas.getContext("2d")
let places = new Array(20).fill(0);
let level = 0;
let timer;
let pluseimage = new Image()
let minusimage = new Image()
let count2 = 0;
pluseimage.src = 'imgs/1200px-OCR-A_char_Plus_Sign.svg.png'
minusimage.src = 'imgs/1484942355ios-emoji-heavy-minus-sign.png'
drawElements(20, root, level)


function getNodesPerLevel(row) {
    return row <= 0 ? 1 : _getNodesPerLevel(document, row)
}

function _getNodesPerLevel(e, row) {
    if (row == 0)
        return "childNodes" in e ? nonEmptyNodes(e) : 0;
    else if (!("childNodes" in e))
        return 0;
    var total = 0
    if (!flags[count2]) {
        for (let i = 0; i < e.childNodes.length; i++) {
            total += _getNodesPerLevel(e.childNodes[i], row - 1)
            count2++
        }
    }
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

function makeButton(x, y, flag) {
    const path = new Path2D()
    let currentimg
    path.rect(x, y, 20, 20)
    if (flag) {
        currentimg = minusimage
    } else {
        currentimg = pluseimage
    }
    ctx.drawImage(currentimg, x, y, 20, 25);
    return path
}

function makeattr(x, y) {
    const path = new Path2D()
    path.rect(x, y + 40, 20, 20)
    var img = new Image();
    img.src = 'imgs\\twIm6.png';
    ctx.drawImage(img, x, y + 40, 20, 25);
    return path
}

function makehint(x, y) {
    const path = new Path2D()
    path.rect(x - 20, y - 20, 40, 40)
    return path
}

function makeCreat(x, y) {

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
    drawElements(20, root, level)
}

function drawElements(y, dom, level) {
    places[level] += 1
    let ttemp = count
    let x = (((canvas.width / (getNodesPerLevel(level) + 1))) * places[level])
    ctx.beginPath()
    ctx.arc(x, y + 80, 30, 0, Math.PI * 2);
    ctx.fillStyle = "#7371FC"
    ctx.fill()
    ctx.stroke()
    ctx.font = "10px Arial"
    ctx.fillStyle = "black"
    ctx.fillText(dom.tagName, x - 15, y + 80, 500);
    let path = makeButton(x - 50, y + 50, flags[ttemp])
    let attr = makeattr(x - 50, y + 50)
    let hint = makehint(x, y + 80)
    if (!isredandt) {
        document.addEventListener("mousemove", function (e) {
            const XY = getXY(canvas, e)
            if (ctx.isPointInPath(hint, XY.x, XY.y) && dom.innerHTML !== '') {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    ctx.beginPath()
                    let text = dom.innerHTML.split('\n')
                    ctx.rect(XY.x, XY.y, 200, 10 * text.length)
                    ctx.fillStyle = "#25283D"
                    ctx.fill()
                    ctx.stroke()
                    ctx.font = "10px Arial"
                    let texty = XY.y + 5
                    ctx.fillStyle = "#FC5130"
                    for (let i = 0; i < text.length; i++) {
                        ctx.fillText(text[i], XY.x, texty += 10, 200)
                    }
                    ctx.closePath()
                }, 500);
            }
            redraw()

        });

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
            } else if (ctx.isPointInPath(hint, XY.x, XY.y)) {
                isredandt = true
                makeForm()

            }
        }, false)
    }
    count++


    if (!flags[ttemp]) {

        y += 100
        level++
        for (let index = 0; index < dom.childNodes.length; index++) {
            ctx.beginPath()
            ctx.moveTo((((canvas.width / (getNodesPerLevel(level - 1) + 1))) * places[level - 1]), y + 10)
            if (dom.childNodes[index].nodeType === 1) {
                ctx.lineTo((((canvas.width / (getNodesPerLevel(level) + 1))) * (places[level] + 1)), y + 50)
                ctx.stroke()
                ctx.closePath()

                drawElements(y, dom.childNodes[index], level)
            } else if (dom.childNodes[index].nodeType === 3 && dom.childNodes[index].data.trim() !== "") {
                ctx.lineTo((((canvas.width / (getNodesPerLevel(level) + 1))) * (places[level] + 1)) + 25, y + 50)
                ctx.stroke()
                ctx.closePath()
                rectText(y, dom.childNodes[index], level)
            }
        }

    }
}

function rectText(y, dom, level) {
    places[level] += 1
    ctx.beginPath()
    ctx.rect(((((canvas.width / (getNodesPerLevel(level) + 1))) * places[level])), y + 50, 50, 35)
    ctx.fillStyle = '#CDC1FF'
    ctx.fill()
    ctx.stroke()
    ctx.font = "10px Arial"
    ctx.fillStyle = 'black'
    ctx.fillText(dom.data, ((((canvas.width / (getNodesPerLevel(level) + 1))) * places[level])), y + 70, 50);

}

function makeForm() {
    let mymode = document.createElement('div')
    mymode.classList.add("modal")
    mymode.id = 'myModal'
    let contant = document.createElement('div')
    contant.classList.add("modal-content")
    let span = document.createElement('span')
    span.classList.add("close")
    let labal = document.createElement('label')
    labal.innerText = "HTML: "
    let input = document.createElement('input')
    let button = document.createElement('button')
    button.classList = "btn"
    button.innerText = "Add"
    button.onclick = apeendhtml;
    contant.append(span, labal)
    contant.append(labal, labal)
    contant.append(input, labal)
    contant.append(button, labal)
    mymode.append(contant)
    document.body.append(mymode)
}
function apeendhtml(){

}

function download() {
    var link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete();
}