using DataAccess.Models;
using DataAccess.Dtos;
namespace DataAccess.Interfaces;

public interface IPaperStoreRepository
{
    List<Paper> GetAllPapers();

    Task<Paper?> GetPaperByIdAsync(int id);

    Task<Paper>InsertPaperAsync(Paper paper);

    void UpdatePaperStock(int paperId, int quantity);

    void DiscontinuePaper(int paperId);

    List<Paper> GetAllDiscontinuedPapers();

    List<Paper> GetPapersWithProperty(int propertyId);

    void DeletePaper(int paperId);
    
    Task<Property> GetPropertyByIdAsync(int propertyId);

    Task<Order> PlaceOrderAsync(Order order);
    
    Task<IEnumerable<Order>> GetOrdersByCustomerIdAsync(int customerId);
    
    Task<Order?> GetOrderByIdAsync(int orderId); 
    
    Task<IEnumerable<Order>> GetAllOrdersAsync();

    Task UpdateOrderAsync(Order order);
    
    Task<Customer>CreateCustomerAsync(Customer customer);
    
    Task<Customer?> GetCustomerByIdAsync(int id);

    Task<List<PropertyDto>> GetAllPropertiesAsync();

    Task LinkPaperWithPropertiesAsync(int paperId, List<int> propertyIds);


    Task<List<PropertyDto>> GetPropertiesForPaperAsync(int insertedPaperId);
}