const showInputError = (formElement,inputElement, errorMessage, settings) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(settings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.errorClass);
} // если чето не так ошибка покажется

const hideInputError = (formElement,inputElement, settings) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(settings.inputErrorClass);
    errorElement.textContent='';
    errorElement.classList.remove(settings.errorClass);
} // прятаем ошибочку

const checkInputValidity = (formElement, inputElement, settings) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement,inputElement,inputElement.validationMessage,settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}; //  проверяем ваще норм ввели или нет

const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    })
};

const disableSubmitButton = (submitButton, settings) => {
    submitButton.classList.add(settings.inactiveButtonClass);
    submitButton.disabled = true;
}

const enableSubmitButton = (submitButton, settings) => {
    submitButton.classList.remove(settings.inactiveButtonClass);
    submitButton.disabled = false;
}

const toggleButtonState = (inputList, submitButton, settings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(submitButton, settings);
  } else {
    enableSubmitButton(submitButton, settings);
  }
}; // Шаманим с кнопкой Z Шаман Россия ZZZ ZOV 

const setEventListeners = (formElement, settings ) => {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const submitButton = formElement.querySelector(settings.submitButtonSelector);
    toggleButtonState(inputList, submitButton, settings); // каждый раз прочекиваем, как говорилось в спринте
    inputList.forEach((inputElements) => {
        inputElements.addEventListener('input', () => {
            checkInputValidity(formElement, inputElements, settings);
            toggleButtonState(inputList, submitButton, settings); // снова чек кнопочки
        });
    });
};

export const clearValidation = (formElement, settings) => {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const submitButton = formElement.querySelector(settings.submitButtonSelector);
    inputList.forEach((inpElement) => {
        hideInputError(formElement, inpElement, settings);
        inpElement.setCustomValidity('');
    });
    disableSubmitButton(submitButton, settings);
}

export const enableValidation = (settings) => {
    const formList = Array.from(document.querySelectorAll(settings.formSelector));
    formList.forEach((formElements) => {
        setEventListeners(formElements, settings);
    });
};

