package jp.go.ndl.lab.back;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ResourceProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Profile(Application.MODE_WEB) 
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    //参考：https://qiita.com/clomie/items/bdda0a3467bcf6709e1c

    @Autowired
    private ResourceProperties resourceProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                .addResourceHandler("/**")
                .addResourceLocations(resourceProperties.getStaticLocations())
                .resourceChain(false)
                .addResolver(new SpaPageResourceResolver());
    }

    public static class SpaPageResourceResolver extends PathResourceResolver {
        @Override
        protected Resource getResource(String resourcePath, Resource location) throws IOException {
            Resource resource = super.getResource(resourcePath, location);
            return resource != null ? resource : super.getResource("index.html", location);
        }
    }
}