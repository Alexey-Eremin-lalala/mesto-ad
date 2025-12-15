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

const disableSubmitButton = (submitButton, inactiveButtonClass) => {
    submitButton.classList.add(inactiveButtonClass);
    submitButton.disabled = true;
}

const enableSubmitButton = (submitButton, inactiveButtonClass) => {
    submitButton.classList.remove(inactiveButtonClass);
    submitButton.disabled = false;
}

const toggleButtonState = (inputList, submitButton, inactiveButtonClass) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(submitButton, inactiveButtonClass);
  } else {
    enableSubmitButton(submitButton, inactiveButtonClass);
  }
}; // Шаманим с кнопкой Z Шаман Россия ZZZ ZOV 

const setEventListeners = (formElement, inputErrorClass,errorClass,submitButton, inactiveButtonClass, inputSelector ) => {
    const inputList = Array.from(formElement.querySelectorAll(inputSelector));
    toggleButtonState(inputList, submitButton, inactiveButtonClass); // каждый раз прочекиваем, как говорилось в спринте
    inputList.forEach((inputElements) => {
        inputElements.addEventListener('input', () => {
            checkInputValidity(formElement, inputElements, inputErrorClass, errorClass)
            toggleButtonState(inputList, submitButton, inactiveButtonClass) // снова чек кнопочки
        });
    });
};



// тут далее будет часть для ValidationSettings, которые указаны в чек-листе))