using System.ComponentModel.DataAnnotations;

namespace DataAccess.Dtos;

public class CustomerDto
{
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = null!;

    public string? Address { get; set; }

    [Required(ErrorMessage = "Phone number is required")]
    [RegularExpression(@"^\d+$", ErrorMessage = "Phone number must contain only numbers")]
    public string? Phone { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; set; }
}
