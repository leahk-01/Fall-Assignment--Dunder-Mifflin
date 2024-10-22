using DataAccess.Dtos;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly PaperStoreService service;

    public OrdersController(PaperStoreService service)
    {
        this.service = service;
    }

    [HttpPost("place-order/{customerId}")]
    public async Task<ActionResult> PlaceOrder(int customerId, [FromBody] OrderDto orderDto)
    {
        if (orderDto == null) return BadRequest(new { message = "Order data is required." });

        orderDto.CustomerId = customerId;

        try
        {
            if (orderDto.OrderEntries == null || !orderDto.OrderEntries.Any())
                return BadRequest(new { message = "At least one order entry is required." });

            var createdOrder = await service.PlaceOrderAsync(orderDto);

            return CreatedAtAction(nameof(GetOrderById), new { orderId = createdOrder.Id }, createdOrder);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("customer-history/{customerId}")]
    public async Task<ActionResult> GetOrderHistory(int customerId)
    {
        var orders = await service.GetOrderHistoryAsync(customerId);
        return Ok(orders);
    }

    [HttpGet("info/{orderId}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int orderId)
    {
        var order = await service.GetOrderByIdAsync(orderId);
        return order != null ? Ok(order) : NotFound($"Order with ID {orderId} not found");
    }

    [HttpGet]
    public async Task<ActionResult> GetAllOrders()
    {
        var orders = await service.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpPut("status/{orderId}")]
    public async Task<ActionResult> UpdateOrderStatus(int orderId, [FromBody] OrderStatusDto updateStatusDto)
    {
        if (string.IsNullOrEmpty(updateStatusDto.Status)) return BadRequest("New status cannot be null or empty.");

        var result = await service.UpdateOrderStatusAsync(orderId, updateStatusDto);
        if (result == null) return NotFound();

        return Ok(result);
    }
}