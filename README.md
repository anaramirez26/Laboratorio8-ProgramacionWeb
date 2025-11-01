¿Cuál es la diferencia entre autenticación y autorizacion? 
R//Autenticacion, verifica la identidad del usuario y Autorizacion controla el acceso a acciones segun permisos. 
¿Cuál es la función del token JWT en la guía? 
R// El JWT es el pase que da el backend al iniciar sesion: lo guardo en el cliente y lo envio en cada petición en Authorization: Bearer ; el middleware lo verifica y, si es valido y no ha expirado, me deja entrar a las rutas protegidas segun mis permisos. Eso mantiene mi sesion sin estado y prueba quien soy en cada request.