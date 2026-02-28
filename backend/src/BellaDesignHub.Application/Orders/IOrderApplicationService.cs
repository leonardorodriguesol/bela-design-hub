using BellaDesignHub.Application.Models.Requests;
using BellaDesignHub.Domain.Entities;

namespace BellaDesignHub.Application.Orders;

public interface IOrderApplicationService
{
    Task<IReadOnlyList<Order>> GetOrdersAsync(OrderQueryFilter filter, CancellationToken cancellationToken);
    Task<Order?> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<OrderOperationResult<Order>> CreateOrderAsync(CreateOrderRequest request, CancellationToken cancellationToken);
    Task<OrderOperationResult<Order>> UpdateOrderAsync(Guid id, UpdateOrderRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteOrderAsync(Guid id, CancellationToken cancellationToken);
}
