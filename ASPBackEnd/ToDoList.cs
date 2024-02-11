public class ToDoList
{
    public List<ToDoItem> ListOfToDoItems { get; set; }
    private int IdsGiven{ get; set; }
    public string ListName{ get; set;}
    public int Id{ get; set;}
    public bool IsEmpty{ get; set;}
    public ToDoList(string listName, int id)
    {
        IdsGiven = 0;
        ListName = listName;
        ListOfToDoItems = new List<ToDoItem>();
        Id = id;
        IsEmpty = true;
    }
    public ToDoList()
    {
        ListOfToDoItems = new List<ToDoItem>();
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
        foreach (var item in ListOfToDoItems)
        {
            if(item.Id == itemId)
            {
                ListOfToDoItems[ListOfToDoItems.IndexOf(item)].IsComplete = !(ListOfToDoItems[ListOfToDoItems.IndexOf(item)].IsComplete);
                return;
            }
        }
    }
    public void ChangeNameOfAnItem(int itemId, string newName)
    {
        foreach (var item in ListOfToDoItems)
        {
            if(item.Id == itemId)
            {
                ListOfToDoItems[ListOfToDoItems.IndexOf(item)].Name = newName;
                return;
            }
        }
    }
    public void ChangeTagOfAnItem(int itemId, string newTag)
    {
        foreach (var item in ListOfToDoItems)
        {
            if(item.Id == itemId)
            {
                ListOfToDoItems[ListOfToDoItems.IndexOf(item)].Tag = newTag;
                return;
            }
        }
    }
    public void DeleteItem(int itemId)
    {
        foreach (var item in ListOfToDoItems)
        {
            if(item.Id == itemId)
            {
                ListOfToDoItems.RemoveAt(ListOfToDoItems.IndexOf(item));
                return;
            }
        }

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