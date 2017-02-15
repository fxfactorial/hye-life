CREATE TABLE event (
    title TEXT NOT NULL,
    all_day INT NOT NULL,
    start INTEGER NOT NULL,
    end INTEGER NOT NULL,
    description TEXT NOT NULL,
    creator INTEGER NOT NULL,
    url TEXT NOT NULL,
    id TEXT NOT NULL,
    UNIQUE (ID)
);
