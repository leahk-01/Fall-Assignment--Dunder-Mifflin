namespace DataAccess.Dtos;

public class OrderDto
{
    public int CustomerId { get; set; }
    public List<OrderEntryDto> OrderEntries { get; set; } = new List<OrderEntryDto>();
    public string Status { get; set; } = "Pending";
}