using DataAccess.Dtos;
using DataAccess.Interfaces;
using DataAccess.Models;

namespace Service;

public class PaperStoreService
{
    private readonly IPaperStoreRepository _repository;

    public PaperStoreService(IPaperStoreRepository repository)
    {
        _repository = repository;
    }

    public List<Paper> GetAllPapers()
    {
        return _repository.GetAllPapers();
    }

    public async Task<PaperDto> CreatePaperAsync(CreatePaperDto? createPaperDto)
    {
        var paper = new Paper
        {
            Name = createPaperDto.Name,
            Stock = createPaperDto.Stock,
            Price = createPaperDto.Price,
            Discontinued = false
        };

        var insertedPaper = await _repository.InsertPaperAsync(paper);

        // SLink the new paper with the selected properties
        if (createPaperDto?.PropertyIds != null && createPaperDto.PropertyIds.Count > 0)
            await _repository.LinkPaperWithPropertiesAsync(insertedPaper.Id, createPaperDto.PropertyIds);

        // Fetch the properties 
        var linkedProperties = await _repository.GetPropertiesForPaperAsync(insertedPaper.Id);

        // Return the created paper details along with its linked properties
        return new PaperDto
        {
            Id = insertedPaper.Id,
            Name = insertedPaper.Name,
            Stock = insertedPaper.Stock,
            Price = (decimal)insertedPaper.Price,
            Properties = linkedProperties // Return only the linked properties
        };
    }


    public async Task<PaperDto> GetPaperByIdAsync(int id)
    {
        var paper = await _repository.GetPaperByIdAsync(id);
        if (paper == null) return null;

        var paperDto = new PaperDto
        {
            Name = paper.Name,
            Price = (decimal)paper.Price,
            Stock = paper.Stock,
            Properties = paper.Properties.Select(pp => new PropertyDto
            {
                Id = pp.Id,
                PropertyName = pp.PropertyName,
                PropertyValue = pp.PropertyValue
            }).ToList()
        };

        return paperDto;
    }


    public void DiscontinuePaper(int id)
    {
        _repository.DiscontinuePaper(id);
    }

    public void RestockPaper(int id, int quantity)
    {
        _repository.UpdatePaperStock(id, quantity);
    }


    // orders

    public async Task<Order> PlaceOrderAsync(OrderDto orderDto)
    {
        var orderEntries = new List<OrderEntry>();
        double totalAmount = 0;

        foreach (var orderEntryDto in orderDto.OrderEntries)
        {
            var product = await _repository.GetPaperByIdAsync(orderEntryDto.PaperId);
            if (product == null) throw new ArgumentException($"Invalid product ID: {orderEntryDto.PaperId}");

            var orderEntry = new OrderEntry
            {
                PaperId = orderEntryDto.PaperId,
                Quantity = orderEntryDto.Quantity
            };

            totalAmount += product.Price * orderEntry.Quantity;
            orderEntries.Add(orderEntry);
        }

        var order = new Order
        {
            OrderDate = DateTime.UtcNow,
            DeliveryDate = DateTime.UtcNow.AddDays(3),
            Status = orderDto.Status,
            CustomerId = orderDto.CustomerId,
            OrderEntries = orderEntries,
            TotalAmount = totalAmount
        };

        return await _repository.PlaceOrderAsync(order);
    }


    public async Task<IEnumerable<Order>> GetOrderHistoryAsync(int customerId)
    {
        return await _repository.GetOrdersByCustomerIdAsync(customerId);
    }

    public async Task<object?> GetOrderByIdAsync(int orderId)
    {
        return await _repository.GetOrdersByCustomerIdAsync(orderId);
    }

    public async Task<object?> GetAllOrdersAsync()
    {
        return await _repository.GetAllOrdersAsync();
    }

    public async Task<Order?> UpdateOrderStatusAsync(int orderId, OrderStatusDto orderStatusDto)
    {
        var order = await _repository.GetOrderByIdAsync(orderId);

        if (order == null) return null;

        order.Status = orderStatusDto.Status;

        await _repository.UpdateOrderAsync(order);

        return order;
    }

    //customer

    public async Task<Customer> CreateCustomerAsync(CustomerDto customerDto)
    {
        var customer = new Customer
        {
            Name = customerDto.Name,
            Address = customerDto.Address,
            Phone = customerDto.Phone,
            Email = customerDto.Email
        };

        var createdCustomer = await _repository.CreateCustomerAsync(customer);
        return createdCustomer;
    }


    public async Task<Customer?> GetCustomerByIdAsync(int id)
    {
        return await _repository.GetCustomerByIdAsync(id);
    }


    public async Task<List<PropertyDto>> GetAllPropertiesAsync()
    {
        return await _repository.GetAllPropertiesAsync();
    }
}