## Universidad de San Carlos de Guatemala

### Sistemas Operativos 1

### Sección **A**

### Elmer Gustavo Sanchez Garcia

### **201801351**

### Proyecto No.1

## [Github Repositorio Link](https://github.com/gstavosanchez/SO1_Proyecto1)

---

## Librerias

Estas son librerias solicitadas en el enunciado del proyecto por eso se les dio
un enfasis mas profundo.

**Synsinfo.h**

Devuelve estadisticas sobre el uso de la memoria y el intercambio, asi como el promedio de carga.

**sched.h**

El encabezado define la estructura sched_param, que contiene los parámetros de programación necesarios para la implementación de cada política de programación admitida.

Cada proceso está controlado por una política de programación y una prioridad asociadas. Asociado con cada política hay un rango de prioridad. Cada definición de política especifica el rango de prioridad mínimo para esa política. Los rangos de prioridad para cada política pueden superponerse a los rangos de prioridad de otras políticas.

**signal.h**

Es una libreria estandar de C, sirve para especificar como un programa
maneja señales mientras se ejecutan. Una señal puede reportar un comportamiento excepcional en el programa, o puede reportar algun evento asincrono fuera del programa.

### Informacion de la estructura

**Synsinfo.h**

```C
struct sysinfo {
  long uptime;             /* Segundos desde el arranque */
  unsigned long loads[3];  /* Promedio de caraga de 1.5 - 15 minutos */
  unsigned long totalram;  /* Tamaño total de memororia utilizable */
  unsigned long freeram;   /* Tamaño de memoria disponible */
  unsigned long sharedram; /* Cantidad de memoria compartida */
  unsigned long bufferram; /* Memoria utilizada por buffer */
  unsigned long totalswap; /* Total de memoria swap */
  unsigned long freeswap;  /* Espacio de intercambio aun disponible */
  unsigned short procs;    /* Numeor de procesos actuales */
  unsigned long totalhigh; /* Tamaño total de memoria alto */
  unsigned long freehigh;  /* Gran tamaño de memoria disponible */
  unsigned int mem_unit;   /* Tamaño de la unidad de memoria en bytes */
  char _f[20-2*sizeof(long)-sizeof(int)];
                          /* Padding to 64 bytes */
};

```

### Modulo de CPU

**Librerias Utilizadas**

```C
#include <linux/init.h>
#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>
#include <linux/fs.h>
#include <linux/mm.h> // get_mm_rss()
```

**event_init(void)**

Este funcion es usada para crear el archivo cpu_201801351 e imprime en consola
"Elmer Gustavo Sanchez Garcia" este proceso ocurre al momento de ejecutar el comando
"sudo insmod".

```C
static int __init event_init(void)
{
  proc_create("cpu_201801351", 0, NULL, &file_ops);
  printk(KERN_INFO "Elmer Gustavo Sanchez Garcia\n");
  return 0;
}
```

**event_exit(void)**

Esta funcion es usada para remover el modulo cuando se ejecuta el comando rmmod

```C
static void __exit event_exit(void)
{
  remove_proc_entry("cpu_201801351", NULL);
  printk(KERN_INFO "Diciembre 2021\n");
}
```

**cpu_process(struct seq_file file, void v)**

Esta funcion es usada para obtener los procesos que estan corriendo, durmiendo, zombie
y los procesos hijos de los proceso padree. Los imprime en consola.

```C
static int cpu_process(struct seq_file *file, void *v)
{
  int running = 0;
  int sleeping = 0;
  int zombie = 0;
  int stopped = 0;
  unsigned long rss;

  seq_printf(file, "{\n\"processes\":[ ");
  for_each_process(task)
  { // Tareas del SO
    get_task_struct(task);

    seq_printf(file, "{");
    seq_printf(file, "\"pid\":%d,\n", task->pid);
    seq_printf(file, "\"name\":\"%s\",\n", task->comm);
    seq_printf(file, "\"user\": <%u>,\n", task->cred->uid.val);
    seq_printf(file, "\"state\":%ld,\n", task->state);
    if (task->mm)
    {
      // 11893 -> ram
      rss = get_mm_rss(task->mm) << PAGE_SHIFT;
      seq_printf(file, "\"ram\": @%lu$,\n", rss);
    }
    else
    {
      seq_printf(file, "\"ram\":%d,\n", 0);
    }

    seq_printf(file, "\"children\":[");
    list_for_each(list, &task->children)
    {
      task_child = list_entry(list, struct task_struct, sibling);
      seq_printf(file, "{");
      seq_printf(file, "\"id\": %d,", task_child->pid);
      seq_printf(file, "\"name\": \"%s\"", task_child->comm);
      seq_printf(file, "},");
    }
    seq_printf(file, "]");

    switch (task->state)
    {
    case 0:
      running++;
      break;

    case 1:
      sleeping++;
      break;

    case 128:
      zombie++;
      break;

    case 1026:
      sleeping++;
      break;

    default:
      stopped++;
      break;
    }
    seq_printf(file, "},\n");
  }
  seq_printf(file, "],\n");
  seq_printf(file, "\"process_running\":%d,\n", running);
  seq_printf(file, "\"process_sleeping\":%d,\n", sleeping);
  seq_printf(file, "\"process_zombie\":%d,\n", zombie);
  seq_printf(file, "\"process_stopped\":%d,\n", stopped);
  seq_printf(file, "\"total_processes\":%d\n", (running + sleeping + zombie + stopped));
  seq_printf(file, "}\n");

  return 0;
}
```

