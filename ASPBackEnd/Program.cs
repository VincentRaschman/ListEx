using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var toDoLists = new List<ToDoList>();

app.MapGet("/", () => "Hello World!");

app.MapGet("/GetOneToDoList", ([FromQuery] int listId) => {
    Console.WriteLine("Returning list with id:{0}", listId);
    return toDoLists[listId];
    });

app.MapGet("/GetAllToDoLists", () => {
    Console.WriteLine("Returning All lists");
    return toDoLists;
    });

app.MapPost("/NewItem", async (HttpRequest request) => {
    Console.WriteLine("spracovavam post");

    var body = await new StreamReader(request.Body).ReadToEndAsync();

    var jsonDocument = JsonDocument.Parse(body);
    var itemName = jsonDocument.RootElement.GetProperty("itemName").GetString();
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("listId").GetString());

    toDoLists[listId].AddItem(itemName, "white");
    Console.WriteLine("koncim post, item vytvoreny : {0}", itemName);
    Console.WriteLine("Cely list:");
    ToDoList.WriteOutTheContentOfAList(toDoLists[listId]);
});

app.MapPost("/ToggleCompletionOfItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var oldState = bool.Parse(jsonDocument.RootElement.GetProperty("switchState").GetString());
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("listId").GetString());
    Console.WriteLine("Items: {0} in list:{1}completion attribute was toggled. Old state {2}", itemId, listId, oldState);
    toDoLists[listId].ToggleItem(itemId);
});

app.MapPost("/ChangeNameOfAnItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var newName = jsonDocument.RootElement.GetProperty("newName").GetString();
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("listId").GetString());
    Console.WriteLine("Changing name of item with id: {0} in list with id:{1} to new name {2}", itemId, listId, newName);
    toDoLists[listId].ChangeNameOfAnItem(itemId, newName);
});

app.MapPost("/ChangeTag", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var newTag = jsonDocument.RootElement.GetProperty("newTag").GetString();
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("listId").GetString());
    Console.WriteLine("Changing tag of item with id: {0} in list with id:{1}", itemId, listId);
    toDoLists[listId].ChangeTagOfAnItem(itemId, newTag);
});

app.MapPost("/DeleteItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("ListId").GetString());
    Console.WriteLine("Deleting item {0} in list {1}", itemId, listId);
    toDoLists[listId].DeleteItem(itemId);
});

app.MapPost("/NewList", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var listName = jsonDocument.RootElement.GetProperty("listName").GetString();

    var newToDoList = new ToDoList(listName, toDoLists.Count());
    toDoLists.Add(newToDoList);
    Console.WriteLine("List {0} created", listName);
});

app.MapPost("/DeleteList", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var listId = Int32.Parse(jsonDocument.RootElement.GetProperty("ListId").GetString());
    Console.WriteLine("Deleting list {0}", listId);
    toDoLists.RemoveAt(listId);
});

app.Run();