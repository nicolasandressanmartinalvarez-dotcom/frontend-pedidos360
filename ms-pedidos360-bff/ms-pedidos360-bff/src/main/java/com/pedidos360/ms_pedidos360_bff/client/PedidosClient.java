package com.pedidos360.ms_pedidos360_bff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import java.util.Map;

@FeignClient(name = "ms-pedidos", url = "http://localhost:8083")
public interface PedidosClient {

    @GetMapping("/api/orders")
    List<Map<String, Object>> obtenerPedidos();

    // --- NUEVO: Método para enviar la creación del pedido al microservicio ---
    @PostMapping("/api/orders")
    Map<String, Object> crearPedido(@RequestBody Map<String, Object> pedido);
}