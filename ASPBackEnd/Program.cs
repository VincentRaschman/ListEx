using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.MapGet("/GetOneToDoList", ([FromQuery] int listId) => {
    Console.WriteLine("Returning list with id:{0}", listId);
    using(var db = new ListContext())
    {
        return db.ToDoLists.Find(listId);
    }
    });

app.MapGet("/GetAllToDoLists", () => {
    Console.WriteLine("Returning All lists");
     using(var db = new ListContext())
    {
        var toDoLists = db.ToDoLists.Include(o => o.ListOfToDoItems).ToList();
        if (toDoLists.Count > 0)
            toDoLists.ForEach(list => list.ListOfToDoItems = list.ListOfToDoItems.OrderBy(item => item.PositionInList).ToList());
        return toDoLists;
        //return db.ToDoLists.Include(o=>o.ListOfToDoItems).ToList();
    }
    });

app.MapPost("/NewItem", async (HttpRequest request) => {
    Console.WriteLine("spracovavam post");

    var body = await new StreamReader(request.Body).ReadToEndAsync();

    var jsonDocument = JsonDocument.Parse(body);
    var itemName = jsonDocument.RootElement.GetProperty("itemName").GetString();
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("listId").GetString());

    using(var db = new ListContext())
    {
        var toDoLists = db.ToDoLists.Include(o => o.ListOfToDoItems).ToList();
        toDoLists.ForEach( list => { if (list.Id == listId) list.AddItem(itemName, "white"); }) ;

        /*ListOfToDoItems.ForEach(item => { if (item.PositionInList > itemMoved.PositionInList) item.PositionInList = item.PositionInList - 1; });

        db.ToDoLists.Find(listId).AddItem(itemName, "white");*/
        db.SaveChanges();
    }
    Console.WriteLine("koncim post, item vytvoreny : {0}", itemName);
    Console.WriteLine("Cely list:");
});

app.MapPost("/ToggleCompletionOfItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var oldState = bool.Parse(jsonDocument.RootElement.GetProperty("switchState").GetString());
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("listId").GetString());
    using(var db = new ListContext())
    {
        var listWithModifiedItem = db.ToDoLists.Include(o => o.ListOfToDoItems).FirstOrDefault(list => list.Id == listId);
        listWithModifiedItem.ToggleItem(itemId);

        db.SaveChanges();
    }
    Console.WriteLine("Items: {0} in list:{1}completion attribute was toggled. Old state {2}", itemId, listId, oldState);
});

app.MapPost("/ChangeNameOfAnItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var newName = jsonDocument.RootElement.GetProperty("newName").GetString();
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("listId").GetString());

    using(var db = new ListContext())
    {
        var listWithModifiedItem = db.ToDoLists.Include(o => o.ListOfToDoItems).FirstOrDefault(list => list.Id == listId);
        listWithModifiedItem.ChangeNameOfAnItem(itemId, newName);
        db.SaveChanges();
    }

    Console.WriteLine("Changing name of item with id: {0} in list with id:{1} to new name {2}", itemId, listId, newName);
});

app.MapPost("/ChangeTag", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var newTag = jsonDocument.RootElement.GetProperty("newTag").GetString();
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("listId").GetString());
    using(var db = new ListContext())
    {
        var listWithModifiedItem = db.ToDoLists.Include(o => o.ListOfToDoItems).FirstOrDefault(list => list.Id == listId);
        listWithModifiedItem.ChangeTagOfAnItem(itemId, newTag);

        db.SaveChanges();
    }
    Console.WriteLine("Changing tag of item with id: {0} in list with id:{1}", itemId, listId);
});

app.MapPost("/DeleteItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("ListId").GetString());

    using(var db = new ListContext())
    {
        var listWithModifiedItem = db.ToDoLists.Include(o => o.ListOfToDoItems).FirstOrDefault(list => list.Id == listId);
        listWithModifiedItem.DeleteItem(itemId);
        db.SaveChanges();
    }

    Console.WriteLine("Deleting item {0} in list {1}", itemId, listId);
});

app.MapPost("/RelocateItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var newPlaceInList = Int32.Parse(jsonDocument.RootElement.GetProperty("newPlaceInList").GetString());
    var idOfTheItemToRelocate = Int32.Parse(jsonDocument.RootElement.GetProperty("idOfTheItemToRelocate").GetString());
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("ListId").GetString());
    using(var db = new ListContext())
    {
        var listWithModifiedItem = db.ToDoLists.Include(o => o.ListOfToDoItems).FirstOrDefault(list => list.Id == listId);
        listWithModifiedItem.MoveItem(idOfTheItemToRelocate, newPlaceInList);

        db.SaveChanges();
    }
    Console.WriteLine("Relocate item");
});

app.MapPost("/NewList", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var listName = jsonDocument.RootElement.GetProperty("listName").GetString();

    //var newToDoList = new ToDoList(listName, toDoLists.Count());
    var newToDoList = new ToDoList();
    newToDoList.ListName = listName;

    using(var db = new ListContext())
    {
        db.Add(newToDoList);
        db.SaveChanges();
    }
    //toDoLists.Add(newToDoList);
    Console.WriteLine("List {0} created", listName);
});

app.MapPost("/DeleteList", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("ListId").GetString());
    using(var db = new ListContext())
    {
        var listWithModifiedItem = db.ToDoLists.Include(o => o.ListOfToDoItems).FirstOrDefault(list => list.Id == listId);
        db.ToDoLists.Remove(listWithModifiedItem);
        db.SaveChanges();
    }
    Console.WriteLine("Deleting list {0}", listId);
});

app.Run();