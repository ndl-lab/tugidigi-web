package jp.go.ndl.lab.back.service;

import lombok.Data;

import java.util.List;

@Data
public class VectorSearchRequest {

    public String id;
    public List<Float> vector;
    public int size = 10;
    public float epsilon = 0.01f;

}
