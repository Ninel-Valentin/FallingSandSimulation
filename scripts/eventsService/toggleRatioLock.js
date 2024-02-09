const rowsInput = document.querySelector('input#rowsCount');
const colsInput = document.querySelector('input#colsCount');

function ToggleLockRatio(e) {
    var caller = e.target;
    while (caller.tagName != 'TD') {
        caller = caller.parentNode;
    }

    const isActive = caller.className.includes('active');
    if (isActive) {
        // If the lock is enabled
        colsInput.setAttribute('readonly', '');
        colsInput.value = rowsInput.value;
        rowsInput.addEventListener('input', CopyInputAction);
        caller.className = '';
    } else {
        // If the lock is disabled
        colsInput.removeAttribute('readonly');
        caller.className = 'active';
        rowsInput.removeEventListener('input', CopyInputAction);
    }
}

function CopyInputAction(event) {
    colsInput.value = rowsInput.value;
}

document.querySelector('td#lockRatio').addEventListener('click', e => ToggleLockRatio(e));