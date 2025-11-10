package com.tfg.listacompra.controller;

import com.tfg.listacompra.model.ListaCompra;
import com.tfg.listacompra.model.Usuario;
import com.tfg.listacompra.service.ListaCompraService;
import com.tfg.listacompra.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/listas")
@CrossOrigin(origins = "http://localhost:4200")
public class ListaCompraController {

    @Autowired
    private ListaCompraService listaCompraService;

    @Autowired
    private UsuarioService usuarioService;

    // Obtener todas las listas
    @GetMapping
    public ResponseEntity<List<ListaCompra>> listarTodas() {
        return ResponseEntity.ok(listaCompraService.listarTodas());
    }

    // Obtener una lista por ID
    @GetMapping("/{id}")
    public ResponseEntity<ListaCompra> obtenerPorId(@PathVariable Long id) {
        Optional<ListaCompra> lista = listaCompraService.obtenerPorId(id);
        return lista.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Obtener listas por usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ListaCompra>> listarPorUsuario(@PathVariable Long usuarioId) {
        Optional<Usuario> usuario = usuarioService.obtenerPorId(usuarioId);
        if (usuario.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(listaCompraService.listarPorUsuario(usuario.get()));
    }

    // Crear una nueva lista
    @PostMapping
    public ResponseEntity<ListaCompra> crear(@RequestBody ListaCompra listaCompra) {
        ListaCompra nueva = listaCompraService.guardar(listaCompra);
        return ResponseEntity.ok(nueva);
    }

    // Eliminar lista
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        listaCompraService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
