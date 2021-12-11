package jp.go.ndl.lab.back.service;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

import org.vdaas.vald.api.v1.vald.InsertGrpc;
import org.vdaas.vald.api.v1.vald.UpsertGrpc;
import org.vdaas.vald.api.v1.vald.SearchGrpc;
import org.vdaas.vald.api.v1.vald.UpdateGrpc;
import org.vdaas.vald.api.v1.vald.RemoveGrpc;

import org.vdaas.vald.api.v1.payload.Insert;
import org.vdaas.vald.api.v1.payload.Search;
import org.vdaas.vald.api.v1.payload.Remove;
import org.vdaas.vald.api.v1.payload.Object;
import org.vdaas.vald.api.v1.payload.Upsert;

import java.util.LinkedHashMap;
import java.util.List;

@Service
@Slf4j
public class VectorSearchServiceValdImpl implements VectorSearchService {
	private String endPoint;
    ManagedChannel channel;
    InsertGrpc.InsertBlockingStub istub;
    UpsertGrpc.UpsertBlockingStub upstub;
    SearchGrpc.SearchBlockingStub sstub;
    UpdateGrpc.UpdateBlockingStub ustub;
    RemoveGrpc.RemoveBlockingStub rstub;
	public VectorSearchServiceValdImpl(@Value("${valdEndPoint}") String endPoint) {
        this.endPoint = endPoint;
        String[] endPointSplit = endPoint.split(":");
        channel= ManagedChannelBuilder.forAddress(endPointSplit[0], NumberUtils.toInt(endPointSplit[1]))
                .usePlaintext()
                .build();
        istub = InsertGrpc.newBlockingStub(channel);
        sstub = SearchGrpc.newBlockingStub(channel);
        ustub = UpdateGrpc.newBlockingStub(channel);
        upstub = UpsertGrpc.newBlockingStub(channel);
        rstub = RemoveGrpc.newBlockingStub(channel);
    }
	@Override
    public LinkedHashMap<String, Float> search(VectorSearchRequest req) {
		Search.Config scfg = Search.Config.newBuilder()
                .setNum(req.size)
                .setRadius(-1.0f)
                .setEpsilon(req.epsilon)
                .setTimeout(3000000000L)
                .build();
		Search.Request sreq = Search.Request.newBuilder()
                .addAllVector(req.vector)
                .setConfig(scfg)
                .build();
		Search.Response r =sstub.search(sreq);
        LinkedHashMap<String, Float> result = new LinkedHashMap<>();
        r.getResultsList().forEach(d -> result.put(d.getId(), d.getDistance()));
        return result;
    }
	@Override
    public LinkedHashMap<String, Float> searchbyid(VectorSearchRequest req) {
		Search.Config scfg = Search.Config.newBuilder()
                .setNum(req.size)
                .setRadius(-1.0f)
                .setEpsilon(req.epsilon)
                .setTimeout(3000000000L)
                .build();
        Search.IDRequest sreq = Search.IDRequest.newBuilder()
        		.setId(req.id)
                .setConfig(scfg)
                .build();
        Search.Response r = sstub.searchByID(sreq);
        LinkedHashMap<String, Float> result = new LinkedHashMap<>();
        r.getResultsList().forEach(d -> result.put(d.getId(), d.getDistance()));
        return result;
    }
	@Override
    public VectorSearchIndexer getIndexer(long wait) {
		return new VectorSearchIndexer() {
			@Override
			public void upsert(String id, List<Float> vector) {
				Object.Vector ovec = Object.Vector.newBuilder()
                        .setId(id)
                        .addAllVector(vector)
                        .build();
				Insert.Config icfg = Insert.Config.newBuilder()
                        .setSkipStrictExistCheck(true)
                        .build();
				Insert.Request ireq = Insert.Request.newBuilder()
                        .setVector(ovec)
                        .setConfig(icfg)
                        .build();
				istub.insert(ireq);
			}

			@Override
			public void insert(String id, List<Float> vector) {
				Object.Vector ovec = Object.Vector.newBuilder()
                        .setId(id)
                        .addAllVector(vector)
                        .build();
				Upsert.Config icfg = Upsert.Config.newBuilder()
                        .setSkipStrictExistCheck(true)
                        .build();
				Upsert.Request ireq = Upsert.Request.newBuilder()
                        .setVector(ovec)
                        .setConfig(icfg)
                        .build();
				upstub.upsert(ireq);
			}
			@Override
			public void delete(String id) {
				Remove.Config rcfg = Remove.Config.newBuilder()
                        .setSkipStrictExistCheck(true)
                        .build();
				Remove.Request rreq = Remove.Request.newBuilder()
				                        .setId(Object.ID.newBuilder().setId(id).build())
				                        .setConfig(rcfg)
				                        .build();
				rstub.remove(rreq);
			}
			@Override
			public void close() {
				channel.shutdown();
			}
		};
	}	
}
