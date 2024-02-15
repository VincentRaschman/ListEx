public class ToDoItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsComplete { get; set; }
    public string? Tag { get; set; }
    public int PositionInList { get; set; }
    public ToDoItem(int id, string name, int positionInList, string? tag = null)
    {
        Id = id;
        Name = name;
        IsComplete = false;
        Tag = tag;
        PositionInList = positionInList;
    }
}