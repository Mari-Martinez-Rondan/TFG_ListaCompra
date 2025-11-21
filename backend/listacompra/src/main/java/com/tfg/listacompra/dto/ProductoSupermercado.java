package com.tfg.listacompra.dto;

public class ProductoSupermercado {

    private Long id;
    private String nombre;
    private String categoria;
    private String marca;
    private String precio;
    private Integer stock;
    private String unidad;
    private String descripcion;
    private String supermercado;

    public ProductoSupermercado() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getPrecio() { return precio; }
    public void setPrecio(String precio) { this.precio = precio; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getSupermercado() { return supermercado; }
    public void setSupermercado(String supermercado) { this.supermercado = supermercado; }
}

