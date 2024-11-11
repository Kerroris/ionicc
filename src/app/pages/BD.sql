
CREATE TABLE con_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(50) NOT NULL,
    apellido_p varchar(50) NOT NULL,
    apellido_m varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    pass varchar(200) NOT NULL,
    img varchar(100) NULL,
    telefon varchar(10) NOT NULL
);

CREATE TABLE con_contactos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    nombre varchar(50) NOT NULL,
    apellido varchar(50) NULL,
    telefon varchar(15) NOT NULL,
    email varchar(50) NULL,
    img varchar(100) NULL,
    direccion varchar(100) NULL,
    cumple DATE NULL,
    nota varchar(500) NULL,
    FOREIGN KEY (id_user) REFERENCES con_users (id) ON DELETE CASCADE
);

CREATE TABLE con_recordatorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_contacto INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    mensaje varchar(250) NULL,
    tipo ENUM('cumpleaños', 'evento', 'llamada', 'otro') DEFAULT 'otro',
    FOREIGN KEY (id_contacto) REFERENCES con_contactos (id) ON DELETE CASCADE
);
