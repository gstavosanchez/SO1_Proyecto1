// Header obligatorio de todos los modulos
#include <linux/module.h>
// Header para usar KERN_INFO
#include <linux/kernel.h>
// Header para los macros module_init y module_exit
#include <linux/init.h>
// Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>
/* for copy_from_user */
#include <asm/uaccess.h>
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Ejemplo");
MODULE_AUTHOR("Elmer Gustavo Sanchez Garcia");

static int escribir_archivo(struct seq_file *file, void *v)
{
  seq_printf(file, "*******************************************************\n");
  seq_printf(file, "*******************************************************\n");
  seq_printf(file, "**            Laboratorio Sistemas Operativos        **\n");
  seq_printf(file, "**            Elmer Gustavo Sanchez Garcia           **\n");
  seq_printf(file, "*******************************************************\n");
  seq_printf(file, "*******************************************************\n");

  return 0;
}

static int abrir_proc(struct inode *inode, struct file *file)
{
  return single_open(file, escribir_archivo, NULL);
}

static struct proc_ops archivo_operaciones = {
    .proc_open = abrir_proc,
    .proc_read = seq_read};

static int __init ejemplo_init(void)
{
  proc_create("ejemplo", 0, NULL, &archivo_operaciones);
  printk(KERN_INFO "Mensaje al insertar modulo\n");

  return 0;
}

static void __exit ejemplo_clean(void)
{
  remove_proc_entry("ejemplo", NULL);
  printk(KERN_INFO "El modulo fue retirado\n");
}

module_init(ejemplo_init);
module_exit(ejemplo_clean);