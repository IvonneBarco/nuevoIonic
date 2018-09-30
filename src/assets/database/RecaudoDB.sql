--BEGIN TRANSACTION;

-- Table: tasignaciondependiente
CREATE TABLE IF NOT EXISTS tasignaciondependiente (
    pkidsqlite                INTEGER PRIMARY KEY AUTOINCREMENT,
    pkidasignaciondependiente INTEGER NOT NULL,
    fkidtercero               INTEGER NOT NULL,
    fkidasignacionpuesto      INTEGER NOT NULL
);


-- Table: tconfiguracion
CREATE TABLE IF NOT EXISTS tconfiguracion (
    pkidsqlite         INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidconfiguracion  INTEGER       NOT NULL,
    claveconfiguracion VARCHAR (225) NOT NULL,
    valorconfiguracion VARCHAR (225) NOT NULL
);


-- Table: tusuario
CREATE TABLE IF NOT EXISTS tusuario (
    pkidsqlite     INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidusuario    INTEGER       NOT NULL,
    identificacion INTEGER       NOT NULL,
    nombreusuario  VARCHAR (225) NOT NULL,
    apellido       VARCHAR (225),
    usuarioactivo  VARCHAR (5)   NOT NULL,
    fkidrol        INTEGER       NOT NULL,
    contrasenia    VARCHAR (225),
    rutaimagen     VARCHAR (225),
    numerorecibo   INTEGER       NOT NULL
);


-- Table: tequipo
CREATE TABLE IF NOT EXISTS tequipo (
    pkidsqlite           INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidequipo           INTEGER       NOT NULL,
    nombrequipo          VARCHAR (225) NOT NULL,
    identificacionequipo VARCHAR (225) NOT NULL
);


-- Table: tfactura
CREATE TABLE IF NOT EXISTS tfactura (
    pkidsqlite                 INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidfactura                INTEGER       NOT NULL,
    numerofactura              VARCHAR (225) NOT NULL,
    nombrebeneficiario         VARCHAR (225) NOT NULL,
    identificacionbeneficiario VARCHAR (225) NOT NULL,
    saldoasignacion            DOUBLE        NOT NULL,
    tarifapuesto               DOUBLE        NOT NULL,
    valorcuotaacuerdo          DOUBLE        NOT NULL,
    valormultas                DOUBLE        NOT NULL,
    saldomultas                DOUBLE        NOT NULL,
    mesfacturaletras           VARCHAR (255) NOT NULL,
    fkidasignacionpuesto       INTEGER       NOT NULL,
    facturapagada              VARCHAR (5)   NOT NULL,
    year                       INTEGER       NOT NULL,
    saldoacuerdo               DOUBLE        NOT NULL,
    nombrepuesto               VARCHAR (255),
    fkidplaza                  INTEGER       NOT NULL,
    fkidzona                   INTEGER       NOT NULL,
    fkidsector                 INTEGER       NOT NULL,
    nombreplaza                VARCHAR (255),
    nombrezona                 VARCHAR (255),
    nombresector               VARCHAR (255),
    mesfacturanumero           INTEGER       NOT NULL,
    fkidpuesto                 INTEGER       NOT NULL,
    fkidacuerdo                INTEGER,
    cuotasIncumplidas          INTEGER       NOT NULL,
    cuotasPagadas              INTEGER       NOT NULL,
    totalAPagarMes             DOUBLE        NOT NULL,
    saldodeuda                 DOUBLE        NOT NULL,
    saldodeudaAcuerdo          DOUBLE        NOT NULL,
    saldoporpagar              DOUBLE        NOT NULL,
    debemes                    INTEGER       NOT NULL,
    debeyear                   INTEGER       NOT NULL
);


-- Table: tparqueadero
CREATE TABLE IF NOT EXISTS tparqueadero (
    pkidsqlite          INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidparqueadero     INTEGER       NOT NULL,
    numeroparqueadero   VARCHAR (225) NOT NULL,
    fkidtipoparqueadero INTEGER       NOT NULL,
    fkidplaza           INTEGER       NOT NULL
);


-- Table: tplaza
CREATE TABLE IF NOT EXISTS tplaza (
    pkidsqlite  INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidplaza   INTEGER       NOT NULL,
    nombreplaza VARCHAR (225) NOT NULL
);


