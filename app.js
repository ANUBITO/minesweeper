// main box
let container = document.querySelector('.cont')

// number of cols and rows
let col = 1;
let row = 1;

// number of mines (dificulty)
let mine_number = 20;

// mine location
let mines = [];

let checked = 0;

let flagicon = 'flag.svg';

let flagactive = false;

let flagcount = mine_number;

let flag = document.getElementById('flag');
let cursor = document.getElementById('select');
let flagnumber = document.getElementById('flagcount');

flagnumber.innerText = flagcount;

let lostscreen = document.getElementById('lost');
let restartbtn = document.querySelectorAll('#restart');

let winscreen = document.getElementById('win');

let startbtn = document.getElementById('start')
let startscreen = document.getElementById('startscreen')

startbtn.addEventListener('click', function () {
    startscreen.classList.add('d-none')
})


flag.addEventListener('click', function() {
    handleflag('flag')
})
cursor.addEventListener('click', function() {
    handleflag('cursor')
})

restartbtn.forEach(element => {
    element.addEventListener('click', function() {
        handlerestart()
    })
});

function handlerestart() {
    location.reload();
}

function handleflag(par) {
    if(par == 'flag' && flagactive !== true) {
        flagactive = true
        flag.classList.toggle('btn-warning')
        flag.classList.toggle('btn-success')
        cursor.classList.toggle('btn-warning')
        cursor.classList.toggle('btn-success')
    } else if(par == 'cursor' && flagactive !== false) {
        flagactive = false
        flag.classList.toggle('btn-warning')
        flag.classList.toggle('btn-success')
        cursor.classList.toggle('btn-warning')
        cursor.classList.toggle('btn-success')
    }
    // console.log(flagactive);

}


for (let i = 1; i <= 150; i++) {
    // create element and add class
    let box = document.createElement('div')
    box.classList.add('box', `row${row}-col${col}`, 'btn', 'btn-secondary')
    box.setAttribute('row', row)
    box.setAttribute('col', col)
    box.setAttribute('flagged', 'false')
    box.id = i;
    container.appendChild(box)

    // manage cols and rows
    if(col%10 === 0) {
        row++;
        col=0;
    }
    col++;

}

// recursive random generation
function generatemine(random) {
    if(mines.includes(random) || random === 1 || random === 10 || random === 141 || random === 150) {
        let random = Math.floor(Math.random()*150);
        // console.log(random);
        generatemine(random)
    } else {
        mines.push(random)
    }
}


for (let i = 0; i < mine_number; i++) {
    let random = Math.floor(Math.random()*150);
    generatemine(random)
}

// all boxes
let boxes = document.querySelectorAll('.box')
boxes.forEach(function (item, index) {
    item.addEventListener('contextmenu', function (ev) {
        ev.preventDefault()
        // console.log(item);
        if (item.getAttribute('flagged') == 'true') {
            flagcount++
            flagnumber.innerText = flagcount
            item.removeChild(item.firstElementChild);
            item.setAttribute('flagged', 'false')
        } else if (item.getAttribute('disabled') != 'true' && flagcount > 0) {
            flagcount--
            flagnumber.innerText = flagcount
            let img = document.createElement('img');
            img.setAttribute('src', flagicon)
            img.id = 'flag'
            item.appendChild(img)
            item.setAttribute('flagged', 'true')
        }
    })
})

boxes.forEach(function (item, index) {
    item.addEventListener('click', function () {
        handleclick(item)
    })
})

function handleclick(item) {
    if (item.getAttribute('flagged') == 'true' && flagactive == true) {
        flagcount++
        flagnumber.innerText = flagcount
        item.removeChild(item.firstElementChild);
        item.setAttribute('flagged', 'false')
    } else if (flagactive == true && item.getAttribute('disabled') != 'true' && flagcount > 0) {
        flagcount--
        flagnumber.innerText = flagcount
        let img = document.createElement('img');
        img.setAttribute('src', flagicon)
        img.id = 'flag'
        item.appendChild(img)
        item.setAttribute('flagged', 'true')
    } else if(item.getAttribute('flagged') != 'true' && flagactive == false) {
        let count = 0;
        if(mines.includes(parseInt(item.id))) {
            lostscreen.classList.remove('d-none')
            // console.log('boom');
        } else {
            checkmines(item)
        }
    }
    
    // console.log(item.id);
}


