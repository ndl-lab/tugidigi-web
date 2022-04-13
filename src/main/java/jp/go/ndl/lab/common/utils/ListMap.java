package jp.go.ndl.lab.common.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import org.apache.commons.lang3.text.StrBuilder;

public class ListMap<K, V> extends LinkedHashMap<K, List<V>> {

    /**
     * リストに追加する
     *
     * @param key キー
     * @param value 値
     */
    public void add(K key, V value) {
        List<V> list = get(key);
        if (list == null) {
            list = new ArrayList<>();
            put(key, list);
        }
        list.add(value);
    }

    /**
     * リストから削除
     *
     * @param key キー
     * @param value 値
     */
    public void removeValue(K key, V value) {
        List<V> values = get(key);
        if (values == null) {
            return;
        }
        values.remove(value);
    }

    /**
     * リストの全対象を取得
     *
     * @return リスト
     */
    public List<V> getAllValues() {
        List<V> v = new ArrayList<>();
        for (List<V> vv : values()) {
            v.addAll(vv);
        }
        return v;
    }

    /**
     * キーに関係なく全部から取り除く
     *
     * @param values リスト
     */
    public void removeAll(List<V> values) {
        for (List<V> vv : values()) {
            vv.removeAll(values);
        }
    }

    /**
     * コレクションのオブジェクトすべてリストに追加
     *
     * @param key キー
     * @param values 値
     */
    public void addAll(K key, Collection<? extends V> values) {
        List<V> list = get(key);
        if (list == null) {
            list = new ArrayList<>();
            put(key, list);
        }
        list.addAll(values);
    }

    /**
     * キーに対応するリストが無くても、空のリストを返す
     *
     * @param key キー
     * @return リスト
     */
    public List<V> getList(K key) {
        List<V> values = get(key);
        if (values == null) {
            return new ArrayList<>();
        }
        return values;
    }

    /**
     * 値を取得
     *
     * @param key キー
     * @return 値
     */
    public V getValue(K key) {
        List<V> values = get(key);
        if (values == null || values.isEmpty()) {
            return null;
        }
        return values.get(0);
    }

    /**
     * リストの対象をクリア
     *
     * @param key キー
     */
    public void clearList(K key) {
        List<V> values = get(key);
        if (values != null) {
            values.clear();
        }
    }

    public String getStringValue(K key) {
        return new StrBuilder().appendWithSeparators(getList(key), ", ").toString();
    }

}