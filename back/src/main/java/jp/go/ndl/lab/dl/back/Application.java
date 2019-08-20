package jp.go.ndl.lab.dl.back;

import jp.go.ndl.lab.dl.back.batch.AbstractBatch;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
@Slf4j
public class Application {

    public static final String MODE_WEB = "web";
    public static final String MODE_BATCH = "batch";

    public static void main(String... args) throws Exception {
        if (args.length == 0) {
            log.error("起動モードの指定がありません");
            System.exit(-1);
        }
        SpringApplication springApplication = new SpringApplication(Application.class);
        switch (args[0]) {
            case MODE_WEB:
                springApplication.setAdditionalProfiles(MODE_WEB);
                springApplication.setWebApplicationType(WebApplicationType.SERVLET);
                springApplication.run(args);
                break;
            case MODE_BATCH:
                springApplication.setAdditionalProfiles(MODE_BATCH);
                springApplication.setWebApplicationType(WebApplicationType.NONE);
                springApplication.setLogStartupInfo(false);
                try (ConfigurableApplicationContext ctx = springApplication.run(args)) {
                    try {
                        AbstractBatch batchService = ctx.getBean(args[1], AbstractBatch.class);
                        batchService.run(ArrayUtils.subarray(args, 2, args.length));
                    } catch (NoSuchBeanDefinitionException e) {
                        log.error("{}というバッチは存在しません", args[1]);
                    }
                } catch (Throwable t) {
                    log.error("バッチ実行中に予期せぬエラーが発生しました", t);
                    System.exit(-1);
                }
                System.exit(0);
                break;
            default:
                log.error("第一引数の起動モードはweb/batchのみ許容されます。");
                System.exit(-1);
        }
    }

}
