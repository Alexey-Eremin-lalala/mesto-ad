const showInputError = (formElement,inputElement,errorMessage, errorClass,inputErrorClass) => {
    const errorElement = formElement.querySelector(`${inputElement.id}-error`);
    inputElement.classList.add(inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(errorClass);
} // если чето не так ошибка покажется

const hideInputError = (formElement,inputElement, errorClass,inputErrorClass) => {
    const errorElement = formElement.querySelector(`${inputElement.id}-error`);
    inputElement.classList.remove(inputErrorClass);
    errorElement.textContent='';
    errorElement.classList.remove(errorClass);
} // прятаем ошибочку


// тут далее будет часть для ValidationSettings, которые указаны в чек-листе))