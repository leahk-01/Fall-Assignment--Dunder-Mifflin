drop schema public cascade;
create schema public;

CREATE TABLE customers
(
    id      integer GENERATED BY DEFAULT AS IDENTITY,
    name    character varying(255) NOT NULL,
    address character varying(255),
    phone   character varying(50),
    email   character varying(255),
    CONSTRAINT customers_pkey PRIMARY KEY (id)
);

CREATE TABLE paper
(
    id           integer GENERATED BY DEFAULT AS IDENTITY,
    name         character varying(255) NOT NULL,
    discontinued boolean                NOT NULL DEFAULT FALSE,
    stock        integer                NOT NULL DEFAULT 0,
    price        double precision       NOT NULL,
    CONSTRAINT paper_pkey PRIMARY KEY (id)
);

CREATE TABLE properties
(
    id            integer GENERATED BY DEFAULT AS IDENTITY,
    property_name character varying(255) NOT NULL,
    CONSTRAINT properties_pkey PRIMARY KEY (id)
);

CREATE TABLE orders
(
    id            integer GENERATED BY DEFAULT AS IDENTITY,

    order_date    timestamp with time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP),
--  PSA: I recommend using DateTime.UtcNow for making timestamps with entity framework for the above order_date

    delivery_date date,
    status        character varying(50)    NOT NULL DEFAULT ('pending'::character varying),
    total_amount  double precision         NOT NULL,
    customer_id   integer,
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
);

CREATE TABLE paper_properties
(
    paper_id    integer NOT NULL,
    property_id integer NOT NULL,
    CONSTRAINT paper_properties_pkey PRIMARY KEY (paper_id, property_id),
    CONSTRAINT paper_properties_paper_id_fkey FOREIGN KEY (paper_id) REFERENCES paper (id),
    CONSTRAINT paper_properties_property_id_fkey FOREIGN KEY (property_id) REFERENCES properties (id)
);

CREATE TABLE order_entries
(
    id         integer GENERATED BY DEFAULT AS IDENTITY,
    quantity   integer NOT NULL,
    product_id integer,
    order_id   integer,
    CONSTRAINT order_entries_pkey PRIMARY KEY (id),
    CONSTRAINT order_entries_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT order_entries_product_id_fkey FOREIGN KEY (product_id) REFERENCES paper (id)
);

CREATE UNIQUE INDEX customers_email_key ON customers (email);

CREATE INDEX "IX_order_entries_order_id" ON order_entries (order_id);

CREATE INDEX "IX_order_entries_product_id" ON order_entries (paper_id);

CREATE INDEX "IX_orders_customer_id" ON orders (customer_id);

CREATE UNIQUE INDEX unique_product_name ON paper (name);

CREATE INDEX "IX_paper_properties_property_id" ON paper_properties (property_id);