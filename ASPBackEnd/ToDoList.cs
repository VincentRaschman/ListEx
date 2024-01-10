public class ToDoList
{
    public List<ToDoItem> ListOfToDoItems { get; set; }
    public string ListName{ get; set;}
    public int Id { get;}
    public ToDoList(string listName, int id)
    {
        ListName = listName;
        ListOfToDoItems = new List<ToDoItem>();
        Id = id;
    }
    public void AddItem(string name, string? tag = null)
    {
        ToDoItem newToDoItem = new ToDoItem(ListOfToDoItems.Count(), name, tag);
        ListOfToDoItems.Add(newToDoItem);
    }
    public void ToggleItem(int itemId)
    {
        ListOfToDoItems[itemId].IsComplete = !(ListOfToDoItems[itemId].IsComplete);
    }
    public void ChangeNameOfAnItem(int itemId, string newName)
    {
        ListOfToDoItems[itemId].Name = newName;
    }
    public void DeleteItem(int itemId)
    {
        ListOfToDoItems.RemoveAt(itemId);
    }
    public static void WriteOutTheContentOfAList(ToDoList toDoListToWriteOut)
    {
        foreach(var item in toDoListToWriteOut.ListOfToDoItems)
        {
            Console.WriteLine(item.Name);
        }
    }
}