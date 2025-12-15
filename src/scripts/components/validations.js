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

const checkInputValidity = (formElement, inputElement, inputErrorClass, errorClass) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputErrorClass, inputElement.validationMessage, errorClass);
  } else {
    hideInputError(formElement, inputElement, inputErrorClass, errorClass);
  }
}; //  проверяем ваще норм ввели или нет

const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    })
};

// тут далее будет часть для ValidationSettings, которые указаны в чек-листе))