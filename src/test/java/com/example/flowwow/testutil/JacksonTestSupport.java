package com.example.flowwow.testutil;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.data.domain.Page;

import java.io.IOException;

public final class JacksonTestSupport {

    private JacksonTestSupport() {
    }

    public static ObjectMapper objectMapperWithPageSupport() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        SimpleModule module = new SimpleModule();
        module.addSerializer(Page.class, new PageJsonSerializer());
        mapper.registerModule(module);

        return mapper;
    }

    private static class PageJsonSerializer extends JsonSerializer<Page> {
        @Override
        public void serialize(Page value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            gen.writeStartObject();
            gen.writeObjectField("content", value.getContent());
            gen.writeNumberField("totalElements", value.getTotalElements());
            gen.writeNumberField("totalPages", value.getTotalPages());
            gen.writeNumberField("number", value.getNumber());
            gen.writeNumberField("size", value.getSize());
            gen.writeEndObject();
        }
    }
}
