const showInputError = (formElement,inputElement,errorMessage, errorClass,inputErrorClass) => {
    const errorElement = formElement.querySelector(`${inputElement.id}-error`);
    inputElement.class.add(inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(errorClass);
} // если чето не так ошибка покажется
