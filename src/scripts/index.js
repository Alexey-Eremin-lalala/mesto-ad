/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/
import {
  getUserInfo,
  getCardList,
  setUserAvatars,
  setUserInfo,
  createNewCard,
  removeMyCutyCard,
  changeLikeCardStatus,
} from "./components/api.js";
import { createCardElement } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import { enableValidation } from "./components/validations.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description"
);

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");
const logoButton = document.querySelector(".logo");
const usersStatsModalWindow = document.querySelector(".popup_type_info");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// включение валидации вызовом enableValidation
// все настройки передаются при вызове
enableValidation(validationSettings);

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (term, description) => {
  const template = document.querySelector(
    "#popup-info-definition-template"
  ).content;
  const infoItem = template.querySelector(".popup__info-item").cloneNode(true);

  const termElement = infoItem.querySelector(".popup__info-term");
  const descriptionElement = infoItem.querySelector(".popup__info-description");

  termElement.textContent = term;
  descriptionElement.textContent = description;

  return infoItem;
};

// Жлемент пользователя
const createUserBadge = (userName) => {
  const template = document.querySelector(
    "#popup-info-user-preview-template"
  ).content;
  const userBadge = template.querySelector(".popup__list-item").cloneNode(true);

  userBadge.textContent = userName;
  return userBadge;
};

// Обработчик клика на логотип
const handleLogoClick = () => {
  getCardList()
    .then((cards) => {
      // Получаем элементы модального окна
      const modalTitle = usersStatsModalWindow.querySelector(".popup__title");
      const modalInfoList = usersStatsModalWindow.querySelector(".popup__info");
      const modalText = usersStatsModalWindow.querySelector(".popup__text");
      const modalUserList = usersStatsModalWindow.querySelector(".popup__list");

      // Очищаем предыдущие данные
      modalInfoList.innerHTML = "";
      modalUserList.innerHTML = "";

      // Устанавливаем заголовок
      modalTitle.textContent = `Статистика Пользователя`;

      const totalCards = cards.length;
      const sortedCards = [...cards].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      // все норм пацаны
      const usersMap = new Map();
      cards.forEach((card) => {
        if (card.owner) {
          const userId = card.owner._id;
          const userName = card.owner.name;
          if (!usersMap.has(userId)) {
            usersMap.set(userId, { name: userName, count: 0 });
          }
          usersMap.get(userId).count++;
        }
      });

      // Создаем статистику
      modalInfoList.append(
        createInfoString("Всего мест:", totalCards.toString())
      );

      if (sortedCards.length > 0) {
        modalInfoList.append(
          createInfoString(
            "Первая создана:",
            formatDate(new Date(sortedCards[0].createdAt))
          )
        );

        modalInfoList.append(
          createInfoString(
            "Последняя создана:",
            formatDate(new Date(sortedCards[sortedCards.length - 1].createdAt))
          )
        );
      }

      modalText.textContent = `Участники (${usersMap.size}):`;

      usersMap.forEach((userData, userId) => {
        const userBadge = createUserBadge(
          `${userData.name} (${userData.count})`
        );
        modalUserList.append(userBadge);
      });

      // открываем!
      openModalWindow(usersStatsModalWindow);
    })
    .catch((err) => {
      console.log("Ошибка при загрузке статистики:", err);
    });
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "вносим изменения...";

  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log("Ошибка при поменянии имени профиля", err);
    })
    .finally(() => {submitButton.textContent = originalText;});
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "вносим изменения...";

  setUserAvatars(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log("Ошибка при обновлении модной фотографии:", err);
    })
    .finally(() => {submitButton.textContent = originalText;});
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "вносим изменения...";

  createNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardInfo) => {
      placesWrap.prepend(
        createCardElement(
          cardInfo,
          {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: likeCard,
            onDeleteCard: deleteCard,
          },
          true,
          false
        )
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log("Ошибка при добавлении крутецкой карточки:", err);
    }).finally(() => {submitButton.textContent = originalText;});
};

const deleteCard = (cardElement, cardId) => {
  removeMyCutyCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.error("Не удалось удалить крутую карточку:", err);
    });
};

const likeCard = (likeButton, cardId) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  changeLikeCardStatus(cardId, isLiked)
    .then((cardElement) => {
      likeButton.classList.toggle("card__like-button_is-active");
      const thisCard = likeButton.closest(".card");
      const likeCount = thisCard.querySelector(".card__like-count");
      likeCount.textContent = cardElement.likes.length;
    })
    .catch((err) => {
      console.log("АААА кортинка не лайкаеца:", err);
    });
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
});

const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

if (logoButton) {
  logoButton.addEventListener("click", handleLogoClick);
}

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    cards.forEach((card) => {
      const idOwner = card.owner._id === userData._id;
      const isLiked = card.likes.some((like) => like._id === userData._id);
      placesWrap.append(
        createCardElement(
          card,
          {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: likeCard,
            onDeleteCard: deleteCard,
          },
          idOwner,
          isLiked
        )
      );
    });
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`; // Код отвечающий за отрисовку полученных данных
  })
  .catch((err) => {
    console.log("уаааааа ашыбка блин:", err); // В случае возникновения ошибки выводим её в консоль
  });
