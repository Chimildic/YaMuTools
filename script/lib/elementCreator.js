function createNavTab(title, path) {
    let a = document.createElement('a');
    a.className = 'nav__tab nav__link typo-nav typo-nav_contrast';
    a.setAttribute('data-name', path);
    a.innerHTML = title;
    a.href = path;

    return a;
}
function createDropdown(data) {
    let dropdown = document.createElement('div');
    dropdown.className = 'dropdown';
    dropdown.append(createButton(data.button));
    data.menus.forEach((data) => dropdown.append(createMenu(data)));

    let style = document.createElement('style');
    style.innerHTML = `.dropdown > ::-webkit-scrollbar { width: 0px; } .menu_width{ width: ${data.width}px; } .dropbtn { border: none; cursor: pointer; } .dropdown { text-align: left; position: relative; display: inline-block; z-index: 77; } .dropdown-content { display: none; position: absolute; min-width: 160px; box-shadow: 0 10px 20px -5px rgba(0, 0, 0, .4); } .dropdown-content li { padding: 10px 16px; text-decoration: none; display: block; background-color: #222; } .show { display: block; } .header {border-bottom-width: 1px; border-bottom-style: solid; border-color: #e5e5e545;}`;

    let root = document.createElement('span');
    root.id = data.id;
    root.append(dropdown);
    root.append(style);

    return root;
}

function createButton(data) {
    let button = document.createElement('button');
    if (data.hasOwnProperty('id')) {
        button.id = data.id;
    }
    button.className = 'dropbtn d-button deco-button deco-button-transparent d-button_rounded d-button_size_L';
    button.innerHTML = `<span class="d-button-inner deco-button-stylable"><span class="d-button__inner"><label>${data.title}</label></span></span>`;
    button.addEventListener('click', data.handler);

    let span = document.createElement('span');
    span.append(button);

    return span;
}

function createMenu(data) {
    let ul = document.createElement('ul');
    ul.id = data.id;
    ul.className = 'menu_width dropdown-content d-context-menu__popup deco-popup-menu d-context-menu__list deco-popup-menu__item-group';

    for (i = 0; i < data.items.length; i++) {
        let li = document.createElement('li');
        li.className = 'd-context-menu__item deco-popup-menu__item d-context-menu';
        li.addEventListener('click', data.items[i].handler);

        if (data.items[i].hasOwnProperty('header')) {
            addMenuHeader(li, data.items[i]);
        } else if (data.items[i].hasOwnProperty('title')) {
            li.innerHTML = data.items[i].title;
        }

        ul.append(li);
    }

    return ul;
}

function addMenuHeader(li, item) {
    let icon = document.createElement('span');
    icon.className = 'd-context-menu__item-icon d-icon deco-icon d-icon_arrow-left';

    let title = document.createElement('span');
    if (item.hasOwnProperty('titleId')) {
        title.id = item.titleId;
    }

    if (item.hasOwnProperty('title')) {
        title.innerHTML = item.title;
    }

    li.className += ' header';
    li.append(icon);
    li.append(title);
}
