using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

public class ListContext : DbContext
{
    public DbSet<ToDoList> ToDoLists { get; set; }
    public DbSet<ToDoItem> ToDoItems { get; set; }

    public string DbPath { get; }  

    public ListContext()
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = System.IO.Path.Join(path, "Database.db");
    }

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}