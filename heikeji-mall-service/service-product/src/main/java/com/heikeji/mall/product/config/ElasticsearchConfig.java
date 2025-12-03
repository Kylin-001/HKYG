package com.heikeji.mall.product.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

/**
 * Elasticsearch Configuration Class
 * Used to configure Elasticsearch client connection
 */
@Configuration
@EnableElasticsearchRepositories(basePackages = "com.heikeji.mall.product.repository")
public class ElasticsearchConfig extends ElasticsearchConfiguration {

    @Value("${spring.elasticsearch.rest.uris}")
    private String elasticsearchUris;

    @Value("${spring.elasticsearch.rest.username:}")
    private String elasticsearchUsername;

    @Value("${spring.elasticsearch.rest.password:}")
    private String elasticsearchPassword;

    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(elasticsearchUris)
                .withBasicAuth(elasticsearchUsername, elasticsearchPassword)
                .build();
    }
}