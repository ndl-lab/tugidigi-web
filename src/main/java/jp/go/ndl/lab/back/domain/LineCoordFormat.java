package jp.go.ndl.lab.back.domain;

import lombok.Data;

@Data
public class LineCoordFormat{
	public int id;
	public String contenttext;
	public double xmin,ymin,xmax,ymax;
}
