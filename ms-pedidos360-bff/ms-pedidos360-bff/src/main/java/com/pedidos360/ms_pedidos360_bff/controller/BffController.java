package com.pedidos360.ms_pedidos360_bff.controller;

import com.pedidos360.ms_pedidos360_bff.client.CatalogoClient;
import com.pedidos360.ms_pedidos360_bff.client.PedidosClient;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class BffController {

    private final CatalogoClient catalogoClient;
    private final PedidosClient pedidosClient; // Nuevo cliente

    // Inyectamos ambos clientes en el constructor
    public BffController(CatalogoClient catalogoClient, PedidosClient pedidosClient) {
        this.catalogoClient = catalogoClient;
        this.pedidosClient = pedidosClient;
    }

    @GetMapping("/estado")
    public Map<String, Object> estadoServidor(@AuthenticationPrincipal Jwt jwt) {
        // Confirmamos que el BFF está vivo y extraemos el nombre del usuario
        // directamente del token
        return Map.of(
                "mensaje", "¡El BFF de Pedidos360 está funcionando y seguro!",
                "usuarioAutenticado",
                jwt.getClaimAsString("name") != null ? jwt.getClaimAsString("name") : "Usuario Desconocido");
    }

    // --- NUEVO ENDPOINT ---
    @GetMapping("/productos")
    public List<Map<String, Object>> obtenerProductos() {
        // El BFF llama al ms-catalogo (puerto 8081) y devuelve la lista
        return catalogoClient.obtenerProductos();
    }

    // --- NUEVO ENDPOINT PARA PEDIDOS ---
    @GetMapping("/pedidos")
    public List<Map<String, Object>> obtenerPedidos() {
        // El BFF llama al ms-pedidos (puerto 8083) y devuelve la lista
        return pedidosClient.obtenerPedidos();

    }
    // --- NUEVO ENDPOINT PARA CREAR UN PEDIDO ---
    @org.springframework.web.bind.annotation.PostMapping("/pedidos")
    public Map<String, Object> crearPedido(
            @org.springframework.web.bind.annotation.RequestBody Map<String, Object> pedido) {
        // El BFF recibe el pedido de Angular y lo reenvía al microservicio de pedidos
        return pedidosClient.crearPedido(pedido);
    }

    @PostMapping("/productos")
    public Map<String, Object> guardarProducto(@RequestBody Map<String, Object> producto) {
        return catalogoClient.guardarProducto(producto);
    }
}