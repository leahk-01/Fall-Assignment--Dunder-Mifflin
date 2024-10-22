using DataAccess.Dtos;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaperController(PaperStoreService service) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<PaperDto>> PostPaper([FromBody] CreatePaperDto? createPaperDto)
    {
        if (createPaperDto == null) return BadRequest(new { message = "Paper data is required." });

        try
        {
            var createdPaper = await service.CreatePaperAsync(createPaperDto); // Create the paper
            return Ok(createdPaper);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("all")]
    public ActionResult<IEnumerable<Paper>> GetPapers()
    {
        return service.GetAllPapers();
    }


    [HttpGet("api/paper/{id}")]
    public async Task<ActionResult<PaperDto>> GetPaperById(int id)
    {
        var paper = await service.GetPaperByIdAsync(id);
        return Ok(paper);
    }


    [HttpPut("discontinue/{id}")]
    public ActionResult DiscontinueProduct(int id)
    {
        service.DiscontinuePaper(id);
        return NoContent();
    }

    [HttpPut("restock/{id}")]
    public ActionResult RestockProduct(int id, [FromBody] int quantity)
    {
        service.RestockPaper(id, quantity);
        return NoContent();
    }

    [HttpGet("properties")]
    public async Task<IActionResult> GetProperties()
    {
        try
        {
            var properties = await service.GetAllPropertiesAsync();

            if (properties.Count == 0)
            {
                Console.WriteLine("No properties found.");
                return NotFound("No properties found.");
            }

            Console.WriteLine($"Properties fetched: {properties.Count}"); // Log the number of properties
            return Ok(properties);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching properties: {ex.Message}"); // Log the error
            return StatusCode(500, "An error occurred while fetching properties.");
        }
    }
}