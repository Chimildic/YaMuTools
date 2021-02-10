function toggleDropdown(id) {
    document.getElementById(id).classList.toggle('show');
}

function onClickOutsideDropdown() {
    let dropdown = document.querySelector('.dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        closeDropdownAll();
    }
}

function onClickButtonDropdown(id) {
    if (!closeDropdownAll()) {
        toggleDropdown(id);
    }
}

function closeDropdownAll() {
    let closed = false;
    let dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].classList.contains('show')) {
            dropdowns[i].classList.remove('show');
            closed = true;
        }
    }

    return closed;
}
