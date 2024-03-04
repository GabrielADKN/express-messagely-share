-- Start by dropping existing tables if they exist to avoid conflicts
\c messagely_test
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create the 'users' table
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    join_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create the 'messages' table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    to_username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    body TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
    read_at TIMESTAMP WITH TIME ZONE
);
