public class ToDoList
{
    public List<ToDoItem> ListOfToDoItems { get; set; }
    private int IdsGiven{ get; set; }
    public string ListName{ get; set;}
    public int Id{ get;}
    public bool IsEmpty{ get; set;}
    public ToDoList(string listName, int id)
    {
        IdsGiven = 0;
        ListName = listName;
        ListOfToDoItems = new List<ToDoItem>();
        Id = id;
        IsEmpty = true;
    }
    public void AddItem(string name, string? tag = null)
    {
        ToDoItem newToDoItem = new ToDoItem(IdsGiven, name, tag);
        IdsGiven++;
        ListOfToDoItems.Add(newToDoItem);
        IsEmpty = false;
    }
    public void ToggleItem(int itemId)
    {
        ListOfToDoItems[itemId].IsComplete = !(ListOfToDoItems[itemId].IsComplete);
    }
    public void ChangeNameOfAnItem(int itemId, string newName)
    {
        ListOfToDoItems[itemId].Name = newName;
    }
    public void ChangeTagOfAnItem(int itemId, string newTag)
    {
        ListOfToDoItems[itemId].Tag = newTag;
    }
    public void DeleteItem(int itemId)
    {
        ListOfToDoItems.RemoveAt(itemId);
        if(ListOfToDoItems.Count == 0)
            IsEmpty = true;
    }
    public void MoveItem(int idOfTheItemToRelocate, int newPlace)
    {   
        int currentPositionOfTheItem = -1;
        ToDoItem itemMoved = null;
        foreach (var item in ListOfToDoItems)
        {
            if(item.Id == idOfTheItemToRelocate)
            {    
                currentPositionOfTheItem = ListOfToDoItems.IndexOf(item);
                itemMoved = item;
                
            }
        }

        ListOfToDoItems.RemoveAt(currentPositionOfTheItem);
        
        if(newPlace < currentPositionOfTheItem)
        {
            ListOfToDoItems.Insert(newPlace, itemMoved);
        }
        else
        {
            ListOfToDoItems.Insert(newPlace - 1, itemMoved);
        }
    }
    public static void WriteOutTheContentOfAList(ToDoList toDoListToWriteOut)
    {
        foreach(var item in toDoListToWriteOut.ListOfToDoItems)
        {
            Console.WriteLine(item.Name);
        }
    }
}