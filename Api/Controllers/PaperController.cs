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
    public async Task<ActionResult<PaperDto>> PostPaper([FromBody]CreatePaperDto createPaperDto)
    {
        if (createPaperDto==null) 
        {
            return BadRequest(new { message = "Paper data is required." });
        }
        
        try
        {
            var createdPaper = await service.CreatePaperAsync(createPaperDto);
            return CreatedAtAction(nameof(GetPaperById), new { id = createdPaper.Id }, createdPaper);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
        
    }
    
    [HttpGet]
    public ActionResult<IEnumerable<Paper>> GetPapers()
    {
        return service.GetAllPapers();
    }
        
        
    [HttpGet("api/paper/{id}")]
    public async Task<ActionResult<PaperDto>> GetPaperById(int id)
    {
        var paper = await service.GetPaperByIdAsync(id);
        if (paper ==null)
        {
            return NotFound($"Paper with ID {id} not found.");
        }
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
    
   


}