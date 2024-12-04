DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS users;

CREATE TABLE flights (
	id SERIAL PRIMARY KEY,
	departure VARCHAR(30) NOT NULL,
	destination VARCHAR(30) NOT NULL,
	date TIMESTAMP NOT NULL,
	price NUMERIC(10, 2) NOT NULL,
	seats INTEGER NOT NULL
);

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	id_number BIGINT NOT NULL,
	user_name VARCHAR(30) NOT NULL,
	pass VARCHAR(30) NOT NULL,
	first_name VARCHAR(30) NOT NULL,
	last_name VARCHAR(30) NOT NULL,
	birthdate TIMESTAMP,
	registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
	flight_id INTEGER REFERENCES flights(id) ON DELETE CASCADE,
	status VARCHAR(30) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO flights (departure, destination, date, price, seats)
VALUES ('Liechtenstein', 'Belize', '2024-12-05 17:38:19.90987', 100, 10),
		('Congo', 'New Zealand', '2024-12-08 17:38:19.90987', 520, 10),
		('North Korea', 'Croatia', '2024-12-09 17:38:19.90987', 50, 10),
		('Finland', 'Morocco', '2024-12-12 17:38:19.90987', 50, 30),
		('Liberia', ' Somalia', '2025-02-02 17:38:19.90987', 40, 25),
		('Kuwait', 'Kyrgyzstan', '2025-01-04 17:38:19.90987', 250, 20),
		('Sweden', 'Uganda', '2025-01-12 17:38:19.90987', 330, 10),
		('Botswana', 'Eritrea', '2025-01-22 17:38:19.90987', 175, 15),
		('Cyprus', 'United States', '2024-12-09 17:38:19.90987', 55, 40),
		('South Africa', 'United States', '2024-12-15 17:38:19.90987', 90, 15),
		('Costa Rica', 'Canada', '2024-12-19 17:38:19.90987', 55, 50),
		('Qatar', 'San Marino', '2024-12-22 17:38:19.90987', 40, 20),
		('Malaysia', 'Kyrgyzstan', '2024-12-07 17:38:19.90987', 255, 10),
		('Micronesia', 'Malta', '2024-12-08 17:38:19.90987', 350, 50),
		('Tunisia', 'Laos', '2024-12-06 17:38:19.90987', 550, 20);

INSERT INTO users (id_number, user_name, pass, first_name, last_name)
VALUES (207226556, 'sce1', 'admin', 'sce_name', 'sce_lm');