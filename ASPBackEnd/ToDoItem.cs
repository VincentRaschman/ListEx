public class ToDoItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsComplete { get; set; }
    public string? Tag { get; set; }
    public ToDoItem(int id, string name, string? tag = null)
    {
        Id = id;
        Name = name;
        IsComplete = false;
        Tag = tag;
    }
}