package com.tfg.listacompra.dto;

import com.tfg.listacompra.model.ListaCompra;

public class ListaCompraDto {
    private Long id;
    private String nombre;
    private Long usuarioId;
    private String usuarioNombre;
    private Integer productosCount;

    public ListaCompraDto() {}

    public ListaCompraDto(ListaCompra lista) {
        this.id = lista.getId();
        this.nombre = lista.getNombre();
        if (lista.getUsuario() != null) {
            this.usuarioId = lista.getUsuario().getId();
            this.usuarioNombre = lista.getUsuario().getNombreUsuario();
        }
        if (lista.getProductos() != null) {
            this.productosCount = lista.getProductos().size();
        } else {
            this.productosCount = 0;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }

    public Integer getProductosCount() { return productosCount; }
    public void setProductosCount(Integer productosCount) { this.productosCount = productosCount; }
}
