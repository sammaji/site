---
title: "Detailed Introduction To Prisma ORM"
published_at: 2023-09-25T06:54:08.691Z
tags: ["prisma", "Next.js", "JavaScript", "TypeScript", "PostgreSQL"]
---

Prisma is an open-source object-relational mapper (ORM) tool for Node.js and TypeScript. In this article, we will cover the basics of Prisma and understand how it works.

# What is an ORM?

Object Relational Mappings or ORMs provide a high-level abstraction. They expose a programmatic interface through objects to create, read, delete, and manipulate data while hiding some of the complexity of the database.

The idea with ORMs is that you define your models as classes that map to tables in a database. The classes and their instances provide you with a programmatic API to read and write data in the database.

In Prisma, you define your models in the declarative Prisma schema which serves as the single source of truth for your database schema and the models in your programming language.

Prisma is full-typesafe, which means you can get type intellisense in your typescript code.

To get started run the following command:

```bash
npx prisma init
```

This will set up Prisma in your project. A new folder named Prisma will be created, containing a single file `prisma.schema`. That is your schema file. The Prisma schema file is where you define everything related to your database.

The schema file consists of three parts:

1.  Data Source: specifies how Prisma should connect to your database.
2.  Generators: specifies how your Prisma client will be generated, the Prisma client provides APIs for interacting with your database.
3.  Models: your data models, which will be mapped to tables, relations or collections in your database.

## Data Sources

The data source specifies how Prisma should connect to your database. You can specify only one data source.

By default you'll find this as your data source:

```plaintext
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

The provider is the database you want to connect to. Prisma supports these databases: `postgresql`, `mysql`, `sqlite`, `sqlserver`, `mongodb` or `cockroachdb`.

The `url` is the connection URL which is required for connecting with your database. You can set that to an environment variable using env() function.

# Generators

Prisma reads your Prisma schema and generates a Prisma client which provides useful APIs for interacting with your database.

The generator block contains configurations which specify how your Prisma client will be generated. You can multiple generator blocks.

The provider property describes which generator to use. This can point to a file that implements a generator or specifies a built-in generator directly. Prisma has tons of [community-created generator](https://www.prisma.io/docs/concepts/components/prisma-schema/generators#community-generators)s.

One built-in generator is the `prisma-client-js` which generates a javascript client based on your schema. You'll be using this most of the time.

To generate Prisma client from your Prisma schema, run the following command:

```bash
npx prisma generate
```

If you run it right now, it will complain as you don't have any models. Just add the following line and re-run the command:

```plaintext
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

Now, look into your `node_modules`, and you will find `@prisma/client`. You will use this to work with your database.

You can change the output directory of your schema, by changing the output property. If you set it to `out/client` and run `npx prisma generate`, you'll see your new client being generated at `prisma/out/client`.

# Models

Models are entities that represent data in your database. These are mapped to tables and relations (for relational databases like PostgreSQL) or collections (for nosql databases like Mongodb).

Let's look at the model we defined previously:

```plaintext
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

Here we created a model called User, with three fields. Each field has a type and some optional attributes. Prisma provides a few built-in datatypes like BigInt, String, Float, etc. Some datatypes are only supported by certain databases only, e.g., the Json datatype is only supported by PostgreSQL.

# Field Level Attributes

Field-level attributes modify the properties of a field. Field-level attributes are prefixed by `@`.

Every model must have a unique identifier. You can use the @id attribute to specify a particular field as a primary key. Is similar to `PRIMARY KEY` property, if you're familiar with SQL.

The `@default()` attribute sets the default value of your field. In most cases you won't want to manage your id manually. You can use this modifier to automatically set the IDs. Here, `the autoincrement()` function provides a unique integer everytime. If your `ID` is of string type, you can use `uuid()` or `cuid()` to generate unique IDs.

```plaintext
model User {
  id String @id @default(cuid())
}
```

If you're using MongoDB, your unique id must be named `_id`. Alternatively, you can use the @map attribute to map the `id` field of your model to `_id` field of your database.

```plaintext
/// for mongodb
model User {
  id    Int     @id @default(autoincrement()) @map("_id")
  email String  @unique
  name  String?
}
```

# Type Modifiers

There are two type modifiers in prisma: optional modifier (?) and array modifier (?). Both are self explanatory.

Adding the optional modifier makes a property optional. In the previous example, name was an optinal property. You can choose to not provide a name and the prisma client will not complain.

The array modifier lets you accept an array of values. In the example below, the field `posts` accepts an array of string values.

```plaintext
model User {
  id    Int     @id @default(autoincrement()) @map("_id")
  email String  @unique
  name  String?
  posts String[]
}
```

These modifiers cannot be chained together, ie, you can't have optinal arrays in prisma.

# Enums

Enums store a set number of values, which can be used as state in your models.

```plaintext
enum Role {
  USER
  ADMIN
}

model User {
  id   Int  @id @default(autoincrement())
  role Role @default(USER)
}
```

# Block Level Attributes

As we saw previously, the field level attributes modify the properties of an individual field. There is another type of attribute, namely, the block level attribute. Block level attributes are prefixed by `@@`.

Here's an example, let's say you want to ensure that first name and last name of an user, combined must be unique. You can use the block level attribute `@@unique` to do so.

```plaintext
model User {
  id        Int    @id @default(autoincrement())
  firstName String
  lastName  String

  @@unique([firstName, lastName])
}
```

For the above example, two users can have the same first name or same last name but they cannot have the same full name.

We can also create composite ids, using the `@@id` modifier. Composite ids are simply unique identifiers that are composed of multiple fields. The fields may or may not have the same data type.

For the previous example, since we know that the full name of the user is unique, we can use that as an id.

```plaintext
model User {
  firstName String
  lastName  String

  @@id([firstName, lastName])
}
```

You can define indexes on one or multiple fields of your models via the `@@index` attribute. Having indexes helps in optimizing lookup time for a field. There are some limitations of creating indexes using prisma. For example, you cannot create indexes partially using `WHERE` clause or concurrently using `CONCURRENTLY`.

That's it for now, there are few things left to cover like, how to use the prisma client, relational data modelling and migrations. I'll be covering them in future articles.

Did you like this article? Do provide you feedback in the comments. Thank you for reading ❣️
