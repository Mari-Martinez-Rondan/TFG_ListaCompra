package com.tfg.listacompra.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tfg.listacompra.dto.ProductoSupermercado;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class ProductoSupermercadoService {
       private final ObjectMapper objectMapper = new ObjectMapper();

    public List<ProductoSupermercado> cargarProductos(String archivoJson) {
        try {
            InputStream inputStream = getClass()
                    .getResourceAsStream("/data/" + archivoJson);

            if (inputStream == null) {
                throw new RuntimeException("No se encontró el archivo: " + archivoJson);
            }

            Map<String, List<ProductoSupermercado>> data =
                    objectMapper.readValue(inputStream, new TypeReference<>() {});

            return data.get("productos");  // porque tu JSON tiene { "productos": [ ... ] }
        } catch (Exception e) {
            throw new RuntimeException("Error al leer el archivo JSON: " + archivoJson, e);
        }
    }

    public List<ProductoSupermercado> getProductosSuperManolo() {
        return cargarProductos("productosSuperManolo.json");
    }

    public List<ProductoSupermercado> getProductosSuperPepe() {
        return cargarProductos("productosSuperPepe.json");
    }
}
