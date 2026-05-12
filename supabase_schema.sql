-- KloeCare Supabase Schema
-- Generated for PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    species VARCHAR(100),
    breed VARCHAR(100),
    weight DOUBLE PRECISION,
    gender TEXT[] DEFAULT ARRAY[]::TEXT[],
    birth_date DATE,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_type VARCHAR(255),
    duration VARCHAR(255),
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedings table
CREATE TABLE IF NOT EXISTS feedings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    food_type TEXT[] DEFAULT ARRAY[]::TEXT[],
    food_brand VARCHAR(255),
    amount DOUBLE PRECISION,
    schedule VARCHAR(255),
    frequency INTEGER,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(255),
    frequency VARCHAR(255),
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vaccines table
CREATE TABLE IF NOT EXISTS vaccines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    laboratory VARCHAR(255),
    applied_at DATE,
    next_dose_at DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health records table
CREATE TABLE IF NOT EXISTS healths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    temperature FLOAT,
    weight FLOAT,
    symptoms TEXT[] DEFAULT ARRAY[]::TEXT[],
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wellness Histories table
CREATE TABLE IF NOT EXISTS wellness_histories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    general_notes TEXT,
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_wellness_histories_pet_id ON wellness_histories(pet_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_feedings_updated_at BEFORE UPDATE ON feedings FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_medications_updated_at BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_vaccines_updated_at BEFORE UPDATE ON vaccines FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_healths_updated_at BEFORE UPDATE ON healths FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_wellness_histories_updated_at BEFORE UPDATE ON wellness_histories FOR EACH ROW EXECUTE FUNCTION update_timestamp();
