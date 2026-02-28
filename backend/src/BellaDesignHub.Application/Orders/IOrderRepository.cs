using BellaDesignHub.Domain.Entities;

namespace BellaDesignHub.Application.Orders;

public interface IOrderRepository
{
    Task<List<Order>> ListAsync(OrderQueryFilter filter, CancellationToken cancellationToken);
    Task<Order?> GetByIdAsync(Guid id, bool asNoTracking, CancellationToken cancellationToken);
    Task<bool> CustomerExistsAsync(Guid customerId, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Guid>> GetExistingProductIdsAsync(IReadOnlyCollection<Guid> productIds, CancellationToken cancellationToken);
    Task AddAsync(Order order, CancellationToken cancellationToken);
    void ReplaceItems(Order order, IReadOnlyCollection<OrderItem> newItems);
    void Remove(Order order);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
