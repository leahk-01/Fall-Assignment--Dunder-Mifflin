using DataAccess.Dtos;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CustomersController(PaperStoreService service) : ControllerBase
{
    [HttpPost("create")]
    public async Task<ActionResult> CreateCustomer([FromBody] CustomerDto customerDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var createdCustomer = await service.CreateCustomerAsync(customerDto);
        return CreatedAtAction(nameof(GetCustomerById), new { id = createdCustomer.Id }, createdCustomer);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult> GetCustomerById(int id)
    {
        var customer = await service.GetCustomerByIdAsync(id);
        return customer != null ? Ok(customer) : NotFound($"Customer with ID {id} not found.");
    }
}