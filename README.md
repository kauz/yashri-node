# Artyom Popov homework: [t.me/kauzlein](t.me/kauzlein)


Проект, включая предыдущие домашние задания, переписан под окружение node.js с использованием Express.
При разработке использовался node.js версии v8.12.0. Javascript собирается с помощью Webpack, SCSS код компилирется на лету с использованием node-sass-middleware. В качестве шаблонизатора выбрал pug.


Установка:

1. Для разворачивания проекта необходимо установить node.js версии 8 или выше, затем склонировать репозиторий.

        $ git clone https://github.com/kauzlein/YASHRI-2018.git

2. После разворачивания проекта, перейти в локальную директорию и с помощью пакетного менеджера установить все зависимости.

        $ npm i

3. Для запуска сервера используются следующие скрипты:

        $ npm run dev - Запускает сервер в development-режиме (необходим nodemon).
        $ npm run watch - Запускает сборку bundle в development-режиме.
        $ npm run start - Запускает сервер в production-режиме.
        $ npm run build - Запускает сборке bundle в production-режиме.