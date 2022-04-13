package jp.go.ndl.lab.back.tools;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.CaseFormat;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import jp.go.ndl.lab.back.domain.Book;
import jp.go.ndl.lab.back.domain.Illustration;
import jp.go.ndl.lab.back.domain.Page;
import org.apache.commons.text.StrBuilder;
import org.springframework.context.annotation.Description;

public class TypeDefinitionTool {

    static Path base = Paths.get("..\\japan-search-html\\src\\ts\\domain");

    static Set<Class> classes = new LinkedHashSet<>();
    static Set<Class> enums = new LinkedHashSet<>();

    private static StrBuilder sb = new StrBuilder();

    static void println(String s) {
        sb.appendln(s);
    }

    static void print(String s) {
        sb.append(s);
    }

    public static void main(String[] args) throws Exception {
        print("domain", Arrays.asList(Book.class, Page.class, Illustration.class));
    }

    static void print(String file, List<Class> clazz) throws Exception {
        classes.clear();
        enums.clear();
        sb = new StrBuilder();
        println(""
                + "import {Permission,PublicationLevel} from \"./permission\";\n"
                + "import {Edit} from \"./edit\";\n"
                + "import {JobChain,JobRate} from \"./job\";\n"
                + "import {Delta} from 'components/generic/quill/delta';\n"
                + "import {ImageSelection, LatLon, LangString, LangStringYomi} from \"./common\";\n"
                + "import {CommonLabel} from './label';\n"
                + "import {ValidationRule} from './validation-rule';\n"
                + "import {SearchQuery} from 'service/search-utils';\n"
                + "import {registerRule, registerEnum, EnumDef} from './domain-utils';\n"
                + "import {PartDefinition} from 'domain/part-definition';"
                + "\n\n\n");

        for (Class c : clazz) {
            lp(c, true);
        }
        classes.removeAll(clazz);

        for (Class sub : classes) {
            lp(sub, false);
        }

        for (Class em : enums) {
            genenum(em);
        }

        Files.write(base.resolve(file + ".ts"), sb.toString().getBytes(StandardCharsets.UTF_8));

    }

    static Set<Class> outputed = new HashSet<>();

    static void lp(Class clazz, boolean sub) throws Exception {
        if (!outputed.add(clazz)) {
            System.out.println("Class Duplicated:" + clazz);
        }

        print("export interface " + clazz.getSimpleName());
        if (clazz.getSimpleName().equals("LangStringYomi")) {
            print(" extends LangString");
        }
        if (clazz.getSimpleName().equals("CurationPartDefinition")) {
            print(" extends PartDefinition");
        }
        if (clazz.getSimpleName().startsWith("Part")) {
            print(" extends CurationPartDefinition");
        }
        println("{");
        loop:
        for (Field f : clazz.getDeclaredFields()) {
            if (Modifier.isStatic(f.getModifiers())) {
                continue;
            }
            if (f.getName().equals("version")) {
                continue;
            }
            if (f.getName().equals("cache")) {
                continue;
            }
            if (f.getName().equals("linkId")) {
                continue;
            }
            if (f.getType().isEnum()) {
                enums.add(f.getType());
            }

            Class fType = f.getType();
            if (fType == List.class) {
                ParameterizedType paramType = (ParameterizedType) f.getGenericType();
                for (java.lang.reflect.Type i : paramType.getActualTypeArguments()) {
                    fType = (Class) i;
                }
                String tst = tsType(fType);
                if (tst == null) {
                    if (sub) {
                        classes.add(fType);
                    }
                    tst = fType.getSimpleName();
                }
                println(f.getName() + "?:" + tst + "[];");
            } else if (f.getType().isArray()) {
                fType = fType.getComponentType();
                String tst = tsType(fType);
                if (tst == null) {
                    if (sub) {
                        classes.add(fType);
                    }
                    tst = fType.getSimpleName();
                }
                println(f.getName() + "?:" + tst + "[];");
            } else if (fType.isEnum()) {
                enums.add(f.getType());
                println(f.getName() + "?:" + fType.getSimpleName() + ";");
            } else if (fType == Map.class) {
                ParameterizedType paramType = (ParameterizedType) f.getGenericType();
                for (java.lang.reflect.Type i : paramType.getActualTypeArguments()) {
                    if (!(i instanceof Class)) {
                        continue loop;
                    }
                    fType = (Class) i;
                }
                String tst = tsType(fType);
                if (tst == null) {
                    if (sub) {
                        classes.add(fType);
                    }
                    tst = fType.getSimpleName();
                }
                println(f.getName() + "?:{[key:string]:" + tst + "};");
            } else {
                String tst = tsType(fType);
                if (tst == null) {
                    if (sub) {
                        classes.add(fType);
                    }
                    tst = fType.getSimpleName();
                }
                println(f.getName() + "?:" + tst + ";");
            }
        }
        println("}");
    }

    static String tsType(Class clazz) {
        switch (clazz.getSimpleName()) {
            case "Date":
                return "number";
            case "int":
                return "number";
            case "long":
                return "number";
            case "Long":
                return "number";
            case "Integer":
                return "number";
            case "Double":
                return "number";
            case "double":
                return "number";
            case "String":
                return "string";
            case "Boolean":
                return "boolean";
            case "boolean":
                return "boolean";
            default:
                return null;
        }

    }

    /**
     * クラスをEnumに変換して標準出力する。
     *
     * @param code クラス型
     */
    public static void genenum(Class code) throws Exception {
        String name = code.getSimpleName();
        Map<String, String> codeMap = new HashMap<>();

        EnumLang lang = new EnumLang();
        lang.id = "";

        for (Field f : code.getFields()) {
            Description d = f.getAnnotation(Description.class);
            CodeLang c = new CodeLang();
            lang.c.put(f.getName(), c);
        }

        for (Object c : code.getEnumConstants()) {
            Enum e = (Enum) c;
            codeMap.put(e.name(), "null");
        }

        print("export type " + name + " = ");
        println(codeMap.keySet().stream().map(str -> "\"" + str + "\"").collect(Collectors.joining("|")) + ";");

//        println("export class " + name + "s" + " {");
//        codeMap.keySet().stream().forEach(s -> println("\tpublic static " + s + ": " + name + " = \"" + s + "\";"));
//
//        println("\tpublic static $values =["+codeMap.keySet().stream().map(k->name+"s."+k).collect(Collectors.joining(","))+"];");
//        println("}");
        String cname = CaseFormat.UPPER_CAMEL.to(CaseFormat.UPPER_UNDERSCORE, name) + "_DEF";
        println("export const " + cname + ":EnumDef=" + om.writeValueAsString(lang) + ";");
        println("registerEnum(" + cname + ");");
    }

//    private static ObjectMapper om = new ObjectMapper().configure(SerializationFeature.INDENT_OUTPUT, true);
    private static ObjectMapper om = new ObjectMapper();

    private static class EnumLang {

        public EnumLang() {
        }

        public String id = "";
        public Map<String, CodeLang> c = new LinkedHashMap<>();
    }

    private static class CodeLang {

    }

}
