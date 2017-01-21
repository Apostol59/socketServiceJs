# socketServiceJs
Серверная приложенька для передачи персональных и общих сообщений подписчикам; socket.io, node js;

Меняем порт, запускаем на сервачке, подключаем клиентов на тот же порт, счастье.
Клиент на .Net будет выглядеть так:
Ставим библиотечку [SocketIoClientDotNet](http://www.nuget.org/packages/SocketIoClientDotNet) из нугета, пишем:
```c#
            var socket = IO.Socket("http://localhost:1337");
            
            socket.On("sharedMessage", (data) =>
            {
                System.Console.WriteLine(data);
            });
            socket.On("privateMessage", (data) =>
            {
                //приходит json объект, для простоты здесь - dynamic, 
                //лучше использовать десериализаторы
                var dynamicData =  (dynamic)data;
                var message = dynamicData.message;
                var from = dynamicData.from;
                System.Console.WriteLine("Message: {0}, from: {1}", message, from);
            });
            socket.On("admin", data =>
            {
                System.Console.WriteLine(data);
            });
            //восстановление id при разрыве соединения/падении сервиса
            socket.On("init", ()=>
            {
                 socket.Emit("init", "someUserId");
                 System.Console.WriteLine("init");
            });
            
            //если требуется незамедлительное использование
            socket.Emit("init", "someUserId");
            //сообщение init для всех,
            //все, подписанные, на init пошлют свои id
            socket.Emit("admin","reInit");
            socket.Emit("admin", "getActiveIds");
            socket.Emit("privateMessage", "some text", "otherUser");
            socket.Emit("sharedMessage", "Yeachhhh");
            
```
