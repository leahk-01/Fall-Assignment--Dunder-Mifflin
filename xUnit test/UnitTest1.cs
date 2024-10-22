using DataAccess;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace xUnit_test;

public class PaperStoreRepositoryTests
{
    private async Task<MyDbContext> GetInMemoryDbContextAsync()
    {
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseInMemoryDatabase("paperstoreDb_" + Guid.NewGuid())
            .Options;
        var context = new MyDbContext(options);
        await SeedDataAsync(context);
        return context;
    }

    private async Task SeedDataAsync(MyDbContext context)
    {
        var properties = new List<Property>
        {
            new() { Id = 1, PropertyName = "Color", PropertyValue = "White" },
            new() { Id = 2, PropertyName = "Texture", PropertyValue = "Smooth" }
        };

        var papers = new List<Paper>
        {
            new()
            {
                Id = 1, Name = "Paper A", Stock = 10, Discontinued = false,
                Properties = new List<Property> { properties[0] }
            },
            new() { Id = 2, Name = "Paper B", Stock = 0, Discontinued = true }
        };

        await context.Properties.AddRangeAsync(properties);
        await context.Papers.AddRangeAsync(papers);
        await context.SaveChangesAsync();
    }


    [Fact]
    public async Task GetAllPapers_ShouldReturnAllPapers()
    {
        var context = await GetInMemoryDbContextAsync();
        var repository = new PaperStoreRepository(context);

        var result = repository.GetAllPapers();

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetPaperByIdAsync_ShouldReturnCorrectPaper()
    {
        var context = await GetInMemoryDbContextAsync();
        var repository = new PaperStoreRepository(context);

        var result = await repository.GetPaperByIdAsync(1);

        Assert.NotNull(result);
        Assert.Equal("Paper A", result.Name);
    }

    [Fact]
    public async Task InsertPaperAsync_ShouldAddPaper()
    {
        // Arrange
        var context = await GetInMemoryDbContextAsync();
        var repository = new PaperStoreRepository(context);
        var newPaper = new Paper { Id = 3, Name = "Paper C", Stock = 20 };

        // Act
        await repository.InsertPaperAsync(newPaper);
        var result = repository.GetAllPapers();

        // Assert
        Assert.Equal(3, result.Count);
        Assert.Contains(result, p => p.Name == "Paper C");
    }

    [Fact]
    public async Task UpdatePaperStock_ShouldUpdateStock()
    {
        var context = await GetInMemoryDbContextAsync();
        var repository = new PaperStoreRepository(context);

        repository.UpdatePaperStock(1, 5);
        var result = await repository.GetPaperByIdAsync(1);

        Assert.Equal(15, result.Stock);
    }


    [Fact]
    public async Task LinkPaperWithPropertiesAsync_ShouldLinkPropertiesToPaper()
    {
        var context = await GetInMemoryDbContextAsync();
        var repository = new PaperStoreRepository(context);
        var propertyIds = new List<int> { 1, 2 };


        await repository.LinkPaperWithPropertiesAsync(1, propertyIds);
        var result = await repository.GetPaperByIdAsync(1);


        Assert.Equal(2, result.Properties.Count);
    }
}