using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var toDoList = new ToDoList();

app.MapGet("/", () => "Hello World!");

app.MapGet("/pivo", () => "Plzeň");

app.MapGet("/martin", () => "Paštika");

app.MapGet("/ToDoList", () => {
    Console.WriteLine("Vraciam get");
    return toDoList;
    });

app.MapPost("/NewItem", async (HttpRequest request) => {
    Console.WriteLine("spracovavam post");

    var body = await new StreamReader(request.Body).ReadToEndAsync();

    var jsonDocument = JsonDocument.Parse(body);
    var itemName = jsonDocument.RootElement.GetProperty("itemName").GetString();

    toDoList.AddItem(itemName);
    Console.WriteLine("koncim post, item vytvoreny : {0}", itemName);
    Console.WriteLine("Cely list:");
    ToDoList.WriteOutTheContentOfAList(toDoList);
});

app.MapPost("/ToggleCompletitionOfItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var oldState = bool.Parse(jsonDocument.RootElement.GetProperty("message").GetString());
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    Console.WriteLine("Items: {0} completion attribute was toggled. Old state {1}", itemId, oldState);
    Console.WriteLine(itemId);
    toDoList.ToggleItem(itemId);
});

app.MapPost("/ChangeNameOfAnItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var newName = jsonDocument.RootElement.GetProperty("newName").GetString();
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    Console.WriteLine("Changing name of item with id: {0} to new name {1}", itemId, newName);
    Console.WriteLine(newName);
    Console.WriteLine(itemId);
    toDoList.ChangeNameOfAnItem(itemId, newName);
});

app.MapPost("/DeleteItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    Console.WriteLine("Deleting item {0}", itemId);
    Console.WriteLine(itemId);
    toDoList.DeleteItem(itemId);
});

app.Run();