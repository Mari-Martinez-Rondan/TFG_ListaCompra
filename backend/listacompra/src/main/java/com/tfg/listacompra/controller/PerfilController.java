package com.tfg.listacompra.controller;

import com.tfg.listacompra.model.Usuario;
import com.tfg.listacompra.service.UsuarioService;
import com.tfg.listacompra.security.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")

public class PerfilController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public PerfilController(UsuarioService usuarioService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    // Obtener el perfil del usuario autenticado
    public ResponseEntity<Usuario> obtenerPerfil(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String nombreUsuario = jwtUtil.getUsernameFromToken(token);
    Usuario usuario = usuarioService.obtenerPorNombreUsuario(nombreUsuario).orElse(null);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping
    // Actualizar el perfil del usuario autenticado
    public ResponseEntity<Usuario> actualizarPerfil(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody Usuario usuarioActualizado) {
            
        String token = authHeader.replace("Bearer ", "");
        String nombreUsuario = jwtUtil.getUsernameFromToken(token);
        Usuario usuario = usuarioService.obtenerPorNombreUsuario(nombreUsuario).orElse(null);

        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        usuario.setNombre(usuarioActualizado.getNombre());
        usuario.setEmail(usuarioActualizado.getEmail());
        usuario.setApellido1(usuarioActualizado.getApellido1());
        usuario.setApellido2(usuarioActualizado.getApellido2());
        usuario.setTelefono(usuarioActualizado.getTelefono());

        // Actualizar otros campos según sea necesario

        Usuario usuarioGuardado = usuarioService.guardar(usuario);
        return ResponseEntity.ok(usuarioGuardado);
    }

    // Cambiar la contraseña del usuario autenticado
    @PutMapping("/contrasena")
    public ResponseEntity<String> cambiarContrasena(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody String nuevaContrasena) {
        String token = authHeader.replace("Bearer ", "");
        String nombreUsuario = jwtUtil.getUsernameFromToken(token);
        Usuario usuario = usuarioService.obtenerPorNombreUsuario(nombreUsuario).orElse(null);

        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        usuario.setContrasena(passwordEncoder.encode(nuevaContrasena));
        usuarioService.guardar(usuario);
        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }

}