-- Table: tplazatiporecaudo
CREATE TABLE IF NOT EXISTS tplazatiporecaudo (
    pkidsqlite           INTEGER PRIMARY KEY AUTOINCREMENT,
    pkidplazatiporecaudo INTEGER NOT NULL,
    fkidplaza            INTEGER NOT NULL,
    fkidtiporecaudo      INTEGER NOT NULL
);


-- Table: tpuerta
CREATE TABLE IF NOT EXISTS tpuerta (
    pkidsqlite   INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidpuerta   INTEGER       NOT NULL,
    nombrepuerta VARCHAR (225) NOT NULL,
    fkidplaza    INTEGER       NOT NULL
);


-- Table: trecibopuestoeventual
CREATE TABLE IF NOT EXISTS trecibopuestoeventual (
    pkidsqlite                       INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidrecibopuestoeventual         INTEGER       NOT NULL,
    numerorecibopuestoeventual       VARCHAR (225) NOT NULL,
    valorecibopuestoeventual         DOUBLE        NOT NULL,
    creacionrecibopuestoeventual     DATETIME      NOT NULL,
    modificacionrecibopuestoeventual DATETIME      NOT NULL,
    fkidtarifapuestoeventual         INTEGER       NOT NULL,
    fkidtercero                      INTEGER,
    nombretercero                    VARCHAR (225),
    valortarifa                      DOUBLE        NOT NULL,
    nombreplaza                      VARCHAR (225),
    recibopuestoeventualactivo       VARCHAR (5)   NOT NULL,
    nombreusuario                    VARCHAR       NOT NULL,
    identificacionusuario            VARCHAR       NOT NULL,
    nombresector                     VARCHAR (225),
    fkidsector                       INTEGER,
    sincronizado                     INTEGER-- para controlar si fue sincronizado ya o no
);


-- Table: tsector
CREATE TABLE IF NOT EXISTS tsector (
    pkidsqlite     INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidsector     INTEGER       NOT NULL,
    nombresector   VARCHAR (225) NOT NULL,
    fkidplaza      INTEGER,
    fkidtiposector INTEGER       NOT NULL
);


-- Table: ttercero
CREATE TABLE IF NOT EXISTS ttercero (
    pkidsqlite            INTEGER       PRIMARY KEY AUTOINCREMENT,
    nombretercero         VARCHAR (225) NOT NULL,
    identificaciontercero VARCHAR (225) NOT NULL,
    telefonotercero       VARCHAR (225),
    creaciontercero       DATETIME      NOT NULL,
    modificaciontercero   DATETIME      NOT NULL,
    pkidtercero           INTEGER       NOT NULL,
    tipotercero           VARCHAR (225) NOT NULL
);


-- Table: ttipoanimal
CREATE TABLE IF NOT EXISTS ttipoanimal (
    pkidsqlite       INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidtipoanimal   INTEGER       NOT NULL,
    idtarifa         INTEGER       NOT NULL,
    tarifa           DOUBLE        NOT NULL,
    nombretipoanimal VARCHAR (225) NOT NULL
);


-- Table: ttiporecaudo
CREATE TABLE IF NOT EXISTS ttiporecaudo (
    pkidsqlite        INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidtiporecaudo   INTEGER       NOT NULL,
    nombretiporecaudo VARCHAR (255) NOT NULL,
    tiporecaudoactivo VARCHAR (5)   NOT NULL
);


-- Table: ttipovehiculo
CREATE TABLE IF NOT EXISTS ttipovehiculo (
    pkidsqlite         INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidtipovehiculo   INTEGER       NOT NULL,
    idtarifa           INTEGER       NOT NULL,
    tarifa             DOUBLE        NOT NULL,
    nombretipovehiculo VARCHAR (225) NOT NULL
);


-- Table: ttipoparqueadero
CREATE TABLE IF NOT EXISTS ttipoparqueadero (
    pkidsqlite            INTEGER       PRIMARY KEY AUTOINCREMENT,
    pkidtipoparqueadero   INTEGER       NOT NULL,
    idtarifa              INTEGER       NOT NULL,
    tarifa                DOUBLE        NOT NULL,
    nombretipoparqueadero VARCHAR (225) NOT NULL
);



-----------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------
--------------------------------------------------- DATOS DE PRUEBA ---------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------