### Modulo de RAM

**Librerias Utilizadas**

```C
#include <linux/init.h>
#include <linux/module.h>
#include <linux/fs.h>
#include <linux/kernel.h>
#include <linux/hugetlb.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
```

**ram_module_init(void)**

Este funcion es usada para crear el archivo memo_201801351 e imprime en consola
"201801351" este proceso ocurre al mommento de ejecutar el comando
"sudo insmod".

```C
static int __init ram_module_init(void)
{

  struct proc_dir_entry *entry;
  entry = proc_create("memo_201801351", 0, NULL, &ram_operations);

  if (!entry)
  {
    return -1;
  }
  else
  {
    printk(KERN_INFO "201801351\n");
    return 0;
  }
}
```

**ram_module_exit(void)**

Esta funcion es usada para remover el modulo cuando se ejecuta el comando rmmod
Este imprime en pantalla "sistemas Operativos 1"

```C
static void __exit ram_module_exit(void)
{
  remove_proc_entry("memo_201801351", NULL);
  printk(KERN_INFO "Sistemas Operativos 1\n");
}
```

**Estructura**

El modulo tiene una estructura que son las funciones que ejecuta el modulo.

```C
static struct proc_ops ram_operations = {
    .proc_open = proc_ram_open,
    .proc_read = seq_read,
    .proc_lseek = seq_lseek,
    .proc_release = single_release};
```

**get_information()**

Este metodo imprime en consola la memoria total de ram, asi como la memoria utilizada
esta ya es procesada en golang y se la envia al frontend.

```C
static int get_information(struct seq_file *file_proc, void *v)
{

  struct sysinfo i;
  unsigned long pages[NR_LRU_LISTS];
  int lru;

#define K(x) ((x) << (PAGE_SHIFT - 10))
  si_meminfo(&i);
  for (lru = LRU_BASE; lru < NR_LRU_LISTS; lru++)
    pages[lru] = global_numa_state(NR_LRU_BASE + lru);

  seq_printf(file_proc, "{");
  seq_printf(file_proc, "'ram': %lu,", K(i.totalram) / 1024);
  seq_printf(file_proc, "'uso': %lu,", (K(i.totalram) - K(i.freeram) + K(i.bufferram) + K(i.sharedram)) / 1024);
  freeram) - K(i.bufferram)) / 1024) * 100) / (K(i.totalram) / 1024));
  seq_printf(file_proc, "}\n");
#undef K

  return 0;
}
```

### Comandos en consola

**insmod**

Comando se utiliza para cargar módulo en el kernel. Linux tiene muchas funciones es por medio del módulo, cuando sea necesario para cargar el kernel.

```console
sudo insmod [modulo].ko
```

**rrmod**

La ejecución del comando rmmod, puede quitar módulos innecesarios.

```console
sudo rrmod [modulo].ko
```

**dmesg**

Imprimir en pantalla los logs del buffer del sistema operativo
Es un comando presente en los sistemas operativos Unix que lista el buffer de mensajes del núcleo. Este buffer contiene una gran variedad de mensajes importantes generados durante el arranque del sistema y durante la depuración de aplicaciones.

```console
sudo dmesg
```

**make**

El comando make de Linux se utiliza para crear y mantener grupos de programas y archivos a partir del código fuente. En Linux, es uno de los comandos más utilizados por los desarrolladores. Ayuda a los desarrolladores a instalar y compilar muchas utilidades desde el terminal. Además, maneja el proceso de compilación de proyectos importantes. Ahorra tiempo de compilación.

```console
make [parametro]
```
