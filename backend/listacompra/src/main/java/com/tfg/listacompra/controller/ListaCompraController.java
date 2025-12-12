package com.tfg.listacompra.controller;

import com.tfg.listacompra.model.ListaCompra;
import com.tfg.listacompra.dto.ListaCompraDto;
import com.tfg.listacompra.model.Usuario;
import com.tfg.listacompra.repository.UsuarioRepository;
import com.tfg.listacompra.service.ListaCompraService;
import com.tfg.listacompra.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/listas")
@CrossOrigin(origins = {"http://localhost:4200", "https://angular-production-371c.up.railway.app"})
public class ListaCompraController {

    private static final Logger logger = LoggerFactory.getLogger(ListaCompraController.class);

    @Autowired
    private ListaCompraService listaCompraService;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private com.tfg.listacompra.repository.ProductoRepository productoRepository;

    // Obtener listas del usuario autenticado
        @GetMapping
        public ResponseEntity<List<ListaCompraDto>> listarMisListas(Authentication authentication) {
            Usuario usuario = usuarioRepository.findByNombreUsuario(authentication.getName()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            List<ListaCompra> listas = listaCompraService.listarPorUsuarioId(usuario.getId());
            logger.info("/api/listas requested by user='{}' (id={}), returning {} lists", usuario.getNombreUsuario(), usuario.getId(), listas.size());
            List<ListaCompraDto> dtos = listas.stream().map(l -> {
                ListaCompraDto dto = new ListaCompraDto(l);
                // compute lightweight product count without initializing collections
                long c = productoRepository.countByListaCompra(l);
                dto.setProductosCount((int) c);
                return dto;
            }).toList();
            return ResponseEntity.ok(dtos);
        }

    // Crear lista para el usuario autenticado
    @PostMapping
    public ResponseEntity<ListaCompraDto> crearLista(@RequestBody Map<String, String> requestBody, Authentication authentication) {
        String nombre = requestBody.get("nombre");
        Usuario usuario = usuarioRepository.findByNombreUsuario(authentication.getName()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        ListaCompra nueva = listaCompraService.crearListaParaUsuario(nombre, usuario.getId());
        ListaCompraDto dto = new ListaCompraDto(nueva);
        logger.info("/api/listas POST created list id={} for user='{}'", nueva.getId(), usuario.getNombreUsuario());
        return ResponseEntity.ok(dto);
    }


    // Eliminar lista del usuario autenticado
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLista(@PathVariable Long id, Authentication authentication) {
        Usuario usuario = usuarioRepository.findByNombreUsuario(authentication.getName()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        listaCompraService.eliminarLista(id, usuario.getId());
        return ResponseEntity.noContent().build();
    }
}
