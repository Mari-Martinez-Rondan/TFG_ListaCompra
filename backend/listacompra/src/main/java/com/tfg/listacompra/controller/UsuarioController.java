package com.tfg.listacompra.controller;

import com.tfg.listacompra.model.Usuario;
import com.tfg.listacompra.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200") // Permite conexión con Angular
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.obtenerPorId(id);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear nuevo usuario
    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario) {
        // Validación simple de email duplicado
        if (usuarioService.existePorEmail(usuario.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        Usuario nuevo = usuarioService.guardar(usuario);
        return ResponseEntity.ok(nuevo);
    }

    // Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerPorId(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Usuario usuario = usuarioOpt.get();
        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setApellido1(usuarioActualizado.getApellido1());
        usuario.setApellido2(usuarioActualizado.getApellido2());
        usuario.setEmail(usuarioActualizado.getEmail());
        usuario.setTelefono(usuarioActualizado.getTelefono());
        usuario.setContrasena(usuarioActualizado.getContrasena());
        Usuario actualizado = usuarioService.guardar(usuario);
        return ResponseEntity.ok(actualizado);
    }

    // Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

