# Next Generation Digital Library

## back

Backend of Next Generation Digital Library is spring-boot-based Single Jar Application.

### required

- JDK(1.8 or later)
- Apache Maven
- [Elasticsearch](https://www.elastic.co/)(worked on 6.6.1) for Database and text search
- [NGTD](https://github.com/yahoojapan/ngtd) for image similarity search

### build

    cd back
    mvn clean install
    cp -R target/lib lib
    cp target/tugidigi-back-0.1.jar tugidigi-back-0.1.jar

### setup

#### 1. Elasticsearch

After install & run elasticsearch, run following to create index

    java -jar tugidigi-back-0.1.jar batch create-index all

To register book data, you need:

- Metadata List (TSV)
- Zipped text data(1 tet file per page)
- TOC data
- Page Divide Location

See jp.go.ndl.lab.dl.back.batch.IndexBookBatch and IndexIllustrationBatch

#### 2. NGT

### run API server

    java -jar tugidigi-back-0.1.jar web

API is running on [http://localhost:9998/dl/](http://localhost:9998/dl/) by default

## front

Frontend of Next Generation Digital Library is SPA powered by vue & vue-router.

### required

- [Node.js](https://nodejs.org/) (v10.15.0 or later)

### install

    npm install

### start dev server

    npm run start

Check [http://localhost:8080/dl/](http://localhost:8080/dl/)

### build

    npm build
