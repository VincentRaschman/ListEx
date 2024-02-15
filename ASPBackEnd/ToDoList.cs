using Microsoft.EntityFrameworkCore;
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
        ToDoItem newToDoItem = new ToDoItem(IdsGiven, name, ListOfToDoItems.Count, tag);
        IdsGiven++;
        ListOfToDoItems.Add(newToDoItem);
        IsEmpty = false;
    }
    public void ToggleItem(int itemId)
    {
            var itemToModify = ListOfToDoItems.FirstOrDefault(item => item.Id == itemId);
            itemToModify.IsComplete = (!itemToModify.IsComplete);
    }
    public void ChangeNameOfAnItem(int itemId, string newName)
    {
            var itemToModify = ListOfToDoItems.FirstOrDefault(item => item.Id == itemId);
            itemToModify.Name = newName;
    }
    public void ChangeTagOfAnItem(int itemId, string newTag)
    {
        using(var db = new ListContext())
        {
            var itemToModify = ListOfToDoItems.FirstOrDefault(item => item.Id == itemId);
            itemToModify.Tag = newTag;
            db.SaveChanges();
        }                
    }
    public void DeleteItem(int itemId)
    {
        using(var db = new ListContext())
        {
            var itemToRemove = ListOfToDoItems.FirstOrDefault(i => i.Id == itemId);
            if(itemToRemove != null)
            {
                db.ToDoItems.Remove(itemToRemove);
                db.SaveChanges();
            }
        }
 
        if(ListOfToDoItems.Count == 0)
            IsEmpty = true;
    }
    public void MoveItem(int idOfTheItemToRelocate, int newPlace)
    {   
        ToDoItem itemMoved = null;

        itemMoved = ListOfToDoItems.FirstOrDefault(i => i.Id == idOfTheItemToRelocate);
        ListOfToDoItems.ForEach(item => { if (item.PositionInList > itemMoved.PositionInList) item.PositionInList = item.PositionInList - 1; });

        if(newPlace < itemMoved.PositionInList)
        {
            itemMoved.PositionInList = newPlace;
        }
        else
        {
            itemMoved.PositionInList = newPlace - 1;
        }
        ListOfToDoItems.ForEach(item => { if (item.PositionInList >= itemMoved.PositionInList && item.Id != idOfTheItemToRelocate) item.PositionInList = item.PositionInList + 1; });
    }
    public static void WriteOutTheContentOfAList(ToDoList toDoListToWriteOut)
    {
        foreach(var item in toDoListToWriteOut.ListOfToDoItems)
        {
            Console.WriteLine(item.Name);
        }
    }
}