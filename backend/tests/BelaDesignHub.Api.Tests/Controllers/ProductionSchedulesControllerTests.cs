using System.Net;
using System.Net.Http.Json;
using BelaDesignHub.Api.Tests.Infrastructure;
using BelaDesignHub.Application.Models.Requests;
using BelaDesignHub.Domain.Entities;

namespace BelaDesignHub.Api.Tests.Controllers;

public class ProductionSchedulesControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ProductionSchedulesControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateSchedule_ShouldCalculateParts()
    {
        var product = await CreateProductAsync();
        var request = new CreateProductionScheduleRequest
        {
            ProductId = product.Id,
            ScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.Date),
            Quantity = 3
        };

        var response = await _client.PostAsJsonAsync("/api/productionSchedules", request);
        response.EnsureSuccessStatusCode();

        var schedule = await response.Content.ReadFromJsonAsync<ProductionSchedule>();

        Assert.NotNull(schedule);
        Assert.Equal(request.Quantity, schedule!.Quantity);
        Assert.All(schedule.Parts, part => Assert.True(part.Quantity % request.Quantity == 0));
    }

    [Fact]
    public async Task GetSchedules_WithDateFilter_ShouldReturnCreatedSchedule()
    {
        var schedule = await CreateScheduleAsync();
        var response = await _client.GetAsync($"/api/productionSchedules?scheduledDate={schedule.ScheduledDate:O}");
        response.EnsureSuccessStatusCode();

        var schedules = await response.Content.ReadFromJsonAsync<List<ProductionSchedule>>();
        Assert.Contains(schedules!, s => s.Id == schedule.Id);
    }

    [Fact]
    public async Task UpdateStatus_ShouldPersistChange()
    {
        var schedule = await CreateScheduleAsync();
        var payload = new UpdateProductionStatusRequest { Status = ProductionStatus.InProgress };

        var response = await _client.PatchAsJsonAsync($"/api/productionSchedules/{schedule.Id}/status", payload);
        response.EnsureSuccessStatusCode();

        var updated = await response.Content.ReadFromJsonAsync<ProductionSchedule>();
        Assert.NotNull(updated);
        Assert.Equal(payload.Status, updated!.Status);
    }

    [Fact]
    public async Task DeleteSchedule_ShouldReturnNotFoundAfterDeletion()
    {
        var schedule = await CreateScheduleAsync();

        var deleteResponse = await _client.DeleteAsync($"/api/productionSchedules/{schedule.Id}");
        deleteResponse.EnsureSuccessStatusCode();

        var getResponse = await _client.GetAsync($"/api/productionSchedules/{schedule.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    private async Task<Product> CreateProductAsync()
    {
        var request = new CreateProductRequest
        {
            Name = $"Produto Teste {Guid.NewGuid():N}",
            Description = "Usado em testes",
            Parts =
            [
                new ProductPartRequest("Estrutura", "120x60", 1),
                new ProductPartRequest("Porta", "70x50", 2)
            ]
        };

        var response = await _client.PostAsJsonAsync("/api/products", request);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<Product>())!;
    }

    private async Task<ProductionSchedule> CreateScheduleAsync()
    {
        var product = await CreateProductAsync();
        var request = new CreateProductionScheduleRequest
        {
            ProductId = product.Id,
            ScheduledDate = DateOnly.FromDateTime(DateTime.UtcNow.Date),
            Quantity = 2
        };

        var response = await _client.PostAsJsonAsync("/api/productionSchedules", request);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ProductionSchedule>())!;
    }
}
