import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к MySQL
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'Base_5',
    database: 'dbHotel'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Ошибка подключения к БД:', err);
        return;
    }
    console.log('✅ Подключено к MySQL');
});

// =====================================================
// API 1: Получить все номера (детально)
// =====================================================
app.get('/api/rooms', (req, res) => {
    const sql = `
        SELECT fidRoom, fCategory, fPlaces, fPrice, fStatus,
               fKitchen, fBar, fBalcony
        FROM tRooms
        ORDER BY fidRoom
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Ошибка запроса:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// =====================================================
// API 2: Получить уникальные категории номеров (для каталога)
// =====================================================
app.get('/api/categories', (req, res) => {
    const sql = `
        SELECT 
            fCategory,
            MIN(fPrice) AS fPrice,
            MIN(fPlaces) AS fPlaces,
            MAX(CASE WHEN fKitchen = 'Да' THEN 'Да' ELSE 'Нет' END) AS fKitchen,
            MAX(CASE WHEN fBar = 'Да' THEN 'Да' ELSE 'Нет' END) AS fBar,
            MAX(CASE WHEN fBalcony = 'Да' THEN 'Да' ELSE 'Нет' END) AS fBalcony,
            COUNT(fidRoom) AS total_rooms,
            SUM(CASE WHEN fStatus = 'Свободен' THEN 1 ELSE 0 END) AS available_rooms
        FROM tRooms
        GROUP BY fCategory
        ORDER BY 
            CASE fCategory
                WHEN 'Люкс' THEN 1
                WHEN 'Полулюкс' THEN 2
                WHEN 'Семейный' THEN 3
                WHEN 'Стандарт' THEN 4
                WHEN 'Эконом' THEN 5
                ELSE 6
            END
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Ошибка запроса:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('📊 Категории загружены:', results.map(r => ({
            category: r.fCategory,
            available: r.available_rooms
        })));
        res.json(results);
    });
});

// =====================================================
// API 3: Получить свободные номера в конкретной категории
// =====================================================
app.get('/api/categories/:category/rooms', (req, res) => {
    const { category } = req.params;
    const sql = `
        SELECT fidRoom, fPlaces, fPrice, fStatus, fKitchen, fBar, fBalcony
        FROM tRooms
        WHERE fCategory = ? AND fStatus = 'Свободен'
        ORDER BY fidRoom
    `;

    db.query(sql, [category], (err, results) => {
        if (err) {
            console.error('❌ Ошибка запроса:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// =====================================================
// Тестовый маршрут
// =====================================================
app.get('/api/test', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📋 Тестовый маршрут: http://localhost:${PORT}/api/test`);
    console.log(`🏨 Номера: http://localhost:${PORT}/api/rooms`);
    console.log(`📂 Категории: http://localhost:${PORT}/api/categories`);
});