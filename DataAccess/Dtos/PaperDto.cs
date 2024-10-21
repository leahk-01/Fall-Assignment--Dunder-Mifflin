namespace DataAccess.Dtos;

public class PaperDto
{
    public int Id { get; set; } 
    public string? Name { get; set; } 
    public decimal Price { get; set; }
    public List<PropertyDto>? Properties { get; set; }
    
}