package com.pedidos360.ms_pedidos360_bff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import java.util.Map;

@FeignClient(name = "ms-catalogo", url = "http://localhost:8081")
public interface CatalogoClient {

    @GetMapping("/api/productos")
    List<Map<String, Object>> obtenerProductos();

    @PostMapping("/api/productos")
    Map<String, Object> guardarProducto(@RequestBody Map<String, Object> producto);
}