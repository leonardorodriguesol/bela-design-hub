using System.Net;
using System.Net.Http.Json;
using BelaDesignHub.Api.Tests.Infrastructure;
using BelaDesignHub.Application.Models.Requests;
using BelaDesignHub.Domain.Entities;

namespace BelaDesignHub.Api.Tests.Controllers;

public class ProductsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ProductsControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateProduct_ShouldPersistWithParts()
    {
        var request = BuildProductRequest();

        var createResponse = await _client.PostAsJsonAsync("/api/products", request);
        createResponse.EnsureSuccessStatusCode();

        var created = await createResponse.Content.ReadFromJsonAsync<Product>();

        Assert.NotNull(created);
        Assert.Equal(request.Name, created!.Name);
        Assert.Equal(request.Parts.Count, created.Parts.Count);
    }

    [Fact]
    public async Task GetProducts_ShouldReturnInsertedProduct()
    {
        var created = await CreateProductAsync();

        var response = await _client.GetAsync("/api/products");
        response.EnsureSuccessStatusCode();

        var products = await response.Content.ReadFromJsonAsync<List<Product>>();

        Assert.Contains(products!, p => p.Id == created.Id);
    }

    [Fact]
    public async Task UpdateProduct_ShouldReplaceParts()
    {
        var created = await CreateProductAsync();
        var updateRequest = new UpdateProductRequest
        {
            Name = "Produto Atualizado",
            Description = "Novo layout",
            Parts =
            [
                new ProductPartRequest("Peça nova", 3)
            ]
        };

        var response = await _client.PutAsJsonAsync($"/api/products/{created.Id}", updateRequest);
        response.EnsureSuccessStatusCode();

        var updated = await response.Content.ReadFromJsonAsync<Product>();

        Assert.NotNull(updated);
        Assert.Equal(updateRequest.Name, updated!.Name);
        Assert.Single(updated.Parts);
    }

    [Fact]
    public async Task DeleteProduct_ShouldReturnNotFoundAfterDeletion()
    {
        var created = await CreateProductAsync();

        var deleteResponse = await _client.DeleteAsync($"/api/products/{created.Id}");
        deleteResponse.EnsureSuccessStatusCode();

        var getResponse = await _client.GetAsync($"/api/products/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    private static CreateProductRequest BuildProductRequest() => new()
    {
        Name = "Produto Teste",
        Description = "Uso em teste",
        Parts =
        [
            new ProductPartRequest("Parte A", 1),
            new ProductPartRequest("Parte B", 2)
        ]
    };

    private async Task<Product> CreateProductAsync()
    {
        var request = BuildProductRequest();
        var response = await _client.PostAsJsonAsync("/api/products", request);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<Product>())!;
    }
}
