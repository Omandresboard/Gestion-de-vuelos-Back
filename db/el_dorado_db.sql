-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-03-2024 a las 17:43:14
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `el_dorado_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aerolinea`
--

CREATE TABLE `aerolinea` (
  `codaerolinea` int(11) NOT NULL,
  `descripcion` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `aerolinea`
--

INSERT INTO `aerolinea` (`codaerolinea`, `descripcion`) VALUES
(1, 'Avianca'),
(2, 'SATENA'),
(3, 'Wingo'),
(4, 'LATAM'),
(5, 'Ultra Air'),
(6, 'EASYFLY');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destino`
--

CREATE TABLE `destino` (
  `coddestino` int(11) NOT NULL,
  `descripcion` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `destino`
--

INSERT INTO `destino` (`coddestino`, `descripcion`) VALUES
(1, 'Armenia'),
(2, 'Barranquilla'),
(3, 'Cali'),
(4, 'Cartagena'),
(5, 'Medellin'),
(6, 'Santa Martha'),
(7, 'San Andres Isla');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pasajero`
--

CREATE TABLE `pasajero` (
  `id` int(11) NOT NULL,
  `identificacion` bigint(12) NOT NULL,
  `nombres` varchar(191) NOT NULL,
  `apellidos` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `telefono` bigint(9) NOT NULL,
  `codvuelo` varchar(6) NOT NULL,
  `foto` varchar(191) DEFAULT 'No-picture.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `username`, `password`, `token`) VALUES
(1, 'Admin', '$2b$16$suiNo5cvvuJS7uaKWQ0nKO1K2eyE8y01a0K4XBbQqyMgjH4TLIFyK', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwiaWF0IjoxNzEwNTA0MjIxLCJleHAiOjE3MTMwOTYyMjF9.XaJECHBcJmr1QrTDl7-nCp2Qv2pPcYeaIMsYTSBqK28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vuelo`
--

CREATE TABLE `vuelo` (
  `codvuelo` varchar(6) NOT NULL,
  `coddestino` int(11) NOT NULL,
  `codaerolinea` int(11) NOT NULL,
  `salaabordaje` varchar(30) NOT NULL,
  `horasalida` time NOT NULL,
  `horallegada` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vuelo`
--

INSERT INTO `vuelo` (`codvuelo`, `coddestino`, `codaerolinea`, `salaabordaje`, `horasalida`, `horallegada`) VALUES
('5D5J8D', 3, 5, 'A3', '00:00:04', '13:00:08'),
('7G1Q2S', 3, 1, 'A2', '06:00:38', '07:00:43');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aerolinea`
--
ALTER TABLE `aerolinea`
  ADD PRIMARY KEY (`codaerolinea`);

--
-- Indices de la tabla `destino`
--
ALTER TABLE `destino`
  ADD PRIMARY KEY (`coddestino`);

--
-- Indices de la tabla `pasajero`
--
ALTER TABLE `pasajero`
  ADD PRIMARY KEY (`id`),
  ADD KEY `codvuelo` (`codvuelo`) USING BTREE;

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `vuelo`
--
ALTER TABLE `vuelo`
  ADD PRIMARY KEY (`codvuelo`),
  ADD KEY `coddestino` (`coddestino`),
  ADD KEY `codaerolinea` (`codaerolinea`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aerolinea`
--
ALTER TABLE `aerolinea`
  MODIFY `codaerolinea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `destino`
--
ALTER TABLE `destino`
  MODIFY `coddestino` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `pasajero`
--
ALTER TABLE `pasajero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pasajero`
--
ALTER TABLE `pasajero`
  ADD CONSTRAINT `pasajero_ibfk_1` FOREIGN KEY (`codvuelo`) REFERENCES `vuelo` (`codvuelo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `vuelo`
--
ALTER TABLE `vuelo`
  ADD CONSTRAINT `vuelo_ibfk_1` FOREIGN KEY (`coddestino`) REFERENCES `destino` (`coddestino`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vuelo_ibfk_2` FOREIGN KEY (`codaerolinea`) REFERENCES `aerolinea` (`codaerolinea`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
