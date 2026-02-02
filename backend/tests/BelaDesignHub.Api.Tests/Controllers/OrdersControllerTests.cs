using System.Net.Http.Json;
using BelaDesignHub.Api.Tests.Infrastructure;
using BelaDesignHub.Application.Models.Requests;
using BelaDesignHub.Domain.Entities;

namespace BelaDesignHub.Api.Tests.Controllers;

public class OrdersControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public OrdersControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateOrder_ShouldReturnOrderWithItems()
    {
        var customer = await CreateCustomerAsync();
        var request = new CreateOrderRequest(
            customer.Id,
            new List<OrderItemRequest>
            {
                new("Armário sob medida", 1, 2500m),
                new("Instalação", 1, 500m)
            },
            null,
            DateTime.UtcNow.AddDays(10));

        var response = await _client.PostAsJsonAsync("/api/orders", request);
        response.EnsureSuccessStatusCode();

        var order = await response.Content.ReadFromJsonAsync<Order>();

        Assert.NotNull(order);
        Assert.Equal(2, order!.Items.Count);
        Assert.Equal(3000m, order.TotalAmount);
    }

    private async Task<Customer> CreateCustomerAsync()
    {
        var payload = new CreateCustomerRequest("Cliente Pedido", "pedido@teste.com", null, null);
        var response = await _client.PostAsJsonAsync("/api/customers", payload);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<Customer>())!;
    }
}
