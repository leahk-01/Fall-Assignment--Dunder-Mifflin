using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Models;

[Table("order_entries")]
[Index("OrderId", Name = "IX_order_entries_order_id")]
[Index("PaperId", Name = "IX_order_entries_paper_id")]
public class OrderEntry
{
    [Key] [Column("id")] public int Id { get; set; }

    [Column("quantity")] public int Quantity { get; set; }

    [Column("paper_id")] public int? PaperId { get; set; }

    [Column("order_id")] public int? OrderId { get; set; }

    [ForeignKey("OrderId")]
    [InverseProperty("OrderEntries")]
    public virtual Order? Order { get; set; }

    [ForeignKey("PaperId")]
    [InverseProperty("OrderEntries")]
    public virtual Paper? Paper { get; set; }
}