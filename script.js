// task 1 start
class StringBuilder {
    value = '';

    constructor(baseString) {
        if (baseString !== undefined)
            this.value = baseString;
    }

    toString() {
        return this.value;
    };

    append(str) {
        this.value = str + this.value;

        return this;
    }
    prepend(str) {
        this.value += str;

        return this;
    };

    pad(str) {
        this.value = str + this.value + str;

        return this;
    }

};

const builder = new StringBuilder('.');
builder.append('^').prepend('^').pad('=');

console.log(builder);
// task 1 end

// task 2 start
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function createBoxes () {
    let baseW = 30;
    let baseH = 30;

    let conteiner = document.querySelector('div#boxes');
    let amount = parseInt(document.querySelector('div#controls input').value);
    for (let i = 0 ; i < amount ;  i++ ) {
        let div = document.createElement('div');
        div.style = "width: " + (baseW+ + (i*10)) + "px; height: " + (baseH+ + (i*10)) + "px; background-color: rgb(" + getRandomInt(255) + "," + getRandomInt(255) + "," + getRandomInt(255) + ");";
        conteiner.appendChild(div)
    }
}
function destroyBoxes() {
    let conteiner = document.querySelector('div#boxes');
    conteiner.innerHTML = '';
}

document.querySelector('div#controls button[data-action=create]').addEventListener('click',createBoxes);
document.querySelector('div#controls button[data-action=destroy]').addEventListener('click',destroyBoxes);
// task 2 end

// task 3 start
var serach = window.location.search.substr(7),
    taskElement = document.querySelector('.task:nth-child(2)'),
    collectImages = document.querySelector('#collect-images'),
    lastPage = 1,
    observer = new IntersectionObserver(eventLastImage, {threshold: 1});

serach = document.querySelector('#search-form input').value = decodeURI(serach);
function getImages(search, amount = 20, page = 1) {
    return new Promise((res, rej) => {
        lastPage = page;
        search = search.substr(0,100);

        let url = 'https://pixabay.com/api/' +
            '?key=19117369-b273a3f44976d5dbc9366cb80' +
            '&per_page=' + amount +
            '&page=' + page +
            '&q='+ search;

        let xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        try {
            xhr.send();
            xhr.onload = () => {
                if (xhr.status != 200) return false;

                let imgs = Object.values(JSON.parse(xhr.response).hits);

                let imagePromise = [];
                imgs.forEach((img, index) => {
                    imagePromise.push(loadElement(img));
                });

                Promise.all(imagePromise).then((ilTags) =>  {res(ilTags);});
            };
        } catch(err) {
            console.log("Запрос не удался" - url);
        }
    });
}
function loadElement(img) {
    return new Promise( (res, rej) => {
        imgTag = new Image();
        imgTag.src = img.webformatURL;
        imgTag.setAttribute('data-source', img.largeImageURL)
        imgTag.setAttribute('alt', img.tags);

        imgTag.onload = (event) => {
            let liTag = document.createElement('li');
            let aTag = document.createElement('a');
            aTag.onclick = (e) => {
                basicLightbox.create('<img width="1400" height="900" src="' + e.target.getAttribute('data-source') + '">').show()
                return false;
            };
            aTag.setAttribute('href', event.target.getAttribute('data-source'));
            aTag.appendChild(event.target);
            liTag.appendChild(aTag);

            res(liTag);
        }

    });
}
function eventLastImage(entries, observer) {
    let entry = entries[0];
    if (entry.isIntersecting)
        getImages(serach, 20, ++lastPage).then((tags) => {
            if (tags.length == 0) return false;
            tags.forEach((tag, index) => {
                collectImages.appendChild(tag);
            });
            observer.unobserve(entry.target)
            observer.observe(tags.pop())
        });
}

getImages(serach).then( (tags) => {
    if (tags.length == 0) return false;
    tags.forEach((tag, index) => {
        collectImages.appendChild(tag);
    });

    observer.observe(tags.pop());
});
// task 3 end