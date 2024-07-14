export function disableForm(form: HTMLFormElement) {
    Array.from(form.elements).forEach(element => {
        (element as HTMLInputElement).disabled = true;
    });
}

export function enableForm(form: HTMLFormElement) {
    Array.from(form.elements).forEach(element => {
        (element as HTMLInputElement).disabled = false;
    });
}

export function showError(button: HTMLButtonElement, form: HTMLFormElement, message: string, enableFn: () => void) {
    button.textContent = message;
    button.classList.add('error-button');
    disableForm(form);

    setTimeout(() => {
        button.classList.remove('error-button');
        enableFn();
    }, 3000);
}

export function setPlaceholderForTextArea(textArea: HTMLTextAreaElement, placeholderValue: string) {
    textArea.placeholder = placeholderValue;
}
