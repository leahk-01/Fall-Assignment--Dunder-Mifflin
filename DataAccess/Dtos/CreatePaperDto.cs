using System.ComponentModel.DataAnnotations;

namespace DataAccess.Dtos;

public class CreatePaperDto
{
    [Required] [StringLength(255)] public required string Name { get; set; }

    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "Stock must be a non-negative number.")]
    public int Stock { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
    public double Price { get; set; }

    [Required] public List<int> PropertyIds { get; set; } = new();
}