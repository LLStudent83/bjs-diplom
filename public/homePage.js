const logoutButton = new LogoutButton();
logoutButton.action = () => {
  ApiConnector.logout((reload) => {
    if (reload.success) {
      location.reload();
    }
  });
};

ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

const ratesBoard = new RatesBoard();
const exchangeRates = (response) => {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
};
exchangeRates();
setInterval(exchangeRates, 60000);

//Пополнение баланса
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

//Конвертирование валют
moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};
// response.success ? moneyManager.setMessage(response.success, response.error) : null
// условие ? выражение1 : выражение2
//Перевод средств
moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

//Запрос начального списка избранного
const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites((response) => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

//Добавление пользователя в список избранных
favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

//Удаление пользователя из избранного
favoritesWidget.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};