/*
INSERT INTO tparqueadero (
                             pkidparqueadero,
                             numeroparqueadero,
                             fkidtipoparqueadero,
                             fkidplaza
                         )
                         VALUES (
                             1,
                             'Parqueadero',
                             1,
                             1
                         );

INSERT INTO tparqueadero (
                             pkidparqueadero,
                             numeroparqueadero,
                             fkidtipoparqueadero,
                             fkidplaza
                         )
                         VALUES (
                             2,
                             'Lote',
                             2,
                             1
                         );


INSERT INTO tplaza (
                       pkidplaza,
                       nombreplaza
                   )
                   VALUES (
                       1,
                       'POTRERILLO'
                   );


INSERT INTO tpuerta (
                        pkidpuerta,
                        nombrepuerta,
                        fkidplaza
                    )
                    VALUES (
                        1,
                        'Puerta Terminal',
                        1
                    );

INSERT INTO tpuerta (
                        pkidpuerta,
                        nombrepuerta,
                        fkidplaza
                    )
                    VALUES (
                        2,
                        'Puerta principal',
                        1
                    );


INSERT INTO tsector (
                        pkidsector,
                        nombresector,
                        fkidplaza,
                        fkidtiposector
                    )
                    VALUES (
                        1,
                        'AVES',
                        1,
                        1
                    );

INSERT INTO tsector (
                        pkidsector,
                        nombresector,
                        fkidplaza,
                        fkidtiposector
                    )
                    VALUES (
                        2,
                        'FRUTAS',
                        1,
                        1
                    );

INSERT INTO ttipoanimal (
                            pkidtipoanimal,
                            idtarifa,
                            tarifa,
                            nombretipoanimal
                        )
                        VALUES (
                            2,
                            3,
                            8000.0,
                            'Ganado mayor'
                        );

INSERT INTO ttipoanimal (
                            pkidtipoanimal,
                            idtarifa,
                            tarifa,
                            nombretipoanimal
                        )
                        VALUES (
                            1,
                            1,
                            4000.0,
                            'Ganado menor'
                        );


INSERT INTO ttipoparqueadero (
                                 pkidtipoparqueadero,
                                 idtarifa,
                                 tarifa,
                                 nombretipoparqueadero
                             )
                             VALUES (
                                 1,
                                 2,
                                 1000.0,
                                 'Normal'
                             );

INSERT INTO ttipoparqueadero (
                                 pkidtipoparqueadero,
                                 idtarifa,
                                 tarifa,
                                 nombretipoparqueadero
                             )
                             VALUES (
                                 2,
                                 4,
                                 20000.0,
                                 'Contrato'
                             );


INSERT INTO ttipovehiculo (
                              pkidtipovehiculo,
                              idtarifa,
                              tarifa,
                              nombretipovehiculo
                          )
                          VALUES (
                              1,
                              10,
                              1000.0,
                              'Camionetas hasta 2600 CC'
                          );

INSERT INTO ttipovehiculo (
                              pkidtipovehiculo,
                              idtarifa,
                              tarifa,
                              nombretipovehiculo
                          )
                          VALUES (
                              2,
                              13,
                              2000.0,
                              'Vehículos 350 y turbos'
                          );

INSERT INTO ttipovehiculo (
                              pkidtipovehiculo,
                              idtarifa,
                              tarifa,
                              nombretipovehiculo
                          )
                          VALUES (
                              3,
                              14,
                              3000.0,
                              'Camiones 6000 Cap. 12 Ton'
                          );

INSERT INTO ttipovehiculo (
                              pkidtipovehiculo,
                              idtarifa,
                              tarifa,
                              nombretipovehiculo
                          )
                          VALUES (
                              4,
                              15,
                              4000.0,
                              'Vehiculos Cap. 12 y 20 Ton'
                          );

INSERT INTO ttipovehiculo (
                              pkidtipovehiculo,
                              idtarifa,
                              tarifa,
                              nombretipovehiculo
                          )
                          VALUES (
                              5,
                              16,
                              5000.0,
                              'Vehículos Cap. Sup. 20 Ton'
                          );

INSERT INTO ttipovehiculo (
                              pkidtipovehiculo,
                              idtarifa,
                              tarifa,
                              nombretipovehiculo
                          )
                          VALUES (
                              6,
                              17,
                              1300.0,
                              'Camperos servicio rural'
                          );

INSERT INTO ttipovehiculo (
                              pkidtipovehiculo,
                              idtarifa,
                              tarifa,
                              nombretipovehiculo
                          )
                          VALUES (
                              7,
                              18,
                              1000.0,
                              'Servicio público autorizado'
                          );

INSERT INTO ttipovehiculo (
                              pkidtipovehiculo,
                              idtarifa,
                              tarifa,
                              nombretipovehiculo
                          )
                          VALUES (
                              8,
                              19,
                              1500.0,
                              'Vehículos particulares'
                          );



INSERT INTO tconfiguracion (
                               pkidconfiguracion,
                               claveconfiguracion,
                               valorconfiguracion
                           )
                           VALUES (
                               2,
                               'tarifaeventual',
                               '2500'
                           );

INSERT INTO tconfiguracion (
                               pkidconfiguracion,
                               claveconfiguracion,
                               valorconfiguracion
                           )
                           VALUES (
                               1,
                               'idtarifaeventual',
                               '1'
                           );



INSERT INTO tusuario (
                         pkidusuario,
                         identificacion,
                         nombreusuario,
                         apellido,
                         usuarioactivo,
                         fkidrol,
                         contrasenia,
                         rutaimagen,
                         numerorecibo
                     )
                     VALUES (
                         1,
                         8530210,
                         'Alberto',
                         'Flores',
                         'true',
                         0,
                         '123',
                         NULL,
                         1
                     );


INSERT INTO tplazatiporecaudo (
                                  pkidplazatiporecaudo,
                                  fkidplaza,
                                  fkidtiporecaudo
                              )
                              VALUES (
                                  2,
                                  1,
                                  2
                              );

INSERT INTO tplazatiporecaudo (
                                  pkidplazatiporecaudo,
                                  fkidplaza,
                                  fkidtiporecaudo
                              )
                              VALUES (
                                  1,
                                  1,
                                  1
                              );


INSERT INTO ttiporecaudo (
                             pkidtiporecaudo,
                             nombretiporecaudo,
                             tiporecaudoactivo
                         )
                         VALUES (
                             1,
                             'Puesto fijo',
                             '1'
                         );

INSERT INTO ttiporecaudo (
                             pkidtiporecaudo,
                             nombretiporecaudo,
                             tiporecaudoactivo
                         )
                         VALUES (
                             2,
                             'Puestos eventuales',
                             '1'
                         );

INSERT INTO ttiporecaudo (
                             pkidtiporecaudo,
                             nombretiporecaudo,
                             tiporecaudoactivo
                         )
                         VALUES (
                             3,
                             'Ingreso de vehículos',
                             '1'
                         );

INSERT INTO ttiporecaudo (
                             pkidtiporecaudo,
                             nombretiporecaudo,
                             tiporecaudoactivo
                         )
                         VALUES (
                             4,
                             'Animales',
                             '1'
                         );

INSERT INTO ttiporecaudo (
                             pkidtiporecaudo,
                             nombretiporecaudo,
                             tiporecaudoactivo
                         )
                         VALUES (
                             5,
                             'Pesaje',
                             '1'
                         );

INSERT INTO ttiporecaudo (
                             pkidtiporecaudo,
                             nombretiporecaudo,
                             tiporecaudoactivo
                         )
                         VALUES (
                             6,
                             'Parqueadero',
                             '1'
                         );


INSERT INTO ttercero (
                         nombretercero,
                         identificaciontercero,
                         telefonotercero,
                         creaciontercero,
                         modificaciontercero,
                         pkidtercero,
                         tipotercero
                     )
                     VALUES (
                         'Pedro Rojas',
                         '98010101',
                         '7202020',
                         '25/9/2018, 2:30:10 p.m',
                         '25/9/2018, 2:30:10 p.m',
                         '1',
                         'tipo tercero 1'
                     );
                     
INSERT INTO ttercero (
                         nombretercero,
                         identificaciontercero,
                         telefonotercero,
                         creaciontercero,
                         modificaciontercero,
                         pkidtercero,
                         tipotercero
                     )
                     VALUES (
                         'María Perez',
                         '59020202',
                         '7303030',
                         '25/9/2018, 2:30:10 p.m',
                         '25/9/2018, 2:30:10 p.m',
                         '2',
                         'tipo tercero 2'
                     );
*/
--COMMIT TRANSACTION;