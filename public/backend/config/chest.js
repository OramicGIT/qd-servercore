// Конфигурация сундуков
const chestConfig = {
  chest2: {
    minOrbs: 200,
    maxOrbs: 4000,
    minDiamonds: 200,
    maxDiamonds: 1000,
    minKeys: 1,
    maxKeys: 60,
    waitTime: 5900 // Время ожидания в секундах
  }
};

// Пример получения случайного значения для сундука
function getRandomReward(chestType) {
  if (!chestConfig[chestType]) {
    console.error('Неизвестный тип сундука');
    return null;
  }

  const chest = chestConfig[chestType];

  // Генерация случайных значений для орбов, алмазов и ключей
  const orbs = Math.floor(Math.random() * (chest.maxOrbs - chest.minOrbs + 1)) + chest.minOrbs;
  const diamonds = Math.floor(Math.random() * (chest.maxDiamonds - chest.minDiamonds + 1)) + chest.minDiamonds;
  const keys = Math.floor(Math.random() * (chest.maxKeys - chest.minKeys + 1)) + chest.minKeys;

  return {
    orbs: orbs,
    diamonds: diamonds,
    keys: keys
  };
}

// Пример использования
const chestReward = getRandomReward('chest2');
console.log(`Полученные награды: Орбы: ${chestReward.orbs}, Алмазы: ${chestReward.diamonds}, Ключи: ${chestReward.keys}`);
