using System.Net.Http.Json;
using BelaDesignHub.Api.Tests.Infrastructure;
using BelaDesignHub.Application.Models.Requests;
using BelaDesignHub.Domain.Entities;

namespace BelaDesignHub.Api.Tests.Controllers;

public class CustomersControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public CustomersControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateCustomer_ShouldPersistAndReturnCustomer()
    {
        var payload = new CreateCustomerRequest("Cliente Teste", "cliente@teste.com", "11999999999", "Rua A, 123");

        var response = await _client.PostAsJsonAsync("/api/customers", payload);
        response.EnsureSuccessStatusCode();

        var created = await response.Content.ReadFromJsonAsync<Customer>();

        Assert.NotNull(created);
        Assert.Equal(payload.Name, created!.Name);

        var listResponse = await _client.GetAsync("/api/customers");
        listResponse.EnsureSuccessStatusCode();
        var customers = await listResponse.Content.ReadFromJsonAsync<List<Customer>>();

        Assert.Contains(customers!, c => c.Id == created.Id);
    }
}
