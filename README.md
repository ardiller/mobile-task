# Задание

Разработать приложение для работы с набором точек. У кажой точки есть:

 - название (`title`);
 - необязательно описание (`desc`);
 - широта (`lat`);
 - долгота (`lng`).

 Точки хранятся на сервере.

 Требуется реализовать:

  - отображение списка точек, отсортированного по убыванию расстояния
    от текущего положения;
  - отображение точек на карте;
  - отображение одной точки с описанием;
  - добавление точки;
  - удаление точки;
  - редактирование точки.

Для выполнения задания можно использовать любые библиотеки.
Результат нужно выложить на Github.

# Сервер
## Установить node.js

https://nodejs.org

## Запуск сервера

```bash
npm install
npm start
```

Сервер запускается на порту 3000.

## API
### Добавление точки

```
POST http://localhost:3000/points
Content-Type: application/json

{ "title": "Point 1", "desc": "Cool point", "lat": 0.0, "lng": 0.0 }
```

### Получение всех точек

```
GET http://localhost:3000/points
```

Не содержит поля `desc`.

### Получение одной точки

```
GET http://localhost:3000/points/:point_id
```

Содержит все поля.

### Удаление точки

```
DELETE http://localhost:3000/points/:point_id
```

### Обновление точки

```
PUT http://localhost:3000/points/:point_id
Content-Type: application/json

{ "title": "Point 1", "desc": "Cool point", "lat": 0.0, "lng": 0.0 }
```
