const sandColorMode = document.querySelector('select#sandColorMode');
const sandColorInput = document.querySelector('input#sandColorModeInput');
const canvasColorMode = document.querySelector('select#canvasColorMode');
const canvasColorInput = document.querySelector('input#canvasColorModeInput');

sandColorMode.addEventListener('change', (e) => {
    let value = e.target.value;
    if (value.charAt(0) == '#')
        sandColorInput.value = value;
});

canvasColorMode.addEventListener('change', (e) => {
    let value = e.target.value;
    if (value.charAt(0) == '#')
        canvasColorInput.value = value;
});