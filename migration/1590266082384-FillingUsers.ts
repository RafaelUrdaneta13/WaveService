import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class FillingUsers1590266082384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    /*await queryRunner.query(
      `INSERT INTO user (firstName, lastName, userName, email, password, birthday, isActive) VALUES ('Paola', 'Outeda', 'paolaouteda', 'paolaouteda@gmail.com', '2fb54875d166ab45a6a8b21f1631dec573a8cf07', '1995-08-09 23:59:59', 1)`,
    );
    queryRunner.commitTransaction();*/

    await queryRunner.query(`CREATE TABLE  color  (
       id  int NOT NULL AUTO_INCREMENT,
       color  varchar(255) NOT NULL,
      PRIMARY KEY ( id )
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`);

    await queryRunner.query(`CREATE TABLE category (
       id  int NOT NULL AUTO_INCREMENT,
       name  varchar(255) NOT NULL,
       colorId  int DEFAULT NULL,
      PRIMARY KEY ( id ),
      UNIQUE KEY  REL_ca0e41a0f5f048595e7a2dfda4  ( colorId ),
      CONSTRAINT  FK_ca0e41a0f5f048595e7a2dfda4d  FOREIGN KEY ( colorId ) REFERENCES  color  ( id )
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`);

    await queryRunner.query(`CREATE TABLE user (
      email varchar(255) NOT NULL,
      firstName varchar(255) NOT NULL,
      lastName varchar(255) NOT NULL,
      userName varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      birthday datetime NOT NULL,
      role enum('admin','normal','premium') NOT NULL DEFAULT 'normal',
      image varchar(255) DEFAULT NULL,
      isActive tinyint NOT NULL DEFAULT '1',
      PRIMARY KEY (email),
      UNIQUE KEY IDX_da5934070b5f2726ebfd3122c8 (userName)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`CREATE TABLE  content_category  (
     id  int NOT NULL AUTO_INCREMENT,
     title  varchar(255) NOT NULL,
     imagen  varchar(255) NOT NULL,
     text  varchar(255) NOT NULL,
     link  varchar(255) NOT NULL,
     categoryId  int DEFAULT NULL,
    PRIMARY KEY ( id ),
    KEY  FK_4459c498ae162e02c1522697daa  ( categoryId ),
    CONSTRAINT  FK_4459c498ae162e02c1522697daa  FOREIGN KEY ( categoryId ) REFERENCES  category  ( id )
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE  sub_category  (
     id  int NOT NULL AUTO_INCREMENT,
     name  varchar(255) NOT NULL,
     categoryId  int DEFAULT NULL,
    PRIMARY KEY ( id ),
    KEY  FK_3fc84b9483bdd736f728dbf95b2  ( categoryId ),
    CONSTRAINT  FK_3fc84b9483bdd736f728dbf95b2  FOREIGN KEY ( categoryId ) REFERENCES  category  ( id )
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE content_subcategory (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL,
      imagen varchar(255) NOT NULL,
      text varchar(255) NOT NULL,
      link varchar(255) NOT NULL,
      subCategoryId int DEFAULT NULL,
      PRIMARY KEY (id),
      KEY FK_74a238fdd935df699916df472f5 (subCategoryId),
      CONSTRAINT FK_74a238fdd935df699916df472f5 FOREIGN KEY (subCategoryId) REFERENCES sub_category (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE forum (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL,
      image varchar(255) DEFAULT NULL,
      subCategoryId int DEFAULT NULL,
      PRIMARY KEY (id),
      KEY FK_83186d94550346daa2dd7986add (subCategoryId),
      CONSTRAINT FK_83186d94550346daa2dd7986add FOREIGN KEY (subCategoryId) REFERENCES sub_category (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE post (
      id int NOT NULL AUTO_INCREMENT,
      text varchar(255) NOT NULL,
      isReported tinyint NOT NULL DEFAULT '0',
      forumId int DEFAULT NULL,
      userEmail varchar(255) DEFAULT NULL,
      PRIMARY KEY (id),
      KEY FK_c677952115eaa26692f819235cd (forumId),
      KEY FK_b6a3397e33ab179a2c7d64705b9 (userEmail),
      CONSTRAINT FK_b6a3397e33ab179a2c7d64705b9 FOREIGN KEY (userEmail) REFERENCES user (email),
      CONSTRAINT FK_c677952115eaa26692f819235cd FOREIGN KEY (forumId) REFERENCES forum (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE sub_category_users_user (
      subCategoryId int NOT NULL,
      userEmail varchar(255) NOT NULL,
      PRIMARY KEY (subCategoryId,userEmail),
      KEY IDX_bc443aff62a3db3785b356c12e (subCategoryId),
      KEY IDX_e625771913ed1c3b90e7bab620 (userEmail),
      CONSTRAINT FK_bc443aff62a3db3785b356c12e7 FOREIGN KEY (subCategoryId) REFERENCES sub_category (id) ON DELETE CASCADE,
      CONSTRAINT FK_e625771913ed1c3b90e7bab6208 FOREIGN KEY (userEmail) REFERENCES user (email) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE forum_users_user (
    forumId int NOT NULL,
    userEmail varchar(255) NOT NULL,
    PRIMARY KEY (forumId,userEmail),
    KEY IDX_adb18210c64f151a82bd1548d6 (forumId),
    KEY IDX_e9a460ffe92496da9f198be89f (userEmail),
    CONSTRAINT FK_adb18210c64f151a82bd1548d6a FOREIGN KEY (forumId) REFERENCES forum (id) ON DELETE CASCADE,
    CONSTRAINT FK_e9a460ffe92496da9f198be89fd FOREIGN KEY (userEmail) REFERENCES user (email) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE post_users_user (
    postId int NOT NULL,
    userEmail varchar(255) NOT NULL,
    PRIMARY KEY (postId,userEmail),
    KEY IDX_d910e0368cef95f0ad01aebe6b (postId),
    KEY IDX_d82e076ed3e78afe90b201e817 (userEmail),
    CONSTRAINT FK_d82e076ed3e78afe90b201e8172 FOREIGN KEY (userEmail) REFERENCES user (email) ON DELETE CASCADE,
    CONSTRAINT FK_d910e0368cef95f0ad01aebe6ba FOREIGN KEY (postId) REFERENCES post (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user')
      .values({
        firstName: 'Paola',
        lastName: 'Outeda',
        userName: 'paolaouteda',
        email: 'paolaouteda@gmail.com',
        password: '8b959c05562f6b3f925b957b1984960049d35983',
        birthday: '1995-08-09 23:59:59',
        image: null,
      })
      .execute();

    await queryRunner.query(`INSERT INTO wave.color (color) VALUES ('azul');`);
    await queryRunner.query(`INSERT INTO wave.color (color) VALUES ('verde');`);

    await queryRunner.query(
      `INSERT INTO wave.category (name, colorId) VALUES ('Películas', '1');`,
    );

    await queryRunner.query(
      `INSERT INTO wave.category (name, colorId) VALUES ('Libros', '2');`,
    );
    await queryRunner.query(
      `INSERT INTO wave.sub_category (name, categoryId) VALUES ('Harry Potter', '1');`,
    );
    await queryRunner.query(`INSERT INTO wave.sub_category (name, categoryId) VALUES ('Misterio', '2');
      `);
    await queryRunner.query(`INSERT INTO wave.forum (title, subCategoryId) VALUES ('Hermione is the best', '1');
      `);
    await queryRunner.query(`INSERT INTO wave.forum (title, subCategoryId) VALUES ('El profesor de john katzenbach', '2');
      `);
    await queryRunner.query(`INSERT INTO wave.sub_category_users_user (subCategoryId, userEmail) VALUES ('1', 'paolaouteda@gmail.com');
      `);
    await queryRunner.query(
      `INSERT INTO wave.content_category (id, title, imagen, text,link, categoryId) VALUES ('1', 'Libros de Calidad', 'https://i0.wp.com/lapalabra.gt/wp-content/uploads/2018/11/gravity-falls-diario-3-journal-3-entrega-inmediata-D_NQ_NP_808015-MLC25201571264_122016-O.jpg?w=1042', 'Aqui podras conseguir personas con quien compartir la maravillosa aventura de la lectura no olvides visitar la pagina y seguir nutriendo tu lectura', 'https://freeditorial.com/es/books/search', '2');`,
    );

    await queryRunner.query(
      `INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subcategoryId) VALUES ('1', 'Los personajes de Harry Potter', 'https://i.pinimg.com/originals/8a/52/2f/8a522f51807ba20a615cbd02c85eb6b5.jpg', 'Aqui hablaremos sobre los distintos personajes de una de las mejores libros de Magia que existe, en el link podras descargar la coleccion completa en pdf', 'ftp://186.67.225.38/Harry%20Potter.%20%20%20%20%20%20%20%20%20%20%20La%20coleccion%20completa%20-%20J.%20K.%20Rowling.pdf', '1');`,
    );

    await queryRunner.query(
      `INSERT INTO wave.content_category (id ,title ,imagen ,text ,link ,categoryId) VALUES ('2', 'Peliculas en 1080p', 'https://cdnmundo1.img.sputniknews.com/img/106290/75/1062907509_0:185:1024:738_1000x541_80_0_0_e7a171cb66555c14c2cb282c9eb61f48.jpg', 'Revive y comparte tus momentos preferidos de tu top de peliculas favoritas y no te pierdas esta pagina donde podras conseguir tus peliculas en una buena calidad', 'https://cuevana3.io/', '1');`,
    );

    await queryRunner.query(
      `INSERT INTO wave.content_subcategory (id,title,imagen,text,link,subCategoryId) VALUES ('2', 'Libros de Misterio', 'https://i.pinimg.com/564x/fc/30/a5/fc30a5269167b32e5cdab0aa8e438261.jpg', 'Comparte con los demás usuarios el libro que te puso los pelos de punta', 'https://okdiario.com/lista/8-mejores-libros-misterio-4568368', '2');`,
    );

    /*

    await queryRunner.query(`INSERT INTO wave.category (id, name, colorId) VALUES ('3', 'VideoJuegos', '1');`)

    await queryRunner.query(`INSERT INTO wave.category (id, name, colorId) VALUES ('4', 'Anime', '1');`)

    await queryRunner.query(`INSERT INTO wave.category (id, name, colorId) VALUES ('5', 'Rumba', '1');`)

    await queryRunner.query(`INSERT INTO wave.category (id, name, colorId) VALUES ('6', 'Música', '1');`)

    await queryRunner.query(`INSERT INTO wave.category (id, name, colorId) VALUES ('7', 'Cocina', '1');`)

    await queryRunner.query(`INSERT INTO wave.category (id, name, colorId) VALUES ('8', 'Deporte', '1');`)

    await queryRunner.query(`INSERT INTO wave.category (id, name, colorId) VALUES ('9', 'Computer Science', '1');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('4', 'Plataformas', '3');`)
    
    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('3', 'Shooter', '3');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('5', 'MMORPG', '3');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('6', 'Aventuras', '3');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('7', 'Shonen', '4');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('8', 'Mecha', '4');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('9', 'Gore', '4');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('10', 'Seinen', '4');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('11', 'Shojo', '4');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('12', 'Baile', '5');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('13', 'Juegos', '5');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('14', 'Confesiones', '5');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('15', 'Bebidas', '5');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('16', 'Reggueton', '6');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('17', 'Rock', '6');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('18', 'Trap', '6');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('19', 'Pop', '6');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('20', 'Carnes', '7');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('21', 'Sopas', '7');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('22', 'Dulces', '7');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('23', 'Fútbol', '8');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('24', 'Basket', '8');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('25', 'Rugby', '8');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('26', 'Tennis', '8');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('27', 'Vegana', '7');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('28', 'Web Development', '9');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('29', 'Machine Learning', '9');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('30', 'Algorithms', '9');`)

    await queryRunner.query(`INSERT INTO wave.sub_category (id, name, categoryId) VALUES ('31', 'Data Structures', '9');`)

   // Falta Colocar en el Insert INTO la imagen y colocar el Url

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('90', 'Que debes aprender primero', '31');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('89', 'Estructura del Semaforo', '31');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('88', 'Funcionalidad de Colas y Pilas', '31');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('87', 'Datos interesantes de Algoritmos famosos', '30');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('86', 'Algoritmos de Compresión', '30');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('85', 'Funcionalidad de Fibonacci', '30');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('84', 'Deseo conocer el tema, ¿cursos gratuitos?', '29');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('83', 'Avances', '29');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('82', 'Preguntas Frecuentes', '29');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('81', 'Metodología Scrum', '28');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('80', 'Cursos de Angular', '28');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('79', 'Cursos de Html/Css/Js', '28');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('78', 'Quiero ser tenista, ¿Cómo debo entrenar?', '26');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('77', 'Jugador favorito del US Open', '26');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('76', '¿Rafael Nadal seguira 10 años más?', '26');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('75', 'Entrenamientos frecuentes', '25');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('74', 'El equipo de mi universidad es el mejor', '25');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('73', 'Lesiones comunes', '25');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('72', 'Entrenamientos para mejorar en el Basket', '24');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('71', 'Ningun partido como el de Space Jam', '24');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('70', 'Aún lloro por Kobe Bryant', '24');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('69', 'Venezuela ira al mundial del 2022', '23');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('68', 'La chilena de Salomon Rondon', '23');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('67', 'Messi es mejor que Cristiano', '23');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('66', 'Cumplo Aniversario con mi esposo, ¿qué puedo preparar?', '22');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('65', 'El Chololate como lenguaje de amor', '22');`)

    await queryRunner.query( `INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('64', 'Receta de Suspiros', '22');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('63', 'no hay nada como el Mondongo', '21');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('62', '¿Cómo hacer sopa de murcielago?', '21');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('61', 'Días para comer sopa', '21');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('60', 'Receta de Pollo Agridulce', '20');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('59', 'Receta de Sushi', '20');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('58', '¿Como cocinar un murcielago?', '20');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('57', 'Pasos para ser cada día más Vegano', '27');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('56', 'Como cocinar la Berenjena', '27');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('55', 'Limpia tu cuerpo', '27');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('54', 'El amor de Camilo y Evaluna Montaner es Perfecto', '19');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('53', '¿Crees que Michael Jackson abuso de niños?', '19');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('52', 'Chayanne es Inmortal', '19');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('51', 'Como hacer una Bateria de Trap en FlStudio', '18');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('50', 'El Trap Venezolano', '18');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('49', 'El nuevo disco de Bad Bunny', '18');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('48', 'Nada mejor que cantarle Sufre mamon a el chamo que te quito a tu novia', '17');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('47', 'Mi Playlist de rock', '17');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('46', 'Lasso y su cambio de rock a reggueton y reggueton a rock', '17');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('45', '¿Cual es esa canción que te motiva a bailar toda la noche?', '16');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('44', '¿Habrá una canción más pegadisa que Despacito?', '16');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('43', 'El ultimo disco de JBalvin', '16');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('42', '¿Anis o Canelita?', '15');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('41', 'Recomiendaciones de Bebidas', '15');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('40', 'Sol y Luna (Ron con Anis)', '15');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('39', 'Salta o Besa', '14');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('38', '31 de diciembre - 11:52 pm', '14');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('37', 'Primera Borrachera', '14');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('36', 'Jugar Fifa apostando trago es peor que cualquier juego comun', '13');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('35', '¿Cómo juegas tu Trident?', '13');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('34', 'Recomendaciones de Juegos', '13');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('33', 'Canciones para prender tu fiesta', '12');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('32', 'Bailar Bachata enamora más que bailar merengue', '12');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('31', 'Pasos para bailar con la niña que me llama la atención', '12');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('30', 'No me gusta la Remasterización de Sailor Moon', '11');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('29', 'Quisiera poder decir "Abajo" a mi novio como Aome a Inuyasha', '11');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('28', 'Sakura se merece quedar con Shaoran', '11');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('27', '¿Que significa Seinen?', '10');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('26', '¿Quién más espera otra  temporada de Hellsing?', '10');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('25', 'Recomendaciones', '10');`)
    
    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('24', 'Noticia Shingeki no Kyojin animará todo el manga en su temporada final', '9');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('23', 'Yukki no merecia ganar en Mirai Nikki', '9');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('22', '¿Saldra la 2da temporada de High School of the Dead?', '9');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('21', '¿Con cual se divirtieron más Mazinger Z o Medabots', '8');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('20', '¿Creen que veremos volar una vez a Astroboy?', '8');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('19', '¿Como ver Evangelion?', '8');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('18', '¿Reacciones del nuevo trailer de Kitmesu no Yaiba?', '7');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('17', '¿Cual es tu carta de Yugioh favorita?', '7');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('16', '¿Goku o Naruto?', '7');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('15', '¿Recomendaciones de Juegos de para esta cuarentena?', '6');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('14', '¿Enemigos que traumaron su infancia?', '6');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('13', 'Minecraft un juego para arquitectos', '6');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('12', '¿El Mejor juego que haz jugado MMORPG?', '5');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('11', '¿Como llegar rapido al Reset en MuPLC?', '5');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('10', '¿A quíen mas le fastidia la publicidad de "Eve Online de Youtube?"', '5');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('9', '¿Sabías que Crash no es un perro? ', '4');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('8', 'Sugerencias de niveles dificiles en Mario Maker', '4');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('7', 'Limbo un juego para no dormir ', '4');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('6', '¿Cual ha sido la mejor Kill que has hecho en Fornite', '3');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('5', 'Gta V el mejor de la saga', '3');`)

    await queryRunner.query(`INSERT INTO wave.forum (id, title, subCategoryId) VALUES ('4', '¿Destiny o Halo? ', '3');`)
    
    // Faltan Imagen y Text
    await queryRunner.query(`INSERT INTO wave.content_category (id, title, imagen, text, link, categoryId) VALUES ('3', 'El lugar ideal para un Gamer', ' ', 'Descubre secretos de tus videojuegos favoritos y comparte la experiencia mientras jugabas', ' ', '3');`)

    await queryRunner.query(`INSERT INTO wave.content_category (id, title, imagen, text, link, categoryId) VALUES ('4', 'Rompe el Sello y cruza al portal del anime ', ' ', 'Aprende y comparte más sobre tu anime favorito', ' ', '4');`)

    await queryRunner.query(`INSERT INTO wave.content_category (id, title, imagen, text, link, categoryId) VALUES ('5', 'Proyecto X', ' ', 'La vida es mejor cuando rumbiamos con los amigos, ven y cuentanos tus experiencias', ' ', '5');`)

    await queryRunner.query(`INSERT INTO wave.content_category (id, title, imagen, text, link, categoryId) VALUES ('6', 'Música', ' ', 'No todo se todo se resume en un Do-Mi-Sol ven y aprende un poco más', ' ', '6');`)

    await queryRunner.query(`INSERT INTO wave.content_category (id, title, imagen, text, link, categoryId) VALUES ('7', 'Recetas Cocina', ' ', 'Prepara las mejores recetas de cocina y comparte tus platillos favoritos', ' ', '7');`)

    await queryRunner.query(`INSERT INTO wave.content_category (id, title, imagen, text, link, categoryId) VALUES ('8', 'Bienvenido Atleta', ' ', 'Revive tus momentos favoritos y sigue entrenando para alcanzar el nivel de tu atleta favorito', ' ', '8');`)

    await queryRunner.query(`INSERT INTO wave.content_category (id, title, imagen, text, link, categoryId) VALUES ('9', 'Computer Science', ' ', 'Domina los conocimientos sobre este tema entrando a nuestros foros, y aprovecha de compartir tus conocimientos', ' ', '9');`)
    //


    // Falta Todo
    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('12', 'Baile', ' ', ' ', ' ', '12');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('11', 'Shojo', ' ', ' ', ' ', '11');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('10', 'Seinen', ' ', ' ', ' ', '10');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('9', 'Gore', ' ', ' ', ' ', '9');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('8', 'Mecha', ' ', ' ', ' ', '8');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('7', 'Shonen', ' ', ' ', ' ', '7');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('6', 'Aventura', ' ', ' ', ' ', '6');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('5', 'MMORPG', ' ', ' ', ' ', '5');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('4', 'Plataforma', ' ', ' ', ' ', '4');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('3', 'Shooter', ' ', ' ', ' ', '3');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('31', 'Data Structures', ' ', ' ', ' ', '31');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('30', 'Algorithms', ' ', ' ', ' ', '30');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('29', 'Machine Learning', ' ', ' ', ' ', '29');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('28', 'Web Development', ' ', ' ', ' ', '28');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('26', 'Tennis', ' ', ' ', ' ', '26');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('25', 'Rugby', ' ', ' ', ' ', '25');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('24', 'Basket', ' ', ' ', ' ', '24');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('23', 'Futbol', ' ', ' ', ' ', '23');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('22', 'Dulces', ' ', ' ', ' ', '22');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('21', 'Sopas', ' ', ' ', ' ', '21');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('20', 'Carnes', ' ', ' ', ' ', '20');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('27', 'Veganas', ' ', ' ', ' ', '27');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('19', 'Pop', ' ', ' ', ' ', '19');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('18', 'Trap', ' ', ' ', ' ', '18');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('17', 'Rock', ' ', ' ', ' ', '17');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('16', 'Reggueton', ' ', ' ', ' ', '16');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('15', 'Bebidas', ' ', ' ', ' ', '15');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('14', 'Confesiones', ' ', ' ', ' ', '14');`)

    await queryRunner.query(`INSERT INTO wave.content_subcategory (id, title, imagen, text, link, subCategoryId) VALUES ('13', 'Juegos', ' ', ' ', ' ', '13');`)
    //
    */
    // await queryRunner.query()
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DELETE FROM wave.user WHERE (email = 'paolaouteda@gmail.com')`,
    );
  }
}
