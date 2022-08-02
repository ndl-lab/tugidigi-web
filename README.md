# Next Digital Library

## back

Backend of Next Digital Library is spring-boot-based Single Jar Application.

### required

- JDK(Openjdk 11 or later)
- Apache Maven
- [Elasticsearch](https://www.elastic.co/)(worked on 7.7) for Database and text search
- [vdaas/vald](https://github.com/vdaas/vald) for image similarity search

### build

    sh build.sh

### setup

#### 1. Elasticsearch

After install & run elasticsearch, run following to create index

    java -jar jisedigi-back-0.1.jar batch create-index all

See jp.go.ndl.lab.dl.back.batch.IndexBookBatch and IndexIllustrationBatch

#### 2. vald

After install Kubernetes (such as [kind] https://kind.sigs.k8s.io/), run following to create pod

    kubectl apply -f manifest/vald-pre/
    kubectl apply -f manifest/vald-post/
if you want to custom the configuration, you can generate template file using helm chart(manifest/helmchart/values.yaml).


### run API server

    java -jar jisedigi-back-0.1.jar web

API is running on [http://localhost:19998/dl/](http://localhost:19998/dl/) by default


## build front only (for developer)

Frontend of Next Digital Library is SPA powered by vue & vue-router.

### required

- [Node.js](https://nodejs.org/) (v14.19.1 or later)

### install

    npm install

### start dev server

    npm run start

Check [http://localhost:8080/dl/](http://localhost:8080/dl/)

### build

    npm build
