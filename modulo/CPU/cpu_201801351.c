#include <linux/init.h>
#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>
#include <linux/fs.h>
#include <linux/mm.h> // get_mm_rss()

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Elmer Gustavo Sanchez Garcia");
MODULE_DESCRIPTION("Modulo de monitor de CPU");
MODULE_VERSION("1.0");

struct task_struct *task;       // Definida en sched.h para tareas/procesos
struct task_struct *task_child; // Utilizada para iterar a traves de tareas secundarias
struct list_head *list;         // Utilizada para recorrer la lista de cada tareas

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
static int open_f(struct inode *inode, struct file *file)
{
  return single_open(file, cpu_process, NULL);
}
static struct proc_ops file_ops = {
    .proc_open = open_f,
    .proc_read = seq_read,
};
static int __init event_init(void)
{
  proc_create("cpu_201801351", 0, NULL, &file_ops);
  printk(KERN_INFO "Elmer Gustavo Sanchez Garcia\n");
  return 0;
}
static void __exit event_exit(void)
{
  remove_proc_entry("cpu_201801351", NULL);
  printk(KERN_INFO "Diciembre 2021\n");
}
module_init(event_init);
module_exit(event_exit);

// getent passwd userID | cut -d: -f1
// top -> ver procesos