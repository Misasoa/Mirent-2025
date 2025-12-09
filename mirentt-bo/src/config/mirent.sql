-- Final PostgreSQL Script for the Database Schema

-- Table: Type
-- Represents types of vehicles (e.g., Sedan, SUV, Van)
CREATE TABLE Type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Table: Vehicule
-- Represents individual vehicles available for reservation
CREATE TABLE Vehicule (
    id SERIAL PRIMARY KEY,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT,
    license_plate VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(100),
    daily_rate DECIMAL(10, 2) NOT NULL, -- Assuming a default daily rate
    type_id INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES Type(id)
);

-- Table: User
-- Represents system users, including clients and potentially administrators
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) DEFAULT 'client', -- e.g., 'client', 'admin'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Client
-- Represents clients who make reservations, linked to a User account
CREATE TABLE Client (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    driver_license_number VARCHAR(50) UNIQUE,
    user_id INT NOT NULL UNIQUE, -- One-to-one relationship with User
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "User"(id)
);

-- Table: Region
-- Represents geographical regions (e.g., states, provinces)
CREATE TABLE Region (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Table: District
-- Represents smaller geographical districts within regions
CREATE TABLE District (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES Region(id)
);

-- Table: Reservation
-- Represents a vehicle reservation made by a client
CREATE TABLE Reservation (
    id SERIAL PRIMARY KEY,
    reservation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- e.g., 'pending', 'confirmed', 'cancelled', 'completed'
    client_id INT NOT NULL,
    vehicule_id INT NOT NULL,
    pickup_location_id INT, -- Assuming this links to a District or a separate Location table
    return_location_id INT, -- Assuming this links to a District or a separate Location table
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Client(id),
    FOREIGN KEY (vehicule_id) REFERENCES Vehicule(id),
    -- Assuming pickup_location_id and return_location_id refer to District.
    -- If you have a dedicated 'Location' table, these FKs should point there.
    FOREIGN KEY (pickup_location_id) REFERENCES District(id),
    FOREIGN KEY (return_location_id) REFERENCES District(id)
);

-- Table: Prix (Price)
-- Represents pricing details for vehicles, potentially dynamic or time-based
CREATE TABLE Prix (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'EUR', -- Or your local currency
    valid_from DATE NOT NULL,
    valid_to DATE, -- Null if forever or ongoing
    vehicule_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicule_id) REFERENCES Vehicule(id)
);

-- Table: Status
-- Represents the various states/statuses for Proformas (e.g., 'draft', 'sent', 'paid', 'canceled')
CREATE TABLE Status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Table: Proforma
-- Represents a proforma invoice or quote for a reservation
CREATE TABLE Proforma (
    id SERIAL PRIMARY KEY,
    proforma_number VARCHAR(100) UNIQUE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    total_amount DECIMAL(10, 2) NOT NULL,
    reservation_id INT UNIQUE, -- One-to-one or zero-to-one with Reservation
    status_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES Reservation(id),
    FOREIGN KEY (status_id) REFERENCES Status(id)
);

-- Table: ProformaItem
-- Represents individual items or line items within a proforma
CREATE TABLE ProformaItem (
    id SERIAL PRIMARY KEY,
    item_description TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    sub_total DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    proforma_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proforma_id) REFERENCES Proforma(id)
);

-- Optional: Add indexes for performance on frequently queried columns
CREATE INDEX idx_vehicule_type_id ON Vehicule (type_id);
CREATE INDEX idx_client_user_id ON Client (user_id);
CREATE INDEX idx_district_region_id ON District (region_id);
CREATE INDEX idx_reservation_client_id ON Reservation (client_id);
CREATE INDEX idx_reservation_vehicule_id ON Reservation (vehicule_id);
CREATE INDEX idx_prix_vehicule_id ON Prix (vehicule_id);
CREATE INDEX idx_proforma_reservation_id ON Proforma (reservation_id);
CREATE INDEX idx_proforma_status_id ON Proforma (status_id);
CREATE INDEX idx_proformaitem_proforma_id ON ProformaItem (proforma_id);