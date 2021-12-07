/* LIBRARIES */
#include <linux/init.h>
#include <linux/module.h>
#include <linux/fs.h>
#include <linux/kernel.h>
#include <linux/hugetlb.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Elmer Gustavo Sanchez Garcia");
MODULE_DESCRIPTION("Get information about memory");
MODULE_VERSION("0.1");

/* GET INFORMATION */
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
  seq_printf(file_proc, "\"Total RAM\": %8lu,", K(i.totalram) / 1024);
  seq_printf(file_proc, "\"Libre\": %8lu,", K(i.freeram) / 1024);
  seq_printf(file_proc, "\"Total consumida\": %8lu,", (K(i.totalram) - K(i.freeram) - K(i.bufferram)) / 1024);
  seq_printf(file_proc, "\"Porcentaje\": %8lu", (((K(i.totalram) - K(i.freeram) - K(i.bufferram)) / 1024) * 100) / (K(i.totalram) / 1024));
  seq_printf(file_proc, "}\n");
#undef K

  return 0;
}

/* OPEN PROC */
static int proc_ram_open(struct inode *inode, struct file *file)
{
  return single_open(file, get_information, NULL);
}

/* OPERATIONS STRUCT */
static struct proc_ops ram_operations = {
    .proc_open = proc_ram_open,
    .proc_read = seq_read,
    .proc_lseek = seq_lseek,
    .proc_release = single_release};

/* MAIN EVENT */
static int __init ram_module_init(void)
{

  // 0 : OK - 1 : error
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

/* FINAL EVENT */
static void __exit ram_module_exit(void)
{
  remove_proc_entry("memo_201801351", NULL);
  printk(KERN_INFO "Sistemas Operativos 1\n");
}

/* LOAD FUNCTIONS */
module_init(ram_module_init);
module_exit(ram_module_exit);
