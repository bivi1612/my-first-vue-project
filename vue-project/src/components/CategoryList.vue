<template>
  <div class="categories-container">
    <h1>Номера</h1>
    <p class="subtitle">Выберите категорию для проживания</p>
    
    <div v-if="loading" class="loading">Загрузка...</div>
    
    <div v-else class="categories-grid">
      <div 
        v-for="category in categories" 
        :key="category.fCategory" 
        class="category-card"
        @click="selectCategory(category)"
      >
        <div class="category-header">
          <h2>{{ category.fCategory }}</h2>
          <span class="price">{{ category.fPrice }} ₽/сутки</span>
        </div>
        
        <div class="category-details">
          <div class="detail-item">
            <span class="detail-icon">👥</span>
            <span>{{ category.fPlaces }} {{ getPlacesText(category.fPlaces) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon">🏠</span>
            <span>{{ category.total_rooms }} номеров</span>
          </div>
          <div class="detail-item" :class="{ available: category.available_rooms > 0 }">
            <span class="detail-icon">✅</span>
            <span>Свободно: {{ category.available_rooms }}</span>
          </div>
        </div>
        
        <div class="category-amenities">
          <span v-if="category.fKitchen === 'Да'" class="amenity">🍳 Кухня</span>
          <span v-if="category.fBar === 'Да'" class="amenity">🍸 Бар</span>
          <span v-if="category.fBalcony === 'Да'" class="amenity">🌿 Балкон</span>
          <span v-if="category.fKitchen === 'Нет' && category.fBar === 'Нет' && category.fBalcony === 'Нет'" class="amenity basic">
            🏠 Базовые удобства
          </span>
        </div>
        
        <button class="select-btn" :disabled="category.available_rooms === 0">
          {{ category.available_rooms > 0 ? 'Выбрать категорию' : 'Нет свободных номеров' }}
        </button>
      </div>
    </div>
    
    <!-- Модальное окно с номерами выбранной категории -->
    <div v-if="selectedCategory" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedCategory.fCategory }}</h2>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="category-info">
            <span>💰 {{ selectedCategory.fPrice }} ₽/сутки</span>
            <span>👥 {{ selectedCategory.fPlaces }} места</span>
            <span>🏠 {{ selectedCategory.total_rooms }} номеров</span>
          </div>
          
          <h3>Свободные номера:</h3>
          
          <div v-if="loadingRooms" class="loading-small">Загрузка номеров...</div>
          
          <div v-else class="rooms-list">
            <div v-for="room in availableRooms" :key="room.fidRoom" class="room-item">
              <div class="room-number">Номер {{ room.fidRoom }}</div>
              <div class="room-features">
                <span v-if="room.fKitchen === 'Да'">🍳</span>
                <span v-if="room.fBar === 'Да'">🍸</span>
                <span v-if="room.fBalcony === 'Да'">🌿</span>
              </div>
              <button class="book-btn">Забронировать</button>
            </div>
            
            <div v-if="availableRooms.length === 0" class="no-rooms">
              К сожалению, в этой категории нет свободных номеров
            </div>
          </div>
        </div>
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
      selectedCategory: null,
      availableRooms: [],
      loadingRooms: false
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        this.categories = response.data;
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
      } finally {
        this.loading = false;
      }
    },
    
   async selectCategory(category) {
    this.selectedCategory = category;
    this.loadingRooms = true;
    
    try {
        const url = `http://localhost:3000/api/categories/${encodeURIComponent(category.fCategory)}/rooms`;
        console.log(`📡 Запрос: ${url}`);
        
        const response = await axios.get(url);
        console.log('📦 Полученные номера:', response.data);
        
        this.availableRooms = response.data;
        
        if (this.availableRooms.length === 0) {
            console.warn('⚠️ Нет свободных номеров в этой категории');
        }
    } catch (err) {
        console.error('❌ Ошибка загрузки номеров:', err);
        this.availableRooms = [];
    } finally {
        this.loadingRooms = false;
    }
},
    
    closeModal() {
      this.selectedCategory = null;
      this.availableRooms = [];
    },
    
    getPlacesText(places) {
      if (places === 1) return 'место';
      if (places <= 4) return 'места';
      return 'мест';
    }
  }
};
</script>

<style scoped>
.categories-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 36px;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 40px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.category-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #ecf0f1;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  border-color: #3498db;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
}

.category-header h2 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
}

.price {
  font-size: 22px;
  font-weight: bold;
  color:rgb(194, 42, 26);
}

.category-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #34495e;
}

.detail-icon {
  font-size: 16px;
}

.detail-item.available {
  color: #27ae60;
  font-weight: bold;
}

.category-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.amenity {
  background: #ecf0f1;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
}

.amenity.basic {
  background: #f8f9fa;
  color: #7f8c8d;
}

.select-btn {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.select-btn:hover:not(:disabled) {
  background: #2980b9;
}

.select-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  font-size: 18px;
  padding: 50px;
  color: #7f8c8d;
}

/* Модальное окно */
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
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ecf0f1;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
}

.close-btn:hover {
  color: #e74c3c;
}

.modal-body {
  padding: 20px;
}

.category-info {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 20px;
}

.category-info span {
  font-weight: bold;
  color: #2c3e50;
}

.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.room-number {
  font-weight: bold;
  font-size: 18px;
  color: #2c3e50;
}

.room-features {
  display: flex;
  gap: 8px;
  font-size: 18px;
}

.book-btn {
  padding: 8px 20px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.book-btn:hover {
  background: #219a52;
}

.loading-small {
  text-align: center;
  padding: 30px;
  color: #7f8c8d;
}

.no-rooms {
  text-align: center;
  padding: 30px;
  color: #e74c3c;
}
</style>