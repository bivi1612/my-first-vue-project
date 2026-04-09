<template>
  <div class="rooms-page">
    <button @click="goBack" class="back-btn">← На главную</button>
    <h1>Наши номера</h1>
    
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="categories">
      <div v-for="cat in categories" :key="cat.fCategory" class="card">
        <h2>{{ cat.fCategory }}</h2>
        <div class="price">{{ cat.fPrice }} ₽ / сутки</div>
        <div>👥 {{ cat.fPlaces }} места</div>
        <div>✅ Свободно: {{ cat.available_rooms }} из {{ cat.total_rooms }}</div>
        
        <div class="features">
          <span v-if="cat.fKitchen === 'Да'">🍳 Кухня</span>
          <span v-if="cat.fBar === 'Да'">🍸 Бар</span>
          <span v-if="cat.fBalcony === 'Да'">🌿 Балкон</span>
        </div>
        
        <button @click="showRooms(cat)" :disabled="cat.available_rooms === 0">
          {{ cat.available_rooms > 0 ? 'Смотреть номера' : 'Нет свободных' }}
        </button>
      </div>
    </div>

    <!-- Модальное окно -->
    <div v-if="modalVisible" class="modal" @click="modalVisible = false">
      <div class="modal-content" @click.stop>
        <h3>Номера в категории "{{ selectedCategory }}"</h3>
        <div v-if="loadingRooms">Загрузка...</div>
        <div v-else>
          <div v-for="room in freeRooms" :key="room.fidRoom" class="room-item">
            Номер {{ room.fidRoom }} — {{ room.fPrice }} ₽/сутки
          </div>
          <div v-if="freeRooms.length === 0">Нет свободных номеров</div>
        </div>
        <button @click="modalVisible = false">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      categories: [],
      loading: true,
      error: null,
      modalVisible: false,
      selectedCategory: '',
      freeRooms: [],
      loadingRooms: false
    };
  },
  mounted() {
    this.loadCategories();
  },
  methods: {
    goBack() {
      this.$router.push('/');
    },
    async loadCategories() {
      try {
        const res = await axios.get('http://localhost:3000/api/categories');
        this.categories = res.data;
      } catch (err) {
        this.error = 'Ошибка загрузки';
      } finally {
        this.loading = false;
      }
    },
    async showRooms(cat) {
      this.selectedCategory = cat.fCategory;
      this.modalVisible = true;
      this.loadingRooms = true;
      try {
        const res = await axios.get(`http://localhost:3000/api/categories/${cat.fCategory}/rooms`);
        this.freeRooms = res.data;
      } catch (err) {
        this.freeRooms = [];
      } finally {
        this.loadingRooms = false;
      }
    }
  }
};
</script>

<style scoped>
.rooms-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.back-btn {
  background: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
}
.categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.price {
  font-size: 24px;
  color: #e74c3c;
  font-weight: bold;
}
.features {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}
button {
  background: #27ae60;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}
button:disabled {
  background: #bdc3c7;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  min-width: 300px;
}
.room-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>