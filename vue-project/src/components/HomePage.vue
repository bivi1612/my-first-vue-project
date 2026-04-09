<template>
  <div class="main-page">
    <!-- Шапка -->
    <div class="header">
      <h1>Гостиница</h1>
      <p>Ваш идеальный отдых начинается здесь</p>
    </div>

    <!-- О нас -->
    <div class="info-block">
      <h2>О нас</h2>
      <p>Мы предлагаем комфортные номера, вкусные завтраки и отличный сервис.</p>
    </div>

    <!-- Преимущества -->
    <div class="advantages">
      <div class="advantage">
        <span class="icon">🛏️</span>
        <h3>Уютные номера</h3>
        <p>Современный ремонт и всё необходимое</p>
      </div>
      <div class="advantage">
        <span class="icon">📶</span>
        <h3>Бесплатный Wi-Fi</h3>
        <p>Быстрый интернет на всей территории</p>
      </div>
    </div>

    <!-- КНОПКА ПЕРЕХОДА -->
    <div class="action">
      <button @click="goToRooms" class="main-btn">
        Посмотреть наши номера
      </button>
    </div>

    <!-- Подвал -->
    <div class="footer">
      <p>© 2025 Гостиница. Все права защищены.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    goToRooms() {
      console.log('Кнопка нажата!'); // Проверка в консоли
      this.$router.push('/rooms');
    }
  }
};
</script>

<style scoped>
/* ваши стили */
.main-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f0f4f8;
  min-height: 100vh;
}

.header {
  text-align: center;
  background: #2c3e50;
  color: white;
  padding: 50px 20px;
  border-radius: 20px;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 42px;
  margin: 0;
}

.info-block {
  background: white;
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  text-align: center;
}

.advantages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.advantage {
  background: white;
  padding: 25px;
  text-align: center;
  border-radius: 15px;
  transition: transform 0.3s;
}

.advantage:hover {
  transform: translateY(-5px);
}

.advantage .icon {
  font-size: 48px;
  display: block;
  margin-bottom: 15px;
}

.action {
  text-align: center;
  margin: 40px 0;
}

.main-btn {
  background: #e74c3c;
  color: white;
  font-size: 22px;
  padding: 15px 40px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.3s;
}

.main-btn:hover {
  background: #c0392b;
}

.footer {
  text-align: center;
  padding: 30px;
  background: #2c3e50;
  color: white;
  border-radius: 20px;
  margin-top: 30px;
}
</style>