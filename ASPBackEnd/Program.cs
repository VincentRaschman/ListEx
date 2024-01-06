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
    Console.WriteLine(body);

    var jsonDocument = JsonDocument.Parse(body);
    var message = jsonDocument.RootElement.GetProperty("message").GetString();

    toDoList.AddItem(message);
    ToDoList.WriteOutTheContentOfAList(toDoList);
    Console.WriteLine("koncim post");

});

app.MapPost("/ToggleCompletitionOfItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var oldState = bool.Parse(jsonDocument.RootElement.GetProperty("message").GetString());
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    Console.WriteLine(oldState);
    Console.WriteLine(itemId);
    toDoList.ToggleItem(itemId);
});

app.MapPost("/ChangeNameOfAnItem", async (HttpRequest request) => {
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    var jsonDocument = JsonDocument.Parse(body);
    var newName = jsonDocument.RootElement.GetProperty("Newname").GetString();
    var itemId = Int32.Parse(jsonDocument.RootElement.GetProperty("id").GetString());
    Console.WriteLine(newName);
    Console.WriteLine(itemId);
    toDoList.ChangeNameOfAnItem(itemId, newName);
});

app.Run();