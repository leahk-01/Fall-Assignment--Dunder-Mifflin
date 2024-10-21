using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using DataAccess.Dtos;

namespace DataAccess;

public class PaperStoreRepository : IPaperStoreRepository
{
    private readonly MyDbContext _context;

    public PaperStoreRepository(MyDbContext context)
    {
        _context = context;
    }

    public List<Paper> GetAllPapers()
    {
        return _context.Papers.ToList();
    }

    public async Task<Paper?> GetPaperByIdAsync(int id)
    {
        var paper = await _context.Papers
            .Include(p => p.Properties)  //load the related properties
            .FirstOrDefaultAsync(p => p.Id == id);

        return paper;
    }
    
  public async Task<Paper> InsertPaperAsync(Paper paper)
  {
       _context.Papers.Add(paper);
      await _context.SaveChangesAsync();
      return paper;
  }
 
    public void UpdatePaperStock(int paperId, int quantity)
    {
        var paper = _context.Papers.Find(paperId);
        if (paper != null)
        {
            paper.Stock += quantity;
            _context.SaveChanges();
        }
    }

    public void DiscontinuePaper(int paperId)
    {
        var paper = _context.Papers.Find(paperId);
        if (paper != null)
        {
            paper.Discontinued = true;
            _context.SaveChanges();
        }
    }

    public List<Paper> GetAllDiscontinuedPapers()
    {
        return _context.Papers.Where(p => p.Discontinued).ToList();
    }

    public List<Paper> GetPapersWithProperty(int propertyId)
    {
        return _context.Papers
            .Include(p => p.Properties)
            .Where(p => p.Properties.Any(prop => prop.Id == propertyId))
            .ToList();
    }

    public void DeletePaper(int paperId)
    {
        var paper = _context.Papers.Find(paperId);
        if (paper != null)
        {
            _context.Papers.Remove(paper);
            _context.SaveChanges();
        } 
    }
    // chnage to async
     public async Task<Property> GetPropertyByIdAsync(int propertyId)
     {
         var property = await _context.Properties.FindAsync(propertyId);
         if (property == null)
         {
             throw new Exception("Property not found");  
         }
         return property;
     }

     public async Task<Order> PlaceOrderAsync(Order order)
     {
         _context.Orders.Add(order);
         await _context.SaveChangesAsync();
         return order;
     }

     public async Task<IEnumerable<Order>> GetOrdersByCustomerIdAsync(int customerId)
     {
         return await _context.Orders
             .Include(o => o.OrderEntries)
             .ThenInclude(oe => oe.Paper)
             .Where(o => o.CustomerId == customerId)
             .ToListAsync();
     }

     public async Task<Order?> GetOrderByIdAsync(int orderId)
     {
         return await _context.Orders
             .Include(o => o.OrderEntries)
             .ThenInclude(oe => oe.Paper)
             .FirstOrDefaultAsync(o => o.Id == orderId);
     }

     public async Task<IEnumerable<Order>> GetAllOrdersAsync()
     {
         return await _context.Orders
             .Include(o => o.OrderEntries)
             .ThenInclude(oe => oe.Paper)
             .ToListAsync();
     }

     public async Task UpdateOrderAsync(Order order)
     {
         _context.Orders.Update(order); 
         await _context.SaveChangesAsync();  
     }
     
     
     public async Task<Customer> CreateCustomerAsync(Customer customer)
        {
             await _context.Customers.AddAsync(customer);
             await _context.SaveChangesAsync();
             return customer;
        }
        
     public async Task<Customer?> GetCustomerByIdAsync(int id)
     {
         return await _context.Customers.FindAsync(id);
         
     }

   


     public async Task<List<PropertyDto>> GetAllPropertiesAsync()
     {
         try
         {
             var properties = await _context.Properties
                 .Select(p => new PropertyDto
                 {
                     Id = p.Id,
                     PropertyName = p.PropertyName,
                     PropertyValue = p.PropertyValue
                 })
                 .ToListAsync();

             if (properties.Count == 0)
             {
                 Console.WriteLine("No properties found.");
             }
             return properties;
         }
         catch (Exception ex)
         {
           
             Console.WriteLine($"Database error: {ex.Message}");
             throw; 
         }
     }


     
     public async Task LinkPaperWithPropertiesAsync(int paperId, List<int> propertyIds)
     {
         //  Fetch the paper by its ID
         var paper = await _context.Papers
             .Include(p => p.Properties)  // Include existing linked properties
             .FirstOrDefaultAsync(p => p.Id == paperId);

         if (paper == null)
         {
             throw new Exception("Paper not found");
         }

         //  Fetch the properties that match the provided property id
         var properties = await _context.Properties
             .Where(p => propertyIds.Contains(p.Id))
             .ToListAsync();

         // Link  selected properties to the paper
         foreach (var property in properties)
         {
             if (!paper.Properties.Contains(property))  
             {
                 paper.Properties.Add(property);  
             }
         }

         await _context.SaveChangesAsync();
     }


     public async Task<List<PropertyDto>> GetPropertiesForPaperAsync(int paperId)
     {
         // get properties associated with the paper from the PaperProperties join table : for paper view
         var properties = await _context.Properties
             .Where(pp => pp.Id == paperId)
             .Select(pp => new PropertyDto
             {
                 Id = pp.Id,
                 PropertyName = pp.PropertyName,
                 PropertyValue = pp.PropertyValue
             })
             .ToListAsync();

         return properties;
     }

     
     


     
}