### Preparacion del entorno de trabajo

- sudo apt-get update
- sudo apt-get install gcc
- sudo apt-get install g++
- sudo apt-get install make

```
sudo apt-get install build-essential linux-headers-`uname -r`
```

### Compilar archivo.c

```console
make all
```

### Limpiar los archivos generados por el make all

```console
make clean
```

### Imprimir en pantalla los logs del buffer del sistema operativo

```console
sudo dmesg
```

### Limpiar los logs del buffer del sistema operativo

```console
sudo dmesg -C
```

### Insertar el modulo al kernel

```console
sudo insmod [nombre_modulo].ko
```

### Quitar el modulo del kernel

```console
sudo rmmod [nombre_modulo].ko
```

### Revisar los datos del archivo que genera nuestro modulo con la data

```console
cat /proc/[nombre_modulo]
```

### Ver todos los modulos

```console
lsmod
```
