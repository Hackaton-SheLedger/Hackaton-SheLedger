-- SheLedger Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  business_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Financial records table
CREATE TABLE IF NOT EXISTS records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  phone VARCHAR(20) NOT NULL,
  sales DECIMAL(10,2) DEFAULT 0,
  expenses DECIMAL(10,2) DEFAULT 0,
  savings DECIMAL(10,2) DEFAULT 0,
  source VARCHAR(20) DEFAULT 'whatsapp',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_records_phone ON records(phone);
CREATE INDEX IF NOT EXISTS idx_records_created_at ON records(created_at);
