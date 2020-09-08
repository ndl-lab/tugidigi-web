package jp.go.ndl.lab.common.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import org.apache.commons.lang3.text.StrBuilder;

public class SortedListMap<I extends Comparable, V> extends LinkedHashMap<I, List<V>> {

    public void add(I key, V value) {
        List<V> list = get(key);
        if (list == null) {
            list = new ArrayList<>();
            put(key, list);
        }
        list.add(value);
    }

    public void removeValue(I key, V value) {
        List<V> values = get(key);
        if (values == null) {
            return;
        }
        values.remove(value);
    }

    public List<V> getAllValues() {
        List<V> v = new ArrayList<>();
        for (List<V> vv : values()) {
            v.addAll(vv);
        }
        return v;
    }

    public void removeAll(List<V> values) {
        for (List<V> vv : values()) {
            vv.removeAll(values);
        }
    }

    public void addAll(I key, Collection<? extends V> values) {
        List<V> list = get(key);
        if (list == null) {
            list = new ArrayList<>();
            put(key, list);
        }
        list.addAll(values);
    }

    public List<V> getList(I key) {
        List<V> values = get(key);
        if (values == null) {
            return new ArrayList<>();
        }
        return values;
    }

    public V getValue(I key) {
        List<V> values = get(key);
        if (values == null || values.isEmpty()) {
            return null;
        }
        return values.get(0);
    }

    public void clearList(I key) {
        List<V> values = get(key);
        if (values != null) {
            values.clear();
        }
    }

    public String getStringValue(I key) {
        return new StrBuilder().appendWithSeparators(getList(key), ", ").toString();
    }

    public List<I> getSortedKeyList() {
        List<I> list = new ArrayList<>(keySet());
        Collections.sort(list);
        return list;
    }

}
