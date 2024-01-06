public class ToDoList
{
    public List<ToDoItem> ListOfToDoItems { get; set; }
    public ToDoList()
    {
        ListOfToDoItems = new List<ToDoItem>();
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
    public static void WriteOutTheContentOfAList(ToDoList toDoListToWriteOut)
    {
        foreach(var item in toDoListToWriteOut.ListOfToDoItems)
        {
            Console.WriteLine(item.Name);
        }
    }
}