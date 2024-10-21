namespace DataAccess.Dtos;
using DataAccess.Dtos;
public class PropertyDto
{
    public int Id { get; set; }  // Unique ID of the property option
    public string? PropertyName { get; set; }  // E.g., "Texture", "Color"
    public string? PropertyValue { get; set; }  // E.g., "Smooth", "White"
}
