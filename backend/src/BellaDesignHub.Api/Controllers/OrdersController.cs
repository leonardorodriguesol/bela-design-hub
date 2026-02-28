using BellaDesignHub.Application.Models.Requests;
using BellaDesignHub.Application.Orders;
using BellaDesignHub.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BellaDesignHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(IOrderApplicationService orderService) : ControllerBase
{
    private readonly IOrderApplicationService _orderService = orderService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders(
        [FromQuery] Guid? customerId,
        [FromQuery] OrderStatus? status,
        [FromQuery] DateTime? createdFrom,
        [FromQuery] DateTime? createdTo,
        CancellationToken cancellationToken)
    {
        var orders = await _orderService.GetOrdersAsync(
            new OrderQueryFilter(customerId, status, createdFrom, createdTo),
            cancellationToken);

        return Ok(orders);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Order>> GetOrderById(Guid id, CancellationToken cancellationToken)
    {
        var order = await _orderService.GetOrderByIdAsync(id, cancellationToken);

        if (order is null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var result = await _orderService.CreateOrderAsync(request, cancellationToken);

        if (!result.IsSuccess)
        {
            return result.Error switch
            {
                OrderOperationError.CustomerNotFound => BadRequest("Cliente não encontrado."),
                OrderOperationError.InvalidProducts => BadRequest("Um ou mais produtos informados não foram encontrados."),
                _ => BadRequest()
            };
        }

        var order = result.Value!;

        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Order>> UpdateOrder(Guid id, [FromBody] UpdateOrderRequest request, CancellationToken cancellationToken)
    {
        var result = await _orderService.UpdateOrderAsync(id, request, cancellationToken);

        if (!result.IsSuccess)
        {
            return result.Error switch
            {
                OrderOperationError.NotFound => NotFound(),
                OrderOperationError.InvalidProducts => BadRequest("Um ou mais produtos informados não foram encontrados."),
                _ => BadRequest()
            };
        }

        var order = result.Value!;

        return Ok(order);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteOrder(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _orderService.DeleteOrderAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
