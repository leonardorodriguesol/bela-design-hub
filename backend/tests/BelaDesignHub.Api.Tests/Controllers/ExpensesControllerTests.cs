using System.Net.Http.Json;
using BelaDesignHub.Api.Tests.Infrastructure;
using BelaDesignHub.Application.Models.Requests;
using BelaDesignHub.Domain.Entities;

namespace BelaDesignHub.Api.Tests.Controllers;

public class ExpensesControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ExpensesControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateExpense_ThenFilterByDate_ShouldReturnEntry()
    {
        var today = DateTime.UtcNow.Date;
        var request = new CreateExpenseRequest("Compra MDF", 1200m, ExpenseCategory.Materials, today, null);

        var createResponse = await _client.PostAsJsonAsync("/api/expenses", request);
        createResponse.EnsureSuccessStatusCode();

        var listResponse = await _client.GetAsync($"/api/expenses?startDate={today:O}&endDate={today.AddDays(1):O}");
        listResponse.EnsureSuccessStatusCode();

        var expenses = await listResponse.Content.ReadFromJsonAsync<List<Expense>>();

        Assert.Contains(expenses!, e => e.Description == request.Description && e.Amount == request.Amount);
    }
}
