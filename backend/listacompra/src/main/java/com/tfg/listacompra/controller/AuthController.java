package com.tfg.listacompra.controller;

import com.tfg.listacompra.dto.LoginRequest;
import com.tfg.listacompra.dto.LoginResponse;
import com.tfg.listacompra.dto.RegisterRequest;
import com.tfg.listacompra.model.Usuario;
import com.tfg.listacompra.service.UsuarioService;
import com.tfg.listacompra.security.JwtUtil;


import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "https://tfglistacompra-production-4550.up.railway.app"})

public class AuthController {

    private UsuarioService usuarioService;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;

    public AuthController(UsuarioService usuarioService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        if (usuarioService.existePorEmail(registerRequest.getEmail()) || usuarioService.existePorNombreUsuario(registerRequest.getNombreUsuario())) {
            return ResponseEntity.badRequest().body("El email o nombre de usuario ya están en uso.");
        }
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(registerRequest.getNombreUsuario());
        usuario.setNombre(registerRequest.getNombre());
        usuario.setApellido1(registerRequest.getApellido1());
        usuario.setApellido2(registerRequest.getApellido2());
        usuario.setTelefono(registerRequest.getTelefono());
        usuario.setEmail(registerRequest.getEmail());
        usuario.setContrasena(passwordEncoder.encode(registerRequest.getContrasena()));

        Usuario saved = usuarioService.guardar(usuario);
        return ResponseEntity.ok("Usuario registrado con ID: " + saved.getId());
    }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
            Usuario usuario = usuarioService.obtenerPorNombreUsuario(loginRequest.getNombreUsuario()).orElse(null);
            if (usuario == null || !passwordEncoder.matches(loginRequest.getContrasena(), usuario.getContrasena())) {
                return ResponseEntity.status(401).body("Nombre de usuario o contraseña incorrectos.");
            }
            String token = jwtUtil.generateToken(usuario.getNombreUsuario());
            return ResponseEntity.ok(new LoginResponse(token));
        }


}
