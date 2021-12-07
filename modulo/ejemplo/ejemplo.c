#include <linux/module.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <linux/sched.h>
#include <linux/uaccess.h>
#include <linux/fs.h>
#include <linux/sysinfo.h>
#include <linux/seq_file.h>
#include <linux/slab.h>
#include <linux/mm.h>
#include <linux/swap.h>
#include <linux/timekeeping.h>

MODULE_LICENCE("GPL");
MODULE_AUTHOR("Gustavo Sanchez")
MODULE_DESCRIPTION("Modulo que muestra la hora del sistema");
MODULE_VERSION("0.01");

static int __init inicio(void)
{
  // hola mundo
}

// LOAD FUNCTIONS
MODULE_INIT(inicio)
MODULE_EXIT(fin)