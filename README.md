# RSOI-course [![Build Status](https://travis-ci.org/sergkukuev/RSOI-course.svg?branch=master)](https://travis-ci.org/sergkukuev/RSOI-course)
Simple web application based on microservice architecture for one of the university courses

herokuapp: https://rsoi-course.herokuapp.com/


### Установка локальной версии очереди RabbitMQ
1. Скачать и установить последнюю версию Erlang: <br>
http://www.erlang.org/download.html

2. Скачать и установить последнюю версию RabbitMQ: <br>
https://www.rabbitmq.com/install-windows.html

3. В установленной директории RabbitMQ создать две папки: <br>
conf — для конфига — <br>
C:\Program Files (x86)\RabbitMQ Server\rabbitmq_server-3.3.5\conf <br>
base — база данных и логи — <br>
C:\Program Files (x86)\RabbitMQ Server\rabbitmq_server-3.3.5\base <br>
В папку conf положить конфиг файл (взять из etc) и переименовать его в rabbitmq.config

4. Установить переменные окружения для <br>
— конфига — RABBITMQ_CONFIG_FILE <br>
C:\Program Files (x86)\RabbitMQ Server\rabbitmq_server-3.3.5\conf\rabbitmq <br>
— логов и базы данных — RABBITMQ_BASE <br>
C:\Program Files (x86)\RabbitMQ Server\rabbitmq_server-3.3.5\base <br>
Детали здесь https://www.rabbitmq.com/relocate.html

5. Проверить не занят ли порт по умолчанию командой
netstat -ano | find "5672" <br>
Последнее число при выводе покажет ID процесса, который занял порт. <br>
Если порт занят, заменить на другой в конфиге rabbitmq.config: <br>
{tcp_listeners, [{"127.0.0.1", 5673},{"::1", 5673}]}

6. Переустановить RabbitMQ сервис, чтобы изменения вступили в силу.

7. Запустить сервис (из папки sbin) <br>
rabbitmq-service.bat

8. Проверить статус (из папки sbin) <br>
rabbitmqctl.bat status

9. Установить менеджмент плагин командой <br>
rabbitmq-plugins.bat enable rabbitmq_management

10. Рестартуем сервис RabbitMQ
rabbitmq-service.bat stop
rabbitmq-service.bat start

11. Заходим в админку RabbitMQ: <br>
http://localhost:15672 <br>
(guest/guest)