function checkmines(item) {
    if(item.getAttribute('disabled') != 'true') {
        let minesToCheck = [];
        // top left
        parseInt(item.getAttribute('row')) !== 1  && parseInt(item.getAttribute('col')) !== 1 ?  minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))-1}-col${parseInt(item.getAttribute('col'))-1}`).id) : null
        // top
        parseInt(item.getAttribute('row')) !== 1 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))-1}-col${parseInt(item.getAttribute('col'))}`).id) : null
        // top right
        parseInt(item.getAttribute('row')) !== 1 && parseInt(item.getAttribute('col')) !== 10 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))-1}-col${parseInt(item.getAttribute('col'))+1}`).id) : null
        // left
        parseInt(item.getAttribute('col')) !== 1 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))}-col${parseInt(item.getAttribute('col'))-1}`).id) : null
        // right
        parseInt(item.getAttribute('col')) !== 10 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))}-col${parseInt(item.getAttribute('col'))+1}`).id) : null
        // bottom left
        parseInt(item.getAttribute('row')) !== 15 && parseInt(item.getAttribute('col')) !== 1 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))+1}-col${parseInt(item.getAttribute('col'))-1}`).id) : null
        // bottom
        parseInt(item.getAttribute('row')) !== 15 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))+1}-col${parseInt(item.getAttribute('col'))}`).id) : null
        // bottom right
        parseInt(item.getAttribute('row')) !== 15 && parseInt(item.getAttribute('col')) !== 10 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))+1}-col${parseInt(item.getAttribute('col'))+1}`).id) : null
        
        item.setAttribute('disabled', 'true')
        item.classList.add('btn-light')
        generateNumber(minesToCheck, item)
    }
}

function removeflag(item) {
    flagcount++
    flagnumber.innerText = flagcount
    item.removeChild(item.firstElementChild)
}

function generateNumber(minesToCheck, item) {
    checked++
    if(checked == 150 - mine_number) {
        winscreen.classList.remove('d-none')
        // console.log('win');
    }
    // console.log(checked);
    let count = 0;
    minesToCheck.forEach(function (element, index) {
        if(mines.includes(parseInt(element))) {
            count++;
        }
    })
    item.firstElementChild != null ? removeflag(item) : null
    let paragraph = document.createElement('p');
    paragraph.classList.add('number')
    paragraph.id = count
    let textnode = document.createTextNode(count)
    paragraph.appendChild(textnode)
    item.appendChild(paragraph)
    // console.log(count)
    if (count == 0) {
        handlezero(item)
    }
}

function handlezero(item) {
    let minesToCheck = [];
    // top left
    parseInt(item.getAttribute('row')) !== 1  && parseInt(item.getAttribute('col')) !== 1 ?  minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))-1}-col${parseInt(item.getAttribute('col'))-1}`).id) : null
    // top
    parseInt(item.getAttribute('row')) !== 1 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))-1}-col${parseInt(item.getAttribute('col'))}`).id) : null
    // top right
    parseInt(item.getAttribute('row')) !== 1 && parseInt(item.getAttribute('col')) !== 10 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))-1}-col${parseInt(item.getAttribute('col'))+1}`).id) : null
    // left
    parseInt(item.getAttribute('col')) !== 1 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))}-col${parseInt(item.getAttribute('col'))-1}`).id) : null
    // right
    parseInt(item.getAttribute('col')) !== 10 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))}-col${parseInt(item.getAttribute('col'))+1}`).id) : null
    // bottom left
    parseInt(item.getAttribute('row')) !== 15 && parseInt(item.getAttribute('col')) !== 1 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))+1}-col${parseInt(item.getAttribute('col'))-1}`).id) : null
    // bottom
    parseInt(item.getAttribute('row')) !== 15 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))+1}-col${parseInt(item.getAttribute('col'))}`).id) : null
    // bottom right
    parseInt(item.getAttribute('row')) !== 15 && parseInt(item.getAttribute('col')) !== 10 ? minesToCheck.push(document.querySelector(`.row${parseInt(item.getAttribute('row'))+1}-col${parseInt(item.getAttribute('col'))+1}`).id) : null
    minesToCheck.forEach(function (element, index) {
        checkmines(document.getElementById(element))
    })
}

// console.log(mines